'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const COLORS = [
  new THREE.Color(0xe8c547), // gold   — BUILD
  new THREE.Color(0x8b7cd4), // lav    — DEPLOY
  new THREE.Color(0xe8e4d8), // cream  — REPEAT
]

function particleColor(t: number): [number, number, number] {
  const seg  = t * 3
  const idx  = Math.floor(seg) % 3
  const frac = seg - Math.floor(seg)
  const a    = COLORS[idx]    ?? COLORS[0]!
  const b    = COLORS[(idx + 1) % 3] ?? COLORS[0]!
  return [
    a.r + (b.r - a.r) * frac,
    a.g + (b.g - a.g) * frac,
    a.b + (b.b - a.b) * frac,
  ]
}

export default function AboutPipeline() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const l0Ref    = useRef<HTMLDivElement>(null)
  const l1Ref    = useRef<HTMLDivElement>(null)
  const l2Ref    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const el   = mountRef.current
    const l0   = l0Ref.current
    const l1   = l1Ref.current
    const l2   = l2Ref.current
    if (!wrap || !el || !l0 || !l1 || !l2) return

    const labelEls = [l0, l1, l2]
    let w = el.clientWidth
    let h = el.clientHeight

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100)
    camera.position.set(0, 0.3, 6.5)

    // ── Triangle node positions ───────────────────────────────────
    const R = 2.0
    const nodePos = [0, 1, 2].map(i => {
      const a = Math.PI / 2 + (i * Math.PI * 2) / 3
      return new THREE.Vector3(R * Math.cos(a), R * Math.sin(a), 0)
    })

    // Midpoints between nodes for a rounder pipe shape
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < 3; i++) {
      const a = nodePos[i]!
      const b = nodePos[(i + 1) % 3]!
      pts.push(a.clone())
      pts.push(new THREE.Vector3().lerpVectors(a, b, 0.33))
      pts.push(new THREE.Vector3().lerpVectors(a, b, 0.67))
    }
    const curve = new THREE.CatmullRomCurve3(pts, true, 'catmullrom', 0.4)

    // ── Pipe ─────────────────────────────────────────────────────
    const pipeGeo = new THREE.TubeGeometry(curve, 220, 0.042, 8, true)
    const pipeMat = new THREE.MeshStandardMaterial({
      color:       0x2a2520,
      metalness:   0.7,
      roughness:   0.35,
      transparent: true,
      opacity:     0.8,
    })

    // ── Node spheres ──────────────────────────────────────────────
    const nodeGeo = new THREE.SphereGeometry(0.24, 24, 24)
    const nodeMats = COLORS.map(c =>
      new THREE.MeshStandardMaterial({
        color:     c.clone(),
        metalness: 0.45,
        roughness: 0.28,
        emissive:  c.clone().multiplyScalar(0.2),
      })
    )
    const nodeMeshes = nodePos.map((pos, i) => {
      const mesh = new THREE.Mesh(nodeGeo, nodeMats[i] ?? nodeMats[0]!)
      mesh.position.copy(pos)
      return mesh
    })

    // ── Particles ─────────────────────────────────────────────────
    const N         = 90
    const pPos      = new Float32Array(N * 3)
    const pCol      = new Float32Array(N * 3)
    const pGeo      = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3))

    const dotCanvas = document.createElement('canvas')
    dotCanvas.width = dotCanvas.height = 64
    const ctx = dotCanvas.getContext('2d')!
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grad.addColorStop(0,   'rgba(255,255,255,1)')
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)')
    grad.addColorStop(1,   'rgba(255,255,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 64, 64)
    const dotTex = new THREE.CanvasTexture(dotCanvas)

    const pMat = new THREE.PointsMaterial({
      size:         0.13,
      map:          dotTex,
      vertexColors: true,
      transparent:  true,
      opacity:      0.95,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(pGeo, pMat)

    // ── Group ─────────────────────────────────────────────────────
    const group = new THREE.Group()
    group.add(new THREE.Mesh(pipeGeo, pipeMat))
    nodeMeshes.forEach(m => group.add(m))
    group.add(particles)
    group.rotation.x = -0.38
    group.rotation.z =  0.08
    scene.add(group)

    // ── Lights ────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 1.1))

    const key = new THREE.DirectionalLight(0xfff8e0, 3.2)
    key.position.set(4, 6, 6)
    scene.add(key)

    // Node glow lights (in group space so they rotate with it)
    nodePos.forEach((pos, i) => {
      const light = new THREE.PointLight((COLORS[i] ?? COLORS[0]!).getHex(), 2.8, 5)
      light.position.copy(pos)
      group.add(light)
    })

    // ── Mouse ─────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation ─────────────────────────────────────────────────
    let animId: number
    const clock  = new THREE.Clock()
    let   tBase  = 0
    const SPEED  = 0.055
    const tmpVec = new THREE.Vector3()

    const posAttr = pGeo.attributes['position'] as THREE.BufferAttribute
    const colAttr = pGeo.attributes['color']    as THREE.BufferAttribute

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const dt = clock.getDelta()
      tBase = (tBase + dt * SPEED) % 1

      // Update particle positions + colors
      for (let i = 0; i < N; i++) {
        const t  = (tBase + i / N) % 1
        const pt = curve.getPoint(t)
        posAttr.array[i * 3]     = pt.x
        posAttr.array[i * 3 + 1] = pt.y
        posAttr.array[i * 3 + 2] = pt.z
        const [r, g, b] = particleColor(t)
        colAttr.array[i * 3]     = r
        colAttr.array[i * 3 + 1] = g
        colAttr.array[i * 3 + 2] = b
      }
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true

      group.rotation.y += 0.004
      group.rotation.x += (-0.38 + mouse.y * 0.1 - group.rotation.x) * 0.04

      renderer.render(scene, camera)

      // Pin labels to node world positions
      labelEls.forEach((label, i) => {
        const mesh = nodeMeshes[i]
        if (!mesh) return
        mesh.getWorldPosition(tmpVec)
        tmpVec.project(camera)
        const behind = tmpVec.z > 1
        label.style.opacity = behind ? '0' : '1'
        if (!behind) {
          label.style.left = `${( tmpVec.x * 0.5 + 0.5) * w}px`
          label.style.top  = `${(-tmpVec.y * 0.5 + 0.5) * h}px`
        }
      })
    }
    animate()

    const onResize = () => {
      w = el.clientWidth
      h = el.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      pipeGeo.dispose()
      pipeMat.dispose()
      nodeGeo.dispose()
      nodeMats.forEach(m => m.dispose())
      pGeo.dispose()
      pMat.dispose()
      dotTex.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  const labelStyle: React.CSSProperties = {
    position:      'absolute',
    fontFamily:    'var(--font-mono)',
    fontSize:      '8px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color:         'var(--ink)',
    pointerEvents: 'none',
    transform:     'translate(-50%, -200%)',
    background:    'rgba(244,240,232,0.82)',
    padding:       '3px 8px',
    borderRadius:  '3px',
    whiteSpace:    'nowrap',
    transition:    'opacity 0.2s',
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
      <div ref={l0Ref} style={labelStyle}>BUILD_</div>
      <div ref={l1Ref} style={labelStyle}>DEPLOY_</div>
      <div ref={l2Ref} style={labelStyle}>REPEAT_</div>
    </div>
  )
}
