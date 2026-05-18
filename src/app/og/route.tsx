import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    // Dynamically capture the exact live deployment URL
    const { origin } = new URL(request.url);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 1. Dimmed Movie Collage Background (Using secure dynamic origin) */}
          <img
            src={`${origin}/images/auth-bg.jpg`}
            alt="Cinematic Background"
            style={{
              position: 'absolute',
              inset: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
              opacity: 0.18, // Intensely dimmed to stay under WhatsApp's 300KB limit
            }}
          />

          {/* 2. Premium Silver Handwritten Logo (Using secure dynamic origin) */}
          <img
            src={`${origin}/images/og-logo.png`}
            alt="Oxynema Premium Silver Logo"
            style={{
              height: '130px',
              width: 'auto',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.7))',
              zIndex: 1,
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Failed to generate dynamic OG image:", e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
