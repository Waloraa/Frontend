// Vercel Edge Function — proxy Claude API untuk agent demo.
// Set ANTHROPIC_API_KEY di Vercel environment variables.
export const config = { runtime: 'edge' }

const CLAUDE_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-haiku-4-5-20251001'

interface ChatRequest {
  message: string
  memoryContext: string // skill context dari Walrus (sudah di-fetch di client)
  agentName?: string
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: ChatRequest
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  const { message, memoryContext, agentName = 'Walora Agent' } = body

  const systemPrompt = `You are ${agentName}, an AI agent with persistent skill memory stored on Walrus (decentralized storage on Sui blockchain).

Your memory is funded by a Waloraa endowment vault — users deposit SUI once, Scallop yield pays for storage renewals forever. Your skills never expire.

${memoryContext
    ? `=== SKILLS RETRIEVED FROM YOUR WALRUS MEMORY ===\n${memoryContext}\n=== END OF MEMORY ===\n\nUse the above skills from your persistent memory to inform your response. Reference specific skills when relevant.`
    : 'You have no relevant skills in memory for this query yet. Answer based on your training, then suggest saving this as a new skill.'
  }

Keep responses concise and actionable. If you use a skill from memory, briefly mention which one. At the end, suggest a skill name and content that could be saved to memory for future use (prefix with "💾 SAVE SKILL:").`

  const claudeRes = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }],
    }),
  })

  if (!claudeRes.ok) {
    const err = await claudeRes.text()
    return new Response(JSON.stringify({ error: `Claude API error: ${err}` }), {
      status: claudeRes.status,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const data = await claudeRes.json()
  const text: string = data.content?.[0]?.text ?? ''

  // Parse suggested skill dari response
  const saveMatch = text.match(/💾 SAVE SKILL:\s*\n?(.+)/s)
  const suggestedSkill = saveMatch ? saveMatch[1].trim() : null

  return new Response(
    JSON.stringify({ reply: text, suggestedSkill }),
    { headers: { 'Content-Type': 'application/json' } },
  )
}
