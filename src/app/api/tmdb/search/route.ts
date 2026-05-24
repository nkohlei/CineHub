import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey || apiKey === "YOUR_TMDB_API_KEY_HERE" || apiKey.length < 10) {
      console.error("TMDB API Key missing or placeholder in environment variables.");
      return NextResponse.json({ error: "TMDB API Key missing" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || searchParams.get("q");
    const lang = searchParams.get("language") || "en";
    const languageParam = lang === "tr" ? "tr-TR" : "en-US";

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Build headers and query URL depending on whether API key is a v4 token or v3 key
    let url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&language=${languageParam}&page=1&include_adult=false`;
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
      console.error(`TMDB API request failed with status: ${res.status}`);
      return NextResponse.json({ error: `TMDB request failed: ${res.statusText}` }, { status: res.status });
    }

    const data = await res.json();
    console.log("TMDB Search Results:", data);

    const results = data.results || [];
    return NextResponse.json(results);
  } catch (error) {
    console.error("Global search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
