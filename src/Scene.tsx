import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Environment, ContactShadows, Sparkles, Sphere, Torus, RoundedBox, Text } from '@react-three/drei'
import { Physics, RigidBody, BallCollider, CuboidCollider } from '@react-three/rapier'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { faceState } from '../lib/faceControl'

const isMobile = typeof window !== 'undefined' && (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 850)

// Render a 3D scene only while it is actually on screen (saves a lot of CPU/GPU on phones)
function useOnScreen<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return [ref, visible] as const
}

function OrbitalCharacter() {
  const group = useRef<THREE.Group>(null!)
  const head = useRef<THREE.Mesh>(null!)
  useFrame(({ pointer, clock }, delta) => {
    const t = clock.elapsedTime
    const speed = 60 // higher = faster follow
    // camera head-tracking (if enabled and a face is seen) overrides the mouse/touch pointer
    const px = faceState.active ? faceState.x : pointer.x
    const py = faceState.active ? faceState.y : pointer.y
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, px * .7 + Math.sin(t * .28) * .08, speed, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -py * .4, speed, delta)
    group.current.position.y = Math.sin(t * .8) * .12
    if (head.current) head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, px * .45, speed + 8, delta)
  })
  return <group ref={group}>
    <Float speed={1.4} rotationIntensity={.18} floatIntensity={.35}>
      <group position={[0, -.18, 0]}>
        <RoundedBox args={[1.45, 1.62, .88]} radius={.24} smoothness={5} position={[0, -.45, 0]} castShadow>
          <meshStandardMaterial color="#21192a" metalness={.65} roughness={.25} />
        </RoundedBox>
        <mesh position={[0, -.36, .46]}><planeGeometry args={[.95, .78]} /><meshBasicMaterial color="#B6FF00" transparent opacity={.12} /></mesh>
        <Sphere ref={head} args={[.72, 48, 48]} position={[0, .82, 0]} castShadow>
          <meshPhysicalMaterial color="#b9ff32" metalness={.2} roughness={.22} clearcoat={1} clearcoatRoughness={.12} />
        </Sphere>
        <Sphere args={[.47, 40, 40]} position={[0, .84, .42]}>
          <meshPhysicalMaterial color="#151119" metalness={.7} roughness={.18} clearcoat={1} />
        </Sphere>
        <mesh position={[-.17, .86, .83]}><sphereGeometry args={[.055, 20, 20]} /><meshBasicMaterial color="#B6FF00" /></mesh>
        <mesh position={[.17, .86, .83]}><sphereGeometry args={[.055, 20, 20]} /><meshBasicMaterial color="#B6FF00" /></mesh>
        <Torus args={[.89, .018, 12, 100]} rotation={[Math.PI / 2.7, .25, .2]} position={[0, .1, 0]}>
          <meshBasicMaterial color="#B6FF00" transparent opacity={.9} />
        </Torus>
        <Torus args={[1.15, .009, 8, 100]} rotation={[1.2, -.35, .4]}>
          <meshBasicMaterial color="#a78bfa" transparent opacity={.75} />
        </Torus>
        <mesh position={[-.88, -.55, .1]} rotation={[0, 0, -.25]}><capsuleGeometry args={[.13, .68, 6, 12]} /><meshStandardMaterial color="#6d4aff" metalness={.55} roughness={.3} /></mesh>
        <mesh position={[.88, -.55, .1]} rotation={[0, 0, .25]}><capsuleGeometry args={[.13, .68, 6, 12]} /><meshStandardMaterial color="#6d4aff" metalness={.55} roughness={.3} /></mesh>
      </group>
    </Float>
    <Sparkles count={55} scale={4.4} size={2.3} speed={.35} color="#B6FF00" opacity={.8} />
  </group>
}

const techColors = ['#B6FF00', '#a78bfa', '#f6f2ff', '#ff8d75', '#6ee7f9', '#d6ff7f']
function PhysicsSpheres() {
  const items = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ id: i, position: [((i % 4) - 1.5) * .72, 1.8 + Math.floor(i / 4) * .72, (i % 3) * .24] as [number, number, number], color: techColors[i % techColors.length], scale: .22 + (i % 3) * .035 })), [])
  return <Physics gravity={[0, -3.5, 0]}>
    <RigidBody type="fixed" colliders={false} position={[0, -1.15, 0]}><CuboidCollider args={[3, .12, 1]} /></RigidBody>
    {items.map((item) => <RigidBody key={item.id} position={item.position} colliders="ball" restitution={.84} friction={.2} linearDamping={.2} angularDamping={.2}>
      <Sphere args={[item.scale, 32, 32]} castShadow>
        <meshPhysicalMaterial color={item.color} roughness={.2} metalness={.18} clearcoat={1} clearcoatRoughness={.1} />
      </Sphere>
    </RigidBody>)}
  </Physics>
}

export function HeroScene() {
  const [ref, visible] = useOnScreen<HTMLDivElement>()
  return <div ref={ref} className="scene-wrap"><Canvas shadows={!isMobile} frameloop={visible ? 'always' : 'never'} camera={{ position: [0, 0, 6.8], fov: 38 }} dpr={isMobile ? 1 : [1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <ambientLight intensity={1.1} /><directionalLight position={[4, 6, 5]} intensity={2.5} castShadow={!isMobile} /><pointLight position={[-3, 1, 3]} color="#8b5cf6" intensity={18} />
    <OrbitalCharacter /><Environment preset="city" /><ContactShadows position={[0, -2.1, 0]} opacity={.3} scale={5} blur={2.5} far={4} frames={isMobile ? 1 : Infinity} />
  </Canvas></div>
}
export function TechScene() {
  const [ref, visible] = useOnScreen<HTMLDivElement>()
  return <div ref={ref} className="scene-wrap"><Canvas frameloop={visible ? 'always' : 'never'} camera={{ position: [0, 0, 6], fov: 45 }} dpr={isMobile ? 1 : [1, 1.4]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <ambientLight intensity={1.4} /><directionalLight position={[4, 5, 6]} intensity={2.2} /><pointLight position={[-4, 2, 3]} color="#8b5cf6" intensity={12} />
    <PhysicsSpheres /><Environment preset="city" />
  </Canvas></div>
}
