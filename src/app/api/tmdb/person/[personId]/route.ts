import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ personId: string }> }
) {
  try {
    const { personId } = await params;
    const id = parseInt(personId, 10);

    const { searchParams } = new URL(request.url);
    const lang = searchParams.get("language") || "en";
    const languageParam = lang === "tr" ? "tr-TR" : "en-US";

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid Person ID" }, { status: 400 });
    }

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey || apiKey === "YOUR_TMDB_API_KEY_HERE" || apiKey.length < 10) {
      console.error("TMDB API Key missing in environment variables.");
      return NextResponse.json({ error: "TMDB API Key missing" }, { status: 500 });
    }

    // 1. Fetch Person basic info
    let infoUrl = `https://api.themoviedb.org/3/person/${id}?language=${languageParam}`;
    // 2. Fetch Person movie credits
    let creditsUrl = `https://api.themoviedb.org/3/person/${id}/movie_credits?language=${languageParam}`;

    const headers: Record<string, string> = {
      accept: "application/json",
    };

    if (apiKey.startsWith("ey")) {
      headers["Authorization"] = `Bearer ${apiKey}`;
    } else {
      infoUrl += `&api_key=${apiKey}`;
      creditsUrl += `&api_key=${apiKey}`;
    }

    // Fetch both in parallel
    const [infoRes, creditsRes] = await Promise.all([
      fetch(infoUrl, { headers }),
      fetch(creditsUrl, { headers })
    ]);

    if (!infoRes.ok) {
      console.error(`TMDB Person info request failed: ${infoRes.status}`);
      return NextResponse.json({ error: `TMDB person details failed: ${infoRes.statusText}` }, { status: infoRes.status });
    }

    const infoData = await infoRes.json();
    let creditsData = { cast: [], crew: [] };

    if (creditsRes.ok) {
      creditsData = await creditsRes.json();
    } else {
      console.warn(`TMDB Person credits request failed: ${creditsRes.status}`);
    }

    // Deduplicate and process movie credits
    const uniqueMovies = new Map<number, any>();

    const addCredits = (list: any[]) => {
      for (const m of list) {
        if (!m.id) continue;
        if (!uniqueMovies.has(m.id)) {
          uniqueMovies.set(m.id, {
            id: m.id,
            title: m.title || m.original_title || "",
            posterPath: m.poster_path || null,
            backdropPath: m.backdrop_path || null,
            releaseDate: m.release_date || null,
            popularity: m.popularity || 0,
            character: m.character || null,
            job: m.job || null,
          });
        }
      }
    };

    addCredits(creditsData.cast || []);
    addCredits(creditsData.crew || []);

    const moviesList = Array.from(uniqueMovies.values());
    // Sort movies by popularity descending
    moviesList.sort((a, b) => b.popularity - a.popularity);

    const response = {
      id: infoData.id,
      name: infoData.name,
      biography: infoData.biography || "",
      profilePath: infoData.profile_path || null,
      knownForDepartment: infoData.known_for_department || "",
      movies: moviesList,
    };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200" },
    });
  } catch (error) {
    console.error("Person API route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
