import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b', // Custom ultra-dark charcoal/black
            position: 'relative',
          }}
        >
          {/* Futuristic stylized glowing geometric blur in the center */}
          <div
            style={{
              position: 'absolute',
              width: '600px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0) 70%)',
              top: '165px',
              left: '300px',
              zIndex: 0,
            }}
          />

          {/* Premium Branded Title */}
          <h1
            style={{
              fontSize: '120px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.04em',
              marginBottom: '10px',
              zIndex: 1,
            }}
          >
            Oxynema
          </h1>

          {/* Corporate Subtitle */}
          <p
            style={{
              fontSize: '28px',
              fontWeight: 500,
              color: '#a1a1aa', // zinc-400
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              zIndex: 1,
            }}
          >
            A Subsidiary of Oxypace
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
