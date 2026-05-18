import { ImageResponse } from 'next/og';

export const runtime = 'edge'; // Fully safe with explicit attributes

export async function GET(request: Request) {
  try {
    // Dynamically fetch the absolute running origin url context safely
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
          {/* 1. Cinematic Background Collage - Force explicit dimensions via attributes */}
          <img
            src={`${origin}/images/auth-bg.jpg`}
            alt="Cinematic Background"
            width="1200"
            height="630"
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.18,
            }}
          />

          {/* 2. Premium Silver Handwritten Logo */}
          {/* CRITICAL: Satori REQUIRES explicit width and height attributes here to prevent 0x0 collapsing */}
          <img
            src={`${origin}/images/og-logo.png`}
            alt="Oxynema Silver Logo"
            width="400" 
            height="160"
            style={{
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
