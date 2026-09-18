'use client'

import Image from 'next/image'
import { useRef } from 'react'

const MAX_TILT_DEG = 10

export function TiltCard({
  src,
  width,
  height,
  label,
}: {
  src: string
  width: number
  height: number
  label: string
}) {
  const card = useRef<HTMLDivElement>(null)

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    const node = card.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    node.style.transform = `perspective(900px) rotateX(${y * -MAX_TILT_DEG}deg) rotateY(${x * MAX_TILT_DEG}deg) scale(1.03)`
  }

  function handleLeave() {
    const node = card.current
    if (!node) return
    node.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      ref={card}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="flex items-center justify-center border border-line bg-paper-deep/40 p-8 transition-transform duration-300 ease-out will-change-transform"
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        className="h-48 w-auto drop-shadow-xl"
      />
      <span className="sr-only">{label}</span>
    </div>
  )
}
