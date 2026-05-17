import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey || apiKey === "YOUR_TMDB_API_KEY_HERE" || apiKey.length < 10) {
      console.error("TMDB API Key is missing in environment variables.");
      return NextResponse.json({ error: "TMDB API Key missing" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const lang = searchParams.get("language") || "en";
    const languageParam = lang === "tr" ? "tr-TR" : "en-US";

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    let url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=${languageParam}&page=1`;
    const headers: Record<string, string> = {
      accept: "application/json",
    };

    if (apiKey.startsWith("ey")) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else {
      url += `&api_key=${apiKey}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.error(`TMDB API query failed: ${res.status} ${res.statusText}`);
      return NextResponse.json({ error: "Failed to fetch from TMDB" }, { status: res.status });
    }

    const data = await res.json();
    console.log("TMDB Search Results:", data);

    const results = data.results || [];
    return NextResponse.json(results);
  } catch (error) {
    console.error("TMDB search route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
