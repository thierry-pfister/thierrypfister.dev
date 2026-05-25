import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'PFSTR_ — Build. Deploy. Repeat.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0A0A0A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 96px',
          fontFamily: 'monospace',
        }}
      >
        {/* Two squares icon */}
        <div style={{ display: 'flex', position: 'relative', width: 64, height: 64, marginBottom: 48 }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 40, height: 40, background: '#6366F1' }} />
          <div style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40, background: '#0A0A0A', border: '2px solid #F4F0E8' }} />
        </div>

        {/* Name */}
        <div style={{ display: 'flex', fontSize: 80, fontWeight: 900, color: '#EAE8E2', letterSpacing: '-2px', lineHeight: 1 }}>
          PFSTR
          <span style={{ color: '#C8A830' }}>_</span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', fontSize: 28, color: '#6366F1', marginTop: 24, letterSpacing: '2px' }}>
          Thierry Pfister
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', fontSize: 18, color: 'rgba(234,232,226,0.4)', marginTop: 16, letterSpacing: '4px' }}>
          BUILD · DEPLOY · REPEAT
        </div>
      </div>
    ),
    size
  )
}
