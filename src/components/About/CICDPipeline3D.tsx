'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// ─── Palette ──────────────────────────────────────────────────────────────────
const C_TEAL   = 0x00e5b0
const C_CYAN   = 0x00ffdd
const C_DARK   = 0x050d16
const C_DARK2  = 0x08121e

// ─── Shared material factories ────────────────────────────────────────────────
function mkNodeMat(mats: THREE.Material[]): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({
    color: C_DARK2, metalness: 0.9, roughness: 0.2,
    emissive: 0x002218, emissiveIntensity: 0.6,
  })
  mats.push(m)
  return m
}

function mkEdgesMat(mats: THREE.Material[]): THREE.LineBasicMaterial {
  const m = new THREE.LineBasicMaterial({ color: C_TEAL })
  mats.push(m)
  return m
}

function withEdges(
  geo: THREE.BufferGeometry,
  mat: THREE.MeshStandardMaterial,
  eMat: THREE.LineBasicMaterial,
  geos: THREE.BufferGeometry[],
): THREE.Group {
  const g    = new THREE.Group()
  g.add(new THREE.Mesh(geo, mat))
  const eGeo = new THREE.EdgesGeometry(geo, 20)
  geos.push(eGeo)
  g.add(new THREE.LineSegments(eGeo, eMat))
  return g
}

// ─── Node icon builders ───────────────────────────────────────────────────────
function buildCodeBadge(geos: THREE.BufferGeometry[], mats: THREE.Material[]): THREE.Group {
  const nMat = mkNodeMat(mats)
  const eMat = mkEdgesMat(mats)
  const g    = new THREE.Group()

  const hexGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.07, 6)
  geos.push(hexGeo)
  g.add(withEdges(hexGeo, nMat, eMat, geos))

  const ringGeo = new THREE.TorusGeometry(0.11, 0.022, 6, 18)
  geos.push(ringGeo)
  const ring    = withEdges(ringGeo, nMat, eMat, geos)
  ring.rotation.x = Math.PI / 2
  g.add(ring)
  return g
}

function buildGear(geos: THREE.BufferGeometry[], mats: THREE.Material[]): THREE.Group {
  const nMat    = mkNodeMat(mats)
  const eMat    = mkEdgesMat(mats)
  const g       = new THREE.Group()
  const TEETH   = 7

  const discGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.07, 20)
  geos.push(discGeo)
  g.add(withEdges(discGeo, nMat, eMat, geos))

  const toothGeo  = new THREE.BoxGeometry(0.07, 0.07, 0.09)
  const toothEGeo = new THREE.EdgesGeometry(toothGeo, 20)
  geos.push(toothGeo, toothEGeo)
  for (let i = 0; i < TEETH; i++) {
    const a  = (i / TEETH) * Math.PI * 2
    const tg = new THREE.Group()
    tg.add(new THREE.Mesh(toothGeo, nMat))
    tg.add(new THREE.LineSegments(toothEGeo, eMat))
    tg.position.set(Math.cos(a) * 0.19, 0, Math.sin(a) * 0.19)
    tg.rotation.y = a
    g.add(tg)
  }

  const holeGeo = new THREE.TorusGeometry(0.055, 0.016, 6, 14)
  geos.push(holeGeo)
  const hole    = withEdges(holeGeo, nMat, eMat, geos)
  hole.rotation.x = Math.PI / 2
  g.add(hole)
  return g
}

function buildContainer(geos: THREE.BufferGeometry[], mats: THREE.Material[]): THREE.Group {
  const nMat = mkNodeMat(mats)
  const eMat = mkEdgesMat(mats)
  const g    = new THREE.Group()

  const boxGeo = new THREE.BoxGeometry(0.28, 0.22, 0.22)
  geos.push(boxGeo)
  g.add(withEdges(boxGeo, nMat, eMat, geos))

  for (const y of [-0.07, 0.07]) {
    const ribGeo = new THREE.BoxGeometry(0.3, 0.018, 0.24)
    geos.push(ribGeo)
    const rib = withEdges(ribGeo, nMat, eMat, geos)
    rib.position.y = y
    g.add(rib)
  }
  return g
}

function buildCheckmark(geos: THREE.BufferGeometry[], mats: THREE.Material[]): THREE.Group {
  const nMat = mkNodeMat(mats)
  const eMat = mkEdgesMat(mats)
  const g    = new THREE.Group()

  const shortGeo = new THREE.BoxGeometry(0.055, 0.17, 0.055)
  geos.push(shortGeo)
  const short = withEdges(shortGeo, nMat, eMat, geos)
  short.position.set(-0.055, -0.03, 0)
  short.rotation.z = Math.PI / 4
  g.add(short)

  const longGeo = new THREE.BoxGeometry(0.055, 0.28, 0.055)
  geos.push(longGeo)
  const long = withEdges(longGeo, nMat, eMat, geos)
  long.position.set(0.065, 0.04, 0)
  long.rotation.z = -Math.PI / 3.5
  g.add(long)
  return g
}

function buildServer(geos: THREE.BufferGeometry[], mats: THREE.Material[]): THREE.Group {
  const nMat = mkNodeMat(mats)
  const eMat = mkEdgesMat(mats)
  const g    = new THREE.Group()
  const dotMat = new THREE.MeshBasicMaterial({ color: C_TEAL })
  mats.push(dotMat)

  for (const y of [-0.1, 0, 0.1]) {
    const rackGeo = new THREE.BoxGeometry(0.32, 0.058, 0.18)
    geos.push(rackGeo)
    const rack = withEdges(rackGeo, nMat, eMat, geos)
    rack.position.y = y
    g.add(rack)

    const dotGeo = new THREE.SphereGeometry(0.015, 6, 6)
    geos.push(dotGeo)
    const dot = new THREE.Mesh(dotGeo, dotMat)
    dot.position.set(0.13, y, 0.08)
    g.add(dot)
  }
  return g
}

function buildRollback(geos: THREE.BufferGeometry[], mats: THREE.Material[]): THREE.Group {
  const nMat = mkNodeMat(mats)
  const eMat = mkEdgesMat(mats)
  const g    = new THREE.Group()

  const arcGeo = new THREE.TorusGeometry(0.19, 0.032, 8, 32, Math.PI * 1.55)
  geos.push(arcGeo)
  g.add(withEdges(arcGeo, nMat, eMat, geos))

  const arGeo = new THREE.ConeGeometry(0.048, 0.1, 6)
  geos.push(arGeo)
  const arrow = withEdges(arGeo, nMat, eMat, geos)
  arrow.position.set(0.17, -0.12, 0)
  arrow.rotation.z = -0.8
  g.add(arrow)
  return g
}

function buildRocket(geos: THREE.BufferGeometry[], mats: THREE.Material[]): THREE.Group {
  const nMat   = mkNodeMat(mats)
  const eMat   = mkEdgesMat(mats)
  const glowMat = new THREE.MeshBasicMaterial({
    color: C_CYAN, transparent: true, opacity: 0.45,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
  mats.push(glowMat)
  const g = new THREE.Group()

  const bodyGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.28, 8)
  geos.push(bodyGeo)
  g.add(withEdges(bodyGeo, nMat, eMat, geos))

  const noseGeo = new THREE.ConeGeometry(0.08, 0.15, 8)
  geos.push(noseGeo)
  const nose = withEdges(noseGeo, nMat, eMat, geos)
  nose.position.y = 0.215
  g.add(nose)

  const finGeo  = new THREE.BoxGeometry(0.04, 0.11, 0.07)
  const finEGeo = new THREE.EdgesGeometry(finGeo, 20)
  geos.push(finGeo, finEGeo)
  for (let i = 0; i < 3; i++) {
    const a  = (i / 3) * Math.PI * 2
    const fg = new THREE.Group()
    fg.add(new THREE.Mesh(finGeo, nMat))
    fg.add(new THREE.LineSegments(finEGeo, eMat))
    fg.position.set(Math.cos(a) * 0.11, -0.1, Math.sin(a) * 0.11)
    fg.rotation.y = a
    g.add(fg)
  }

  const exGeo = new THREE.ConeGeometry(0.065, 0.12, 8)
  geos.push(exGeo)
  const ex = new THREE.Mesh(exGeo, glowMat)
  ex.position.y = -0.2
  ex.rotation.z = Math.PI
  g.add(ex)
  return g
}

// ─── Tube between two nodes with arc ─────────────────────────────────────────
function buildTubeSegment(
  a: THREE.Vector3,
  b: THREE.Vector3,
  arcOffset: THREE.Vector3,
  geos: THREE.BufferGeometry[],
  mats: THREE.Material[],
  scene: THREE.Scene,
): THREE.CatmullRomCurve3 {
  const mid   = new THREE.Vector3().lerpVectors(a, b, 0.5).add(arcOffset)
  const curve = new THREE.CatmullRomCurve3([a, mid, b])

  // Inner glow tube
  const iGeo = new THREE.TubeGeometry(curve, 50, 0.022, 6, false)
  geos.push(iGeo)
  const iMat = new THREE.MeshStandardMaterial({
    color: C_TEAL, emissive: C_TEAL, emissiveIntensity: 2.2,
    metalness: 0, roughness: 1,
  })
  mats.push(iMat)
  scene.add(new THREE.Mesh(iGeo, iMat))

  // Outer halo
  const oGeo = new THREE.TubeGeometry(curve, 50, 0.055, 6, false)
  geos.push(oGeo)
  const oMat = new THREE.MeshBasicMaterial({
    color: C_CYAN, transparent: true, opacity: 0.07,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
  mats.push(oMat)
  scene.add(new THREE.Mesh(oGeo, oMat))

  return curve
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CICDPipeline3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let w = el.clientWidth
    let h = el.clientHeight

    // ── Renderer ──────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    // ── Camera (orthographic isometric) ───────────────────────────
    const frustum = 5.5
    const aspect  = w / h
    const camera  = new THREE.OrthographicCamera(
      -frustum * aspect, frustum * aspect,
       frustum,          -frustum,
      0.1, 200,
    )
    const CAM_DIST = 14
    camera.position.set(CAM_DIST, CAM_DIST * 0.65, CAM_DIST)
    camera.lookAt(0, 0.2, 0)

    const scene = new THREE.Scene()

    // ── Lights ────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x0a1a2e, 2.5))

    const keyLight = new THREE.DirectionalLight(0x00e5b0, 1.8)
    keyLight.position.set(5, 10, 5)
    scene.add(keyLight)

    const rimLight = new THREE.DirectionalLight(0x0044ff, 0.6)
    rimLight.position.set(-8, -3, -5)
    scene.add(rimLight)

    // ── Disposables ───────────────────────────────────────────────
    const geos: THREE.BufferGeometry[] = []
    const mats: THREE.Material[]       = []

    // ── Node positions ────────────────────────────────────────────
    const NODE_POS = [
      new THREE.Vector3(-3.4,  0.15,  0.7),  // 0 code badge
      new THREE.Vector3(-2.1, -0.05, -0.5),  // 1 gear
      new THREE.Vector3(-0.7,  0.25,  0.55), // 2 container (build)
      new THREE.Vector3( 0.6, -0.1,  -0.35), // 3 checkmark (test)
      new THREE.Vector3( 1.9,  0.1,   0.6),  // 4 server (deploy)
      new THREE.Vector3( 3.1, -0.05, -0.3),  // 5 rollback
      new THREE.Vector3( 4.1,  0.2,   0.5),  // 6 rocket
    ]

    // Arc offsets between each pair of nodes
    const ARC_OFF = [
      new THREE.Vector3(0,  0.55,  0.2),
      new THREE.Vector3(0,  0.4,  -0.3),
      new THREE.Vector3(0, -0.35,  0.15),
      new THREE.Vector3(0,  0.45, -0.25),
      new THREE.Vector3(0, -0.3,   0.2),
      new THREE.Vector3(0,  0.4,   0.1),
    ]

    // ── Build icon groups ─────────────────────────────────────────
    const BUILDERS = [buildCodeBadge, buildGear, buildContainer, buildCheckmark, buildServer, buildRollback, buildRocket]
    const nodeGroups: THREE.Group[] = BUILDERS.map((fn, i) => {
      const g = fn(geos, mats)
      g.position.copy(NODE_POS[i] ?? new THREE.Vector3())
      g.scale.setScalar(0.72)
      scene.add(g)

      // Per-node teal point light
      const pl = new THREE.PointLight(C_TEAL, 1.4, 2.2)
      pl.position.copy(NODE_POS[i] ?? new THREE.Vector3())
      scene.add(pl)

      return g
    })

    // ── Build tubes + particles ───────────────────────────────────
    const curves: THREE.CatmullRomCurve3[] = []
    for (let i = 0; i < NODE_POS.length - 1; i++) {
      const from = NODE_POS[i]!
      const to   = NODE_POS[i + 1]!
      const off  = ARC_OFF[i] ?? new THREE.Vector3()
      curves.push(buildTubeSegment(from, to, off, geos, mats, scene))
    }

    // Particle system
    const P_PER_TUBE = 7
    const TOTAL_P    = curves.length * P_PER_TUBE
    const pPos       = new Float32Array(TOTAL_P * 3)
    const pCol       = new Float32Array(TOTAL_P * 3)

    // Stagger particle start positions
    const particleTs: { t: number; curveIdx: number; speed: number }[] = []
    curves.forEach((_, ci) => {
      for (let pi = 0; pi < P_PER_TUBE; pi++) {
        particleTs.push({ t: pi / P_PER_TUBE, curveIdx: ci, speed: 0.045 + Math.random() * 0.02 })
      }
    })

    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3))
    geos.push(pGeo)

    const dotCanvas = document.createElement('canvas')
    dotCanvas.width = dotCanvas.height = 32
    const dCtx = dotCanvas.getContext('2d')!
    const dGrad = dCtx.createRadialGradient(16, 16, 0, 16, 16, 16)
    dGrad.addColorStop(0, 'rgba(255,255,255,1)')
    dGrad.addColorStop(1, 'rgba(255,255,255,0)')
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
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    const pPosAttr = pGeo.attributes['position'] as THREE.BufferAttribute
    const pColAttr = pGeo.attributes['color']    as THREE.BufferAttribute

    // ── Node base rotations ───────────────────────────────────────
    const baseRotY = nodeGroups.map(() => Math.random() * Math.PI * 2)
    const floatPh  = nodeGroups.map((_, i) => i * 1.1)

    // ── Animation ─────────────────────────────────────────────────
    let   animId: number
    const clock  = new THREE.Clock()
    const tealC  = new THREE.Color(C_TEAL)
    const cyanC  = new THREE.Color(C_CYAN)

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t  = clock.getElapsedTime()
      const dt = clock.getDelta()

      // Orbit camera slowly
      const camA = t * 0.07
      const cy   = Math.cos(camA) * CAM_DIST
      const cx   = Math.sin(camA) * CAM_DIST
      camera.position.set(cx, CAM_DIST * 0.65, cy)
      camera.lookAt(0, 0.2, 0)

      // Float + rotate nodes
      nodeGroups.forEach((g, i) => {
        const ph  = floatPh[i] ?? 0
        const ry  = baseRotY[i] ?? 0
        g.position.y = (NODE_POS[i]?.y ?? 0) + Math.sin(t * 0.7 + ph) * 0.06
        g.rotation.y = ry + t * 0.4
      })

      // Advance particles
      particleTs.forEach((p, idx) => {
        p.t = (p.t + dt * p.speed) % 1
        const curve = curves[p.curveIdx]
        if (!curve) return
        const pt  = curve.getPoint(p.t)
        const frac = p.t
        const col = new THREE.Color().lerpColors(tealC, cyanC, Math.sin(frac * Math.PI))
        pPosAttr.array[idx * 3]     = pt.x
        pPosAttr.array[idx * 3 + 1] = pt.y
        pPosAttr.array[idx * 3 + 2] = pt.z
        pColAttr.array[idx * 3]     = col.r
        pColAttr.array[idx * 3 + 1] = col.g
        pColAttr.array[idx * 3 + 2] = col.b
      })
      pPosAttr.needsUpdate = true
      pColAttr.needsUpdate = true

      // Pulse tube emissive
      const pulse = 1.8 + Math.sin(t * 2.2) * 0.4
      mats.forEach(m => {
        if (m instanceof THREE.MeshStandardMaterial && m.emissive.getHex() === C_TEAL) {
          m.emissiveIntensity = pulse
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // ── Resize ────────────────────────────────────────────────────
    const onResize = () => {
      w = el.clientWidth
      h = el.clientHeight
      const a = w / h
      ;(camera as THREE.OrthographicCamera).left   = -frustum * a
      ;(camera as THREE.OrthographicCamera).right  =  frustum * a
      ;(camera as THREE.OrthographicCamera).top    =  frustum
      ;(camera as THREE.OrthographicCamera).bottom = -frustum
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
      geos.forEach(g => g.dispose())
      mats.forEach(m => m.dispose())
      dotTex.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
