import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Canvas dipasang pointer-events:none agar tombol hero tetap bisa diklik,
// jadi posisi mouse diambil dari window — bukan dari pointer event canvas.
function useWindowMouse() {
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])
  return mouse
}

// Node acak dalam bola + garis penghubung antar node terdekat → kesan
// neural network / synapse, sesuai tema "memory for AI agents".
function NeuralNetwork({ count = 140, radius = 6.5 }: { count?: number; radius?: number }) {
  const group = useRef<THREE.Group>(null)
  const mouse = useWindowMouse()

  const { positions, linePositions } = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      pts.push(
        new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5,
        )
          .normalize()
          .multiplyScalar(radius * Math.cbrt(Math.random())),
      )
    }
    const positions = new Float32Array(count * 3)
    pts.forEach((p, i) => p.toArray(positions, i * 3))

    const lines: number[] = []
    const maxDist = radius * 0.4
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        if (pts[i].distanceTo(pts[j]) < maxDist) {
          lines.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z)
        }
      }
    }
    return { positions, linePositions: new Float32Array(lines) }
  }, [count, radius])

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    // Rotasi pelan + parallax mengikuti mouse (lerp halus, tanpa jitter).
    group.current.rotation.y +=
      (t * 0.045 + mouse.current.x * 0.3 - group.current.rotation.y) * 0.05
    group.current.rotation.x +=
      (Math.sin(t * 0.1) * 0.08 + mouse.current.y * 0.18 - group.current.rotation.x) * 0.05
  })

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.075}
          color="#A5B4FC"
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6366F1" transparent opacity={0.14} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <NeuralNetwork />
    </Canvas>
  )
}
