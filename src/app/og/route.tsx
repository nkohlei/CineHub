import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  try {
    const siteUrl = process.env.NEXTAUTH_URL || 'https://oxynema.vercel.app';
    // Generate the dynamic image context using code (satori)
    return new ImageResponse(
      (
        // Root Container: Essential for background constraints
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000', // Black fallback
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 1. Cinematic Movie Collage Background */}
          {/* IMPORTANT: We will rely on Satori's Image embedding but must dim it intensely to save bytes */}
          <img
            src={`${siteUrl}/images/auth-bg.jpg`} // Existing dimmed auth background collage
            alt="Cinematic Background"
            style={{
              position: 'absolute',
              inset: 0,
              width: '1200px',
              height: '630px',
              objectFit: 'cover',
              // CRITICAL OPTIMIZATION: Maximize dimming to increase compression ratio and stay <300KB
              opacity: 0.18, 
            }}
          />

          {/* 2. Premium Silver Handwritten Logo Image */}
          {/* Positioned dead center */}
          <img
            src={`${siteUrl}/images/og-logo.png`} // Copy of src/app/oxynema-logo.png for edge loading
            alt="Oxynema Premium Silver Logo"
            style={{
              // Sizing logic: Scaled down slightly to fit balanced inside the share card
              height: '120px', 
              width: 'auto',
              // Optional: Add a subtle drop shadow to make the silver stand out even more against the dimmed posters
              filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.6))', 
              zIndex: 1, // Sits above the background collage
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
    console.error("Failed to generate image:", e);
    return new Response(`Failed to generate image`, { status: 500 });
  }
}
