import { useState } from 'react'
import { motion } from 'framer-motion'
import { Infinity as InfinityIcon, Calculator, Sparkles } from 'lucide-react'
import { ECONOMICS } from '../../lib/constants'
import TiltCard from '../ui/TiltCard'

const { storageCostPerYear: COST } = ECONOMICS

export default function SustainabilityCalc() {
  const [deposit, setDeposit] = useState(5)
  const [apy, setApy] = useState(8)

  const annualYield = deposit * (apy / 100)
  const coverage = annualYield / COST
  const perpetual = annualYield >= COST
  const worstCaseYears = deposit / COST
  const years = perpetual ? Infinity : deposit / (COST - annualYield)

  const gauge = Math.min(100, coverage * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
    <TiltCard
      className="text-white p-7 backdrop-blur-xl"
      hoverShadow="0 0 0 1px rgba(129, 140, 248, 0.4), 0 24px 64px rgba(99, 102, 241, 0.18), 0 8px 24px rgba(0, 0, 0, 0.65)"
      style={{
        background:
          'linear-gradient(150deg, #1a1060 0%, #0e1840 45%, #0a1028 100%)',
        border: '1px solid rgba(129, 140, 248, 0.25)',
        boxShadow: '0 4px 28px rgba(0, 0, 0, 0.5)',
        borderRadius: '1.5rem',
      }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{
            background: 'rgba(129, 140, 248, 0.15)',
            border: '1px solid rgba(129, 140, 248, 0.25)',
          }}
        >
          <Calculator size={22} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight text-white">
            Sustainability Calculator
          </h3>
          <p className="text-xs" style={{ color: '#818CF8' }}>
            Only yield is used — principal untouched
          </p>
        </div>
      </div>

      {/* Headline */}
      <div
        className="rounded-2xl p-5 text-center"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {perpetual ? (
          <>
            <div className="flex items-center justify-center gap-2 text-4xl font-bold">
              <InfinityIcon size={38} style={{ color: '#FDE68A' }} />
              <span>Perpetual</span>
            </div>
            <p className="text-sm mt-1" style={{ color: '#A5B4FC' }}>
              Yield covers{' '}
              <span className="font-bold" style={{ color: '#FDE68A' }}>
                {coverage.toFixed(1)}×
              </span>{' '}
              annual storage cost — skills never expire.
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl font-bold">
              ~{years.toFixed(0)}{' '}
              <span className="text-xl font-medium" style={{ color: '#818CF8' }}>
                years
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: '#A5B4FC' }}>
              Yield insufficient — extending from principal.
            </p>
          </>
        )}
      </div>

      {/* Gauge */}
      <div className="mt-5">
        <div className="flex justify-between text-xs mb-1.5" style={{ color: '#818CF8' }}>
          <span>Yield vs storage cost</span>
          <span className="font-semibold text-white">
            {coverage >= 1 ? '100%+ ' : `${gauge.toFixed(0)}% `}covered
          </span>
        </div>
        <div
          className="h-2.5 rounded-full overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.08)' }}
        >
          <motion.div
            key={gauge}
            initial={{ width: 0 }}
            animate={{ width: `${gauge}%` }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              height: '100%',
              borderRadius: '9999px',
              background: 'linear-gradient(90deg, #FDE68A 0%, #34D399 100%)',
              boxShadow: '0 0 10px rgba(253,230,138,0.3)',
            }}
          />
        </div>
      </div>

      {/* Sliders */}
      <div className="mt-6 space-y-5">
        <Slider
          label="Deposit"
          value={deposit}
          min={1}
          max={50}
          step={1}
          suffix=" SUI"
          onChange={setDeposit}
        />
        <Slider
          label="APY Scallop"
          value={apy}
          min={0}
          max={15}
          step={0.5}
          suffix="%"
          onChange={setApy}
        />
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs" style={{ color: '#818CF8' }}>
        <Sparkles size={14} className="flex-shrink-0 mt-0.5" style={{ color: '#FDE68A' }} />
        Even without yield, {deposit} SUI funds ~
        {worstCaseYears.toFixed(0)} years of storage from principal.
      </p>
    </TiltCard>
    </motion.div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix: string
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium" style={{ color: '#A5B4FC' }}>
          {label}
        </span>
        <span className="font-bold text-white">
          {value}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-yellow-300"
        style={{ background: 'rgba(255,255,255,0.12)' }}
      />
    </div>
  )
}
