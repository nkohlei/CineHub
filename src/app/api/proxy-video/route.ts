import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing video URL", { status: 400 });
  }

  const range = request.headers.get("range");

  try {
    const headers: HeadersInit = {};
    if (range) {
      headers["Range"] = range;
    }

    const r2Response = await fetch(url, { headers });
    if (!r2Response.ok && r2Response.status !== 206) {
      throw new Error(`Failed to fetch from R2: ${r2Response.statusText}`);
    }
    
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", r2Response.headers.get("Content-Type") || "video/mp4");
    responseHeaders.set("Accept-Ranges", "bytes");
    
    const contentRange = r2Response.headers.get("Content-Range");
    if (contentRange) {
      responseHeaders.set("Content-Range", contentRange);
    }
    
    const contentLength = r2Response.headers.get("Content-Length");
    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }

    // Return the response stream with status 206 (Partial Content) for seeking/chunking support
    return new NextResponse(r2Response.body, {
      status: range ? 206 : 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Streaming proxy crash:", error);
    return new NextResponse("Range Stream Proxy Failed", { status: 500 });
  }
}
