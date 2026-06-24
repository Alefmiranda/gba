'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

export function Preloader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => {
      setDone(true)
      document.body.style.overflow = ''
    }, 1200)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.55, ease }}
          className="fixed inset-0 z-[100] bg-canvas flex items-center justify-center overflow-hidden"
        >
          {/* logo cor original + brilho varrendo */}
          <div className="preloader-logo relative overflow-hidden">
            <Image
              src="/logo-gb.svg"
              alt="Guilherme Borges Assessoria"
              width={300}
              height={64}
              priority
              className="h-12 lg:h-16 w-auto"
            />
            {/* sweep de brilho ciano cruzando a logo */}
            <div
              aria-hidden
              className="preloader-sweep absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(105deg, transparent 35%, rgba(119,205,222,0.55) 50%, transparent 65%)',
              }}
            />
          </div>

          {/* flash ciano cobrindo a tela */}
          <div
            aria-hidden
            className="preloader-flash absolute inset-0 bg-brand-accent pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
