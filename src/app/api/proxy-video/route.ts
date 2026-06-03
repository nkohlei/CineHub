import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing video URL", { status: 400 });
  }

  try {
    const videoResponse = await fetch(url);
    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch remote stream: ${videoResponse.statusText}`);
    }
    
    const contentType = videoResponse.headers.get("Content-Type") || "video/mp4";
    const arrayBuffer = await videoResponse.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Video proxy failed:", error);
    return new NextResponse("Streaming Proxy Failed", { status: 500 });
  }
}
