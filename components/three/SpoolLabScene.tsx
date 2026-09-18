'use client'

import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, ContactShadows, OrbitControls, useTexture } from '@react-three/drei'
import gsap from 'gsap'
import type { Group, Texture } from 'three'

const IMAGE_SOURCES = [
  '/lab/spools/spool-stack.webp',
  '/lab/spools/spool-trio.webp',
  '/lab/spools/spool-three-floor.webp',
  '/lab/spools/spool-pair-tarp.webp',
] as const

const RING_RADIUS = 2.6
const CARD_HEIGHT = 1.9
const FLOAT_AMPLITUDE = 0.12

function SpoolCard({ texture, index, total }: { texture: Texture; index: number; total: number }) {
  const bob = useRef<Group>(null)
  const angle = (index / total) * Math.PI * 2
  const x = Math.sin(angle) * RING_RADIUS
  const z = Math.cos(angle) * RING_RADIUS
  const phase = index * 1.7

  const image = texture.image as HTMLImageElement
  const aspect = image.width / image.height
  const width = CARD_HEIGHT * aspect

  useFrame(({ clock }) => {
    if (!bob.current) return
    bob.current.position.y = Math.sin(clock.elapsedTime * 0.8 + phase) * FLOAT_AMPLITUDE
  })

  return (
    <group position={[x, 0, z]}>
      <group ref={bob}>
        <Billboard>
          <mesh castShadow>
            <planeGeometry args={[width, CARD_HEIGHT]} />
            <meshBasicMaterial map={texture} transparent alphaTest={0.4} toneMapped={false} />
          </mesh>
        </Billboard>
      </group>
    </group>
  )
}

function SpoolRing() {
  const textures = useTexture([...IMAGE_SOURCES])
  const root = useRef<Group>(null)

  useEffect(() => {
    if (!root.current) return
    gsap.fromTo(
      root.current.scale,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1, duration: 1.1, ease: 'back.out(1.6)' },
    )
  }, [])

  return (
    <group ref={root} position={[0, 0.4, 0]}>
      {textures.map((texture, index) => (
        <SpoolCard
          key={IMAGE_SOURCES[index]}
          texture={texture}
          index={index}
          total={textures.length}
        />
      ))}
    </group>
  )
}

export function SpoolLabScene() {
  return (
    <Canvas camera={{ position: [0, 1.6, 6], fov: 42 }} dpr={[1, 1.5]} shadows>
      <color attach="background" args={['#0b0e10']} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={1} castShadow />
      <Suspense fallback={null}>
        <SpoolRing />
      </Suspense>
      <ContactShadows position={[0, -1, 0]} opacity={0.45} blur={2.4} far={3} scale={8} />
      <OrbitControls
        target={[0, 0.4, 0]}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1.1}
        minDistance={3.5}
        maxDistance={9}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.9}
      />
    </Canvas>
  )
}
