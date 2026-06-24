'use client'

import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        smoothWheel: true,
        // toque no celular fica nativo (sem inércia), evita jank
        anchors: { offset: -16 },
      }}
    >
      {children}
    </ReactLenis>
  )
}
