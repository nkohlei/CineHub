import { ImageResponse } from 'next/og';

export const runtime = 'edge'; // High performance edge runtime

export async function GET() {
  try {
    const siteUrl = process.env.NEXTAUTH_URL || 'https://oxynema.vercel.app';
    // Generate the dynamic image context using code (satori)
    return new ImageResponse(
      (
        // Root Container: Background collage
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000', // Black fallback
            backgroundImage: `url(${siteUrl}/images/auth-bg.jpg)`, // Pull existing collage asset
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
          {/* Intense Dark Overlay: Dimming the background by ~70% */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
            }}
          />

          {/* Central Branded Title: "Oxynema" in premium bold styling */}
          <h1
            style={{
              fontSize: '110px',
              fontFamily: 'system-ui, sans-serif', // Using standard premium font for image consistency
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.05em',
              textShadow: '0 4px 12px rgba(0,0,0,0.5)', // Subtle shadow to enhance gümüş effect on white text
              position: 'relative', // Sits above the dim overlay
              zIndex: 1,
            }}
          >
            Oxynema
          </h1>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("Failed to generate image:", e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
