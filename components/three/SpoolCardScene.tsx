'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Billboard, ContactShadows, OrbitControls, useTexture } from '@react-three/drei'
import type { Group } from 'three'

const CARD_HEIGHT = 2.2

function Card({ src }: { src: string }) {
  const texture = useTexture(src)
  const group = useRef<Group>(null)

  const image = texture.image as HTMLImageElement
  const width = CARD_HEIGHT * (image.width / image.height)

  useFrame(({ clock }) => {
    if (!group.current) return
    group.current.position.y = Math.sin(clock.elapsedTime * 0.9) * 0.08
  })

  return (
    <group ref={group}>
      <Billboard>
        <mesh>
          <planeGeometry args={[width, CARD_HEIGHT]} />
          <meshBasicMaterial map={texture} transparent alphaTest={0.4} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  )
}

export function SpoolCardScene({ src }: { src: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 4.4], fov: 36 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Card key={src} src={src} />
      </Suspense>
      <ContactShadows position={[0, -1.1, 0]} opacity={0.3} blur={2.2} far={3} scale={6} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={1.6}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  )
}
