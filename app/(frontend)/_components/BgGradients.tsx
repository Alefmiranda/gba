'use client'

import { motion, useScroll, useTransform } from 'motion/react'

const bars = [
  { left: '5%', width: 220 },
  { left: '20%', width: 160 },
  { left: '35%', width: 240 },
  { left: '52%', width: 180 },
  { left: '68%', width: 220 },
  { left: '83%', width: 160 },
]

export function BgGradients() {
  const { scrollYProgress } = useScroll()
  // sobe pra cima conforme rola (parallax): começa abaixo da viewport,
  // chega na altura do hero quando scroll está no final
  const translateY = useTransform(scrollYProgress, [0, 1], ['30%', '-100%'])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 h-screen z-50 overflow-visible mix-blend-multiply"
    >
      <motion.div className="relative w-full h-full" style={{ y: translateY }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: bar.left,
              width: bar.width,
              height: '90vh',
              background:
                'linear-gradient(180deg, transparent 0%, rgba(119,205,222,0.5) 35%, rgba(5,58,68,0.85) 100%)',
              filter: 'blur(60px)',
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
