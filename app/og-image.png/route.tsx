import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'system-ui, sans-serif',
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          padding: '60px 80px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}>
        <div
          style={{
            fontSize: '80px',
            marginBottom: '20px',
          }}>
          🔥
        </div>
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            marginBottom: '16px',
          }}>
          Ironizi
        </div>
        <div
          style={{
            fontSize: '28px',
            color: '#64748b',
            textAlign: 'center',
            maxWidth: '600px',
            lineHeight: 1.4,
          }}>
          A IA mais sincera que você vai encontrar
        </div>
        <div
          style={{
            marginTop: '32px',
            fontSize: '20px',
            color: '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
          <span>🤖</span>
          <span>Zoeiras e conselhos com humor</span>
          <span>🎤</span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          fontSize: '24px',
          color: 'rgba(255, 255, 255, 0.8)',
        }}>
        ironizi.app
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    },
  )
}
