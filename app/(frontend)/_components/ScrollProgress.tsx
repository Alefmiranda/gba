'use client'

import { useState } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'motion/react'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const width = useSpring(
    useTransform(scrollYProgress, [0, 1], ['0%', '100%']),
    { stiffness: 120, damping: 30, mass: 0.3 },
  )

  // GB some no topo e aparece ao rolar (toggle por estado = confiável)
  const [showGB, setShowGB] = useState(false)
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setShowGB(v > 0.015 && v < 0.995)
  })

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[95] h-[3px] pointer-events-none">
      <motion.div className="relative h-full bg-brand-accent" style={{ width }}>
        {/* GB na ponta da barra */}
        <span
          className={`absolute right-0 top-0 -translate-x-1/2 translate-y-[1px] grid size-[26px] place-items-center rounded-full bg-canvas shadow-[0_3px_12px_-2px_rgba(14,14,12,0.45)] ring-1 ring-ink/10 transition-opacity duration-300 ${
            showGB ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="block h-[12px] w-[18px] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-gb.svg" alt="" className="h-full w-auto max-w-none object-left" />
          </span>
        </span>
      </motion.div>
    </div>
  )
}
