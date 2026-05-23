'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── Palette ──────────────────────────────────────────────────────────
const C_NAVY    = 0x0a1828
const C_NAVY2   = 0x0d2238
const C_TEAL    = 0x00d4aa
const C_CYAN    = 0x00fff0
const C_AMBIENT = 0x0a1f30

type IconType = 'box' | 'hex' | 'ring' | 'cone' | 'orb'

const STAGES: { label: string; pos: [number, number, number]; icon: IconType }[] = [
  { label: 'COMMIT', pos: [-3.6, 0, -0.4], icon: 'box'  },
  { label: 'BUILD',  pos: [-1.8, 0,  0.4], icon: 'hex'  },
  { label: 'TEST',   pos: [ 0.0, 0, -0.4], icon: 'ring' },
  { label: 'DEPLOY', pos: [ 1.8, 0,  0.4], icon: 'cone' },
  { label: 'LIVE',   pos: [ 3.6, 0, -0.4], icon: 'orb'  },
]

function buildIcon(
  type: IconType,
  bodyMat: THREE.MeshStandardMaterial,
  glowMat: THREE.MeshStandardMaterial,
  geos: THREE.BufferGeometry[],
): THREE.Mesh {
  let geo: THREE.BufferGeometry
  let mat = bodyMat
  let tiltX = 0

  switch (type) {
    case 'box':
      geo = new THREE.BoxGeometry(0.2, 0.2, 0.2)
      break
    case 'hex':
      geo = new THREE.CylinderGeometry(0.14, 0.14, 0.2, 6)
      break
    case 'ring':
      geo = new THREE.TorusGeometry(0.13, 0.03, 12, 28)
      tiltX = Math.PI / 2
      break
    case 'cone':
      geo = new THREE.ConeGeometry(0.14, 0.24, 6)
      break
    case 'orb':
      geo = new THREE.SphereGeometry(0.14, 24, 24)
      mat = glowMat
      break
  }

  geos.push(geo)
  const mesh = new THREE.Mesh(geo, mat)
  if (tiltX) mesh.rotation.x = tiltX
  return mesh
}

export default function CICDPipeline3D() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const mountRef = useRef<HTMLDivElement>(null)
  const l0Ref    = useRef<HTMLDivElement>(null)
  const l1Ref    = useRef<HTMLDivElement>(null)
  const l2Ref    = useRef<HTMLDivElement>(null)
  const l3Ref    = useRef<HTMLDivElement>(null)
  const l4Ref    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const el   = mountRef.current
    const labelEls = [l0Ref.current, l1Ref.current, l2Ref.current, l3Ref.current, l4Ref.current]
    if (!wrap || !el || labelEls.some(l => !l)) return
    const labels = labelEls as HTMLDivElement[]

    let w = el.clientWidth
    let h = el.clientHeight

    // ── Renderer ───────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ── Orthographic isometric camera ──────────────────────
    const frustum = 3.4
    const aspect  = w / h
    const camera  = new THREE.OrthographicCamera(
      -frustum * aspect,  frustum * aspect,
       frustum,          -frustum,
      0.1, 100,
    )
    camera.position.set(10, 7, 10)
    camera.lookAt(0, 0, 0)

    const scene = new THREE.Scene()

    // ── Lights ─────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(C_AMBIENT, 2.0))

    const key = new THREE.DirectionalLight(0x00ffd0, 1.4)
    key.position.set(5, 8, 5)
    scene.add(key)

    const rim = new THREE.DirectionalLight(0x0044aa, 0.7)
    rim.position.set(-6, -2, -4)
    scene.add(rim)

    // ── Disposables ────────────────────────────────────────
    const geos: THREE.BufferGeometry[] = []
    const mats: THREE.Material[]       = []

    // ── Shared materials ───────────────────────────────────
    const platformMat = new THREE.MeshStandardMaterial({
      color: C_NAVY2, metalness: 0.85, roughness: 0.2,
      emissive: C_NAVY, emissiveIntensity: 0.35,
    })
    mats.push(platformMat)

    const iconMat = new THREE.MeshStandardMaterial({
      color: C_NAVY2, metalness: 0.85, roughness: 0.2,
      emissive: C_TEAL, emissiveIntensity: 0.18,
    })
    mats.push(iconMat)

    const orbGlowMat = new THREE.MeshStandardMaterial({
      color: C_TEAL, metalness: 0.3, roughness: 0.4,
      emissive: C_CYAN, emissiveIntensity: 2.2,
    })
    mats.push(orbGlowMat)

    const accentMat = new THREE.MeshBasicMaterial({ color: C_TEAL })
    mats.push(accentMat)

    // ── Root group ─────────────────────────────────────────
    const root = new THREE.Group()
    scene.add(root)

    const platformGroups: THREE.Group[] = []
    const iconMeshes:     THREE.Mesh[]  = []

    // ── Build platforms ────────────────────────────────────
    STAGES.forEach(stage => {
      const pg = new THREE.Group()

      // Platform body — hexagonal disc
      const pGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.08, 6)
      geos.push(pGeo)
      pg.add(new THREE.Mesh(pGeo, platformMat))

      // Top accent ring
      const ringGeo = new THREE.TorusGeometry(0.44, 0.011, 8, 24)
      geos.push(ringGeo)
      const ring = new THREE.Mesh(ringGeo, accentMat)
      ring.rotation.x = Math.PI / 2
      ring.position.y = 0.04
      pg.add(ring)

      // Icon on top
      const icon = buildIcon(stage.icon, iconMat, orbGlowMat, geos)
      icon.position.y = 0.24
      pg.add(icon)
      iconMeshes.push(icon)

      // Position
      pg.position.set(stage.pos[0], stage.pos[1], stage.pos[2])

      // Per-platform uplight (small range)
      const uplight = new THREE.PointLight(C_TEAL, 0.7, 1.4)
      uplight.position.set(0, 0.5, 0)
      pg.add(uplight)

      root.add(pg)
      platformGroups.push(pg)
    })

    // ── Tubes between platforms ────────────────────────────
    const curves: THREE.CatmullRomCurve3[] = []
    const tubeMats: THREE.MeshStandardMaterial[] = []

    for (let i = 0; i < STAGES.length - 1; i++) {
      const sa = STAGES[i]!
      const sb = STAGES[i + 1]!
      const a = new THREE.Vector3(sa.pos[0], sa.pos[1] + 0.22, sa.pos[2])
      const b = new THREE.Vector3(sb.pos[0], sb.pos[1] + 0.22, sb.pos[2])
      const mid = new THREE.Vector3().lerpVectors(a, b, 0.5)
      mid.y += 0.7

      const curve = new THREE.CatmullRomCurve3([a, mid, b])
      curves.push(curve)

      // Inner emissive tube
      const innerGeo = new THREE.TubeGeometry(curve, 60, 0.022, 6, false)
      geos.push(innerGeo)
      const innerMat = new THREE.MeshStandardMaterial({
        color: C_TEAL, emissive: C_TEAL, emissiveIntensity: 2.0,
        metalness: 0, roughness: 1,
      })
      mats.push(innerMat)
      tubeMats.push(innerMat)
      root.add(new THREE.Mesh(innerGeo, innerMat))

      // Outer halo
      const outerGeo = new THREE.TubeGeometry(curve, 60, 0.06, 6, false)
      geos.push(outerGeo)
      const outerMat = new THREE.MeshBasicMaterial({
        color: C_CYAN, transparent: true, opacity: 0.09,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      mats.push(outerMat)
      root.add(new THREE.Mesh(outerGeo, outerMat))
    }

    // ── Particles flowing through tubes ────────────────────
    const PER_TUBE = 9
    const TOTAL    = curves.length * PER_TUBE
    const pPos     = new Float32Array(TOTAL * 3)
    const pCol     = new Float32Array(TOTAL * 3)

    const particles: { t: number; ci: number; speed: number }[] = []
    curves.forEach((_, ci) => {
      for (let pi = 0; pi < PER_TUBE; pi++) {
        particles.push({
          t:     pi / PER_TUBE,
          ci,
          speed: 0.08 + Math.random() * 0.03,
        })
      }
    })

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3))
    geos.push(pGeo)

    // Soft circle texture
    const dotCanvas = document.createElement('canvas')
    dotCanvas.width = dotCanvas.height = 32
    const dCtx = dotCanvas.getContext('2d')!
    const dGrad = dCtx.createRadialGradient(16, 16, 0, 16, 16, 16)
    dGrad.addColorStop(0,   'rgba(255,255,255,1)')
    dGrad.addColorStop(0.4, 'rgba(255,255,255,0.6)')
    dGrad.addColorStop(1,   'rgba(255,255,255,0)')
    dCtx.fillStyle = dGrad
    dCtx.fillRect(0, 0, 32, 32)
    const dotTex = new THREE.CanvasTexture(dotCanvas)

    const pMat = new THREE.PointsMaterial({
      size: 0.13, map: dotTex, vertexColors: true,
      transparent: true, opacity: 1.0,
      blending: THREE.AdditiveBlending, depthWrite: false,
      sizeAttenuation: true,
    })
    mats.push(pMat)
    root.add(new THREE.Points(pGeo, pMat))

    const posAttr = pGeo.attributes['position'] as THREE.BufferAttribute
    const colAttr = pGeo.attributes['color']    as THREE.BufferAttribute

    // ── Mouse parallax ─────────────────────────────────────
    const mouse = { x: 0, y: 0 }
    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove)

    // ── Animation ──────────────────────────────────────────
    let animId: number
    const clock = new THREE.Clock()
    const tealC = new THREE.Color(C_TEAL)
    const cyanC = new THREE.Color(C_CYAN)
    const tmpC  = new THREE.Color()
    const tmpV  = new THREE.Vector3()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t  = clock.getElapsedTime()
      const dt = clock.getDelta()

      // Platforms bob, icons rotate
      platformGroups.forEach((pg, i) => {
        const base = STAGES[i]?.pos[1] ?? 0
        pg.position.y = base + Math.sin(t * 0.7 + i * 1.1) * 0.07
      })
      iconMeshes.forEach((m, i) => {
        m.rotation.y = t * 0.5 + i * 0.7
      })

      // Tube pulse
      const pulse = 1.8 + Math.sin(t * 1.6) * 0.4
      tubeMats.forEach(m => { m.emissiveIntensity = pulse })

      // Particles
      particles.forEach((p, idx) => {
        p.t = (p.t + dt * p.speed) % 1
        const curve = curves[p.ci]
        if (!curve) return
        const pt = curve.getPoint(p.t)
        posAttr.array[idx * 3]     = pt.x
        posAttr.array[idx * 3 + 1] = pt.y
        posAttr.array[idx * 3 + 2] = pt.z
        tmpC.lerpColors(tealC, cyanC, Math.sin(p.t * Math.PI))
        colAttr.array[idx * 3]     = tmpC.r
        colAttr.array[idx * 3 + 1] = tmpC.g
        colAttr.array[idx * 3 + 2] = tmpC.b
      })
      posAttr.needsUpdate = true
      colAttr.needsUpdate = true

      // Mouse parallax (very gentle)
      root.rotation.x += ( mouse.y * 0.06 - root.rotation.x) * 0.04
      root.rotation.y += (-mouse.x * 0.08 - root.rotation.y) * 0.04

      renderer.render(scene, camera)

      // Update label positions
      platformGroups.forEach((pg, i) => {
        const label = labels[i]
        if (!label) return
        pg.getWorldPosition(tmpV)
        tmpV.y += 0.62
        tmpV.project(camera)
        const behind = tmpV.z > 1
        label.style.opacity = behind ? '0' : '1'
        if (!behind) {
          label.style.left = `${( tmpV.x * 0.5 + 0.5) * w}px`
          label.style.top  = `${(-tmpV.y * 0.5 + 0.5) * h}px`
        }
      })
    }
    animate()

    // ── Resize ─────────────────────────────────────────────
    const onResize = () => {
      w = el.clientWidth
      h = el.clientHeight
      const a = w / h
      camera.left   = -frustum * a
      camera.right  =  frustum * a
      camera.top    =  frustum
      camera.bottom = -frustum
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMove)
      geos.forEach(g => g.dispose())
      mats.forEach(m => m.dispose())
      dotTex.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  const labelStyle: React.CSSProperties = {
    position:      'absolute',
    fontFamily:    'var(--font-mono)',
    fontSize:      '8px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color:         '#a7d8c8',
    pointerEvents: 'none',
    transform:     'translate(-50%, -100%)',
    padding:       '3px 9px',
    borderRadius:  '99px',
    border:        '1px solid rgba(0, 212, 170, 0.3)',
    background:    'rgba(8, 18, 30, 0.78)',
    whiteSpace:    'nowrap',
    transition:    'opacity 0.2s',
  }

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={mountRef} style={{ position: 'absolute', inset: 0 }} />
      <div ref={l0Ref} style={labelStyle}>COMMIT</div>
      <div ref={l1Ref} style={labelStyle}>BUILD</div>
      <div ref={l2Ref} style={labelStyle}>TEST</div>
      <div ref={l3Ref} style={labelStyle}>DEPLOY</div>
      <div ref={l4Ref} style={labelStyle}>LIVE</div>
    </div>
  )
}
