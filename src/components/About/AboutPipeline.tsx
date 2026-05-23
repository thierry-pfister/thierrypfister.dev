'use client'

import { useEffect, useState } from 'react'
import styles from './AboutPipeline.module.css'

const STAGES = [
  { label: 'PUSH',   cmd: 'git push origin main',   dur: '0:01' },
  { label: 'BUILD',  cmd: 'next build',              dur: '0:24' },
  { label: 'TEST',   cmd: 'jest --ci --coverage',    dur: '0:18' },
  { label: 'DEPLOY', cmd: 'vercel --prod',           dur: '0:33' },
  { label: 'LIVE',   cmd: 'thierrypfister.dev',      dur: null   },
]

// How long each stage "runs" before completing (ms)
const DURATIONS = [900, 2400, 1900, 2800, 600]

type Status = 'pending' | 'running' | 'done'

function stageClass(status: Status): string {
  if (status === 'done')    return styles.done    ?? ''
  if (status === 'running') return styles.running ?? ''
  return styles.pending ?? ''
}

export default function AboutPipeline() {
  const [statuses, setStatuses] = useState<Status[]>(STAGES.map(() => 'pending'))

  useEffect(() => {
    let stopped = false
    const ids: ReturnType<typeof setTimeout>[] = []

    const run = () => {
      setStatuses(STAGES.map(() => 'pending'))
      let t = 400

      STAGES.forEach((_, i) => {
        const startAt = t
        ids.push(setTimeout(() => {
          if (stopped) return
          setStatuses(prev => prev.map((s, j) => (j === i ? 'running' : s)))
        }, startAt))

        t += DURATIONS[i] ?? 1500

        const endAt = t
        ids.push(setTimeout(() => {
          if (stopped) return
          setStatuses(prev => prev.map((s, j) => (j === i ? 'done' : s)))
        }, endAt))

        t += 150
      })

      ids.push(setTimeout(() => { if (!stopped) run() }, t + 3200))
    }

    run()
    return () => { stopped = true; ids.forEach(clearTimeout) }
  }, [])

  const allDone = statuses.every(s => s === 'done')

  return (
    <div className={styles.card}>
      {/* Title bar */}
      <div className={styles.titleBar}>
        <div className={styles.trafficLights}>
          <span /><span /><span />
        </div>
        <span className={styles.repoName}>pfstr / portfolio</span>
        <span className={styles.branch}>main</span>
        <span className={`${styles.runStatus} ${allDone ? styles.runSuccess ?? '' : ''}`}>
          {allDone ? '✓ passed' : '▶ running'}
        </span>
      </div>

      {/* Commit line */}
      <div className={styles.commitLine}>
        <span className={styles.sha}>a3f8c12</span>
        <span className={styles.commitMsg}>feat: update portfolio — build · deploy · repeat</span>
      </div>

      {/* Pipeline stages */}
      <div className={styles.stages}>
        {STAGES.map((stage, i) => {
          const status = statuses[i] ?? 'pending'
          const prevDone = i === 0 || statuses[i - 1] === 'done'
          return (
            <div key={stage.label} className={styles.stageRow}>
              {/* Connector from previous */}
              {i > 0 && (
                <div className={`${styles.connector} ${prevDone ? styles.connectorLit ?? '' : ''}`}>
                  {prevDone && status !== 'pending' && (
                    <span className={styles.flowDot} />
                  )}
                </div>
              )}

              <div className={`${styles.stage} ${stageClass(status)}`}>
                {/* Icon */}
                <div className={styles.icon}>
                  {status === 'done'    && <svg viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {status === 'running' && <span className={styles.spinner} />}
                  {status === 'pending' && <span className={styles.iconCircle} />}
                </div>

                {/* Info */}
                <div className={styles.info}>
                  <span className={styles.stageLabel}>{stage.label}</span>
                  <span className={styles.stageCmd}>{stage.cmd}</span>
                  {status === 'running' && <div className={styles.bar}><div className={styles.barFill} /></div>}
                </div>

                {/* Duration */}
                <div className={styles.meta}>
                  {status === 'done'    && stage.dur && <span className={styles.dur}>{stage.dur}</span>}
                  {status === 'running' && <span className={styles.metaRunning}>…</span>}
                  {status === 'pending' && <span className={styles.metaPending}>—</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
