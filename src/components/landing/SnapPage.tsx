'use client'

import type { CSSProperties, ReactNode } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

const HEADER_HEIGHT = 72

type SnapPageProps = {
  children: (scrollToId: (id: string) => void) => ReactNode
}

export default function SnapPage({ children }: SnapPageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(media.matches)
    updatePreference()
    if (media.addEventListener) {
      media.addEventListener('change', updatePreference)
      return () => media.removeEventListener('change', updatePreference)
    }
    media.addListener(updatePreference)
    return () => media.removeListener(updatePreference)
  }, [])

  const scrollToId = useCallback(
    (id: string) => {
      const container = containerRef.current
      if (!container) {
        return
      }
      const target = container.querySelector<HTMLElement>(`#${id}`)
      if (!target) {
        return
      }
      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    },
    [prefersReducedMotion],
  )

  const containerStyle = {
    '--header-height': `${HEADER_HEIGHT}px`,
  } as CSSProperties

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-auto overscroll-contain snap-y snap-mandatory scroll-smooth motion-reduce:scroll-auto"
      style={containerStyle}
    >
      {children(scrollToId)}
    </div>
  )
}
