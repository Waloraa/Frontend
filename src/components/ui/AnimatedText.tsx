import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'

function AnimatedChar({
  char,
  index,
  total,
  scrollYProgress,
}: {
  char: string
  index: number
  total: number
  scrollYProgress: MotionValue<number>
}) {
  const start = (index / total) * 0.65
  const end = start + 0.2
  const opacity = useTransform(scrollYProgress, [start, end], [0.15, 1])
  return (
    <motion.span
      style={{ opacity, display: 'inline-block', whiteSpace: 'pre' }}
    >
      {char === ' ' ? ' ' : char}
    </motion.span>
  )
}

export default function AnimatedText({
  text,
  className = '',
  style,
}: {
  text: string
  className?: string
  style?: CSSProperties
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.25'],
  })
  return (
    <p ref={ref} className={className} style={style}>
      {text.split('').map((char, i) => (
        <AnimatedChar
          key={i}
          char={char}
          index={i}
          total={text.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </p>
  )
}
