import { useState } from 'react'
import { motion } from 'framer-motion'
import { Infinity as InfinityIcon, Calculator, Sparkles } from 'lucide-react'
import { ECONOMICS } from '../../lib/constants'

const { storageCostPerYear: COST } = ECONOMICS

export default function SustainabilityCalc() {
  const [deposit, setDeposit] = useState(5)
  const [apy, setApy] = useState(8)

  const annualYield = deposit * (apy / 100)
  const coverage = annualYield / COST // berapa kali yield menutup biaya tahunan
  const perpetual = annualYield >= COST
  const worstCaseYears = deposit / COST // tanpa yield, principal saja
  const years = perpetual
    ? Infinity
    : deposit / (COST - annualYield)

  // gauge 0..100 — 100% = perpetual.
  const gauge = Math.min(100, coverage * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="bg-gradient-to-br from-violet-600 to-purple-800 text-white rounded-3xl p-7 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
          <Calculator size={22} className="text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight">
            Sustainability Calculator
          </h3>
          <p className="text-xs text-violet-200">
            Hanya yield yang dipakai — principal tak tersentuh
          </p>
        </div>
      </div>

      {/* Headline */}
      <div className="rounded-2xl bg-white/10 backdrop-blur p-5 text-center">
        {perpetual ? (
          <>
            <div className="flex items-center justify-center gap-2 text-4xl font-bold">
              <InfinityIcon size={38} className="text-yellow-300" />
              <span>Perpetual</span>
            </div>
            <p className="text-violet-100 text-sm mt-1">
              Yield menutup{' '}
              <span className="font-bold text-yellow-300">
                {coverage.toFixed(1)}×
              </span>{' '}
              biaya storage tahunan — skill tak pernah hilang.
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl font-bold">
              ~{years.toFixed(0)}{' '}
              <span className="text-xl font-medium text-violet-200">tahun</span>
            </div>
            <p className="text-violet-100 text-sm mt-1">
              Yield belum menutup biaya — perpanjang dari principal.
            </p>
          </>
        )}
      </div>

      {/* Gauge */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-violet-200 mb-1.5">
          <span>Yield vs biaya storage</span>
          <span className="font-semibold text-white">
            {coverage >= 1 ? '100%+ ' : `${gauge.toFixed(0)}% `}covered
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-white/15 overflow-hidden">
          <motion.div
            key={gauge}
            initial={{ width: 0 }}
            animate={{ width: `${gauge}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-emerald-400"
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

      <p className="mt-5 flex items-start gap-2 text-xs text-violet-200">
        <Sparkles size={14} className="flex-shrink-0 mt-0.5 text-yellow-300" />
        Tanpa yield sekalipun, {deposit} SUI mendanai ~
        {worstCaseYears.toFixed(0)} tahun storage dari principal.
      </p>
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
        <span className="text-violet-100 font-medium">{label}</span>
        <span className="font-bold">
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
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-white/20 accent-yellow-300"
      />
    </div>
  )
}
