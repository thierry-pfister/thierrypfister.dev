'use client'

import { useEffect, useState } from 'react'
import styles from './CICDPipeline3D.module.css'

const STAGES = [
  { id: 'commit', label: 'COMMIT', running: 'pushing to main…',     done: 'committed'  },
  { id: 'build',  label: 'BUILD',  running: 'compiling assets…',    done: 'built'      },
  { id: 'test',   label: 'TEST',   running: 'running test suite…',  done: 'passed'     },
  { id: 'deploy', label: 'DEPLOY', running: 'shipping to edge…',    done: 'deployed'   },
  { id: 'live',   label: 'LIVE',   running: 'serving requests',     done: 'live'       },
]

// Coordinates inside viewBox 500 × 400
const NODE_Y      = 220
const NODE_R      = 20
const NODE_X      = [70, 165, 250, 335, 430]
const PATH_LEN    = 95  // distance between adjacent node edges

// Timings (ms)
const POP_MS      = 360
const DRAW_MS     = 1100
const HOLD_END_MS = 2400
const RESET_MS    = 550

export default function CICDPipeline3D() {
  const [shown, setShown] = useState(0) // nodes visible (0..5)
  const [drawn, setDrawn] = useState(0) // path segments drawn (0..4)

  useEffect(() => {
    let stopped = false
    const ids: ReturnType<typeof setTimeout>[] = []

    const at = (ms: number, fn: () => void) => {
      ids.push(setTimeout(() => { if (!stopped) fn() }, ms))
    }

    const run = () => {
      setShown(0); setDrawn(0)
      let t = 350
      for (let i = 0; i < STAGES.length; i++) {
        at(t, () => setShown(i + 1))
        t += POP_MS
        if (i < STAGES.length - 1) {
          at(t, () => setDrawn(i + 1))
          t += DRAW_MS
        }
      }
      at(t + HOLD_END_MS, () => { setShown(0); setDrawn(0) })
      at(t + HOLD_END_MS + RESET_MS, run)
    }

    run()
    return () => { stopped = true; ids.forEach(clearTimeout) }
  }, [])

  const currentIdx   = Math.min(shown - 1, STAGES.length - 1)
  const currentStage = STAGES[currentIdx]
  const allDone      = shown === STAGES.length
  const statusText   = !currentStage
    ? '— initializing'
    : allDone
      ? `✓ ${currentStage.done}`
      : `▶ ${currentStage.running}`

  return (
    <div className={styles.wrap}>
      <svg
        className={styles.svg}
        viewBox="0 0 500 400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* ─── Title bar ─── */}
        <text x="36"  y="60" className={styles.title}>DEPLOY FLOW</text>
        <text x="464" y="60" className={styles.meta} textAnchor="end">main · a3f8c1d</text>
        <line x1="36" y1="78" x2="464" y2="78" className={styles.divider} />

        {/* ─── Axis tick marks (subtle decoration) ─── */}
        {NODE_X.map((x, i) => (
          <line key={`tick-${i}`} x1={x} y1="92" x2={x} y2="98" className={styles.tick} />
        ))}

        {/* ─── Path segments ─── */}
        {NODE_X.slice(0, -1).map((x, i) => {
          const next = NODE_X[i + 1] ?? x
          return (
            <line
              key={`seg-${i}`}
              x1={x + NODE_R + 4}
              y1={NODE_Y}
              x2={next - NODE_R - 4}
              y2={NODE_Y}
              className={`${styles.segment} ${drawn > i ? styles.segmentDrawn ?? '' : ''}`}
              style={{ strokeDasharray: PATH_LEN, strokeDashoffset: drawn > i ? 0 : PATH_LEN }}
            />
          )
        })}

        {/* ─── Nodes ─── */}
        {STAGES.map((stage, i) => {
          const x         = NODE_X[i] ?? 0
          const isVisible = shown > i
          const isCurrent = isVisible && (currentIdx === i) && !(allDone && i < STAGES.length - 1)
          return (
            <g key={stage.id} transform={`translate(${x}, ${NODE_Y})`}>
              <g className={`${styles.node} ${isVisible ? styles.nodeVisible ?? '' : ''}`}>
                {/* Pulsing ring for current stage */}
                <circle
                  r={NODE_R + 6}
                  className={`${styles.pulse} ${isCurrent ? styles.pulseActive ?? '' : ''}`}
                />
                {/* Outer cyan ring */}
                <circle r={NODE_R} className={styles.ringOuter} />
                {/* Inner fill */}
                <circle r={NODE_R - 4} className={styles.fill} />
                {/* Icon */}
                <g className={styles.icon}>{renderIcon(stage.id)}</g>
              </g>
            </g>
          )
        })}

        {/* ─── Labels ─── */}
        {STAGES.map((stage, i) => {
          const x         = NODE_X[i] ?? 0
          const isVisible = shown > i
          return (
            <g key={`lbl-${stage.id}`}>
              <text
                x={x}
                y={NODE_Y + NODE_R + 28}
                textAnchor="middle"
                className={`${styles.stageLabel} ${isVisible ? styles.stageLabelOn ?? '' : ''}`}
              >
                {stage.label}
              </text>
            </g>
          )
        })}

        {/* ─── Status / progress ─── */}
        <line x1="36" y1="330" x2="464" y2="330" className={styles.divider} />
        <text x="36"  y="358" className={styles.status}>{statusText}</text>
        <text x="464" y="358" className={styles.progress} textAnchor="end">
          {`${Math.min(shown, STAGES.length)} / ${STAGES.length}`}
        </text>
      </svg>
    </div>
  )
}

// ─── Icon paths ───────────────────────────────────────────────────────────────
function renderIcon(id: string) {
  switch (id) {
    case 'commit':
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="0"  y1="5"  x2="0"  y2="0"  />
          <line x1="0"  y1="0"  x2="-4" y2="-4" />
          <line x1="0"  y1="0"  x2="4"  y2="-4" />
          <circle cx="0"  cy="6"  r="2"   fill="currentColor" stroke="none" />
          <circle cx="-5" cy="-5" r="2"   fill="currentColor" stroke="none" />
          <circle cx="5"  cy="-5" r="2"   fill="currentColor" stroke="none" />
        </g>
      )
    case 'build':
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="-6" y="-6" width="12" height="12" rx="1" />
          <line x1="-6" y1="-1" x2="6" y2="-1" />
          <line x1="0"  y1="-1" x2="0" y2="6" />
        </g>
      )
    case 'test':
      return (
        <path
          d="M -6 0 L -2 5 L 6 -4"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        />
      )
    case 'deploy':
      return (
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <line x1="-5" y1="6" x2="5" y2="6" />
          <line x1="0"  y1="-6" x2="0" y2="3" />
          <path d="M -4 -2 L 0 -6 L 4 -2" />
        </g>
      )
    case 'live':
      return (
        <g>
          <circle cx="0" cy="0" r="3.5" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none">
            <line x1="-8" y1="0"  x2="-6" y2="0" />
            <line x1="8"  y1="0"  x2="6"  y2="0" />
            <line x1="0"  y1="-8" x2="0"  y2="-6" />
            <line x1="0"  y1="8"  x2="0"  y2="6" />
          </g>
        </g>
      )
  }
  return null
}
