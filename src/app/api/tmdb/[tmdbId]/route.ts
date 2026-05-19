import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails, getPosterUrl, getBackdropUrl, getProfileUrl } from "@/lib/tmdb";

// Fallback poster/rating cache for all 49 seeded movies
// This ensures posters display even when TMDB_API_KEY is not configured
const FALLBACK_DETAILS: Record<number, { posterPath: string; backdropPath: string | null; rating: number; year: string; overview: string; runtime: number; genres: string[] }> = {
  335984: { posterPath: "/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg", backdropPath: "/sAtoMqDVhNDQBc3QJL3RF6hlhGq.jpg", rating: 7.5, year: "2017", overview: "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.", runtime: 164, genres: ["Science Fiction", "Drama"] },
  424: { posterPath: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg", backdropPath: "/zb6fM1CX41D9rF9hdgclu0peUmy.jpg", rating: 8.6, year: "1993", overview: "The true story of how businessman Oskar Schindler saved over a thousand Jewish lives from the Nazis while they worked as slaves in his factory during World War II.", runtime: 195, genres: ["Drama", "History", "War"] },
  475557: { posterPath: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg", backdropPath: "/n6bUvigpRFqSwmPp1m2YMDNkAzu.jpg", rating: 8.2, year: "2019", overview: "During the 1980s, a failed stand-up comedian is driven insane and turns to a life of crime and chaos in Gotham City while becoming an infamous psychopathic criminal figure.", runtime: 122, genres: ["Crime", "Thriller", "Drama"] },
  522627: { posterPath: "/jtrhTYB7xSrJxR1EUd9ManDMTIR.jpg", backdropPath: "/cMDFOsDgRBYWnaVtj6Do9vfPk8h.jpg", rating: 7.7, year: "2020", overview: "Mickey Pearson is an American expat who built a highly profitable marijuana empire in London. When word gets out that he's looking to cash out of the business forever it triggers plots, schemes, bribery and blackmail.", runtime: 113, genres: ["Action", "Comedy", "Crime"] },
  769: { posterPath: "/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg", backdropPath: "/sw7mordbZxgITU877yTpZCud90M.jpg", rating: 8.5, year: "1990", overview: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.", runtime: 145, genres: ["Drama", "Crime"] },
  398978: { posterPath: "/pgqVuxJDJpS5lRo8NkBjshoQPgN.jpg", backdropPath: "/6qmR8aBchikXbuBomTUHbYK0dNB.jpg", rating: 7.8, year: "2019", overview: "Pennsylvania, 1956. Frank Sheeran, a war veteran of Irish origin who works as a truck driver, inadvertently becomes a hitman involved with mobster Russell Bufalino and his crime family.", runtime: 209, genres: ["Crime", "Drama", "History"] },
  1359: { posterPath: "/9uGHEgsiUXjCNq8wdq4r49YL8A1.jpg", backdropPath: "/jm9TFbyRHtNJLLQhvGvuGeqEOa5.jpg", rating: 7.4, year: "2000", overview: "A wealthy New York City investment banking executive, Patrick Bateman, hides his alternate psychopathic ego from his co-workers and friends as he delves deeper into his violent, hedonistic fantasies.", runtime: 102, genres: ["Thriller", "Drama", "Crime"] },
  77: { posterPath: "/yuNs09hvpHVU1cBTCAk9zxsL2oq.jpg", backdropPath: "/cfrPkqObAIE1PBjGUTWHXwTPHT8.jpg", rating: 8.2, year: "2000", overview: "Leonard Shelby is tracking down the man who raped and murdered his wife. The difficulty of locating his wife's killer is compounded by the fact that he suffers from a rare, untreatable form of short-term memory loss.", runtime: 113, genres: ["Mystery", "Thriller"] },
  238: { posterPath: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg", backdropPath: "/tmU7GeKVybMWFButWEGl2M4GeiP.jpg", rating: 8.7, year: "1972", overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael, steps in.", runtime: 175, genres: ["Drama", "Crime"] },
  680: { posterPath: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg", backdropPath: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg", rating: 8.5, year: "1994", overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.", runtime: 154, genres: ["Thriller", "Crime"] },
  1480: { posterPath: "/63GlkKmTV09hknvNnZFaIVwcPiB.jpg", backdropPath: "/zIV1fS36dEhTEzHUJhMgaHZBIWo.jpg", rating: 7.5, year: "2004", overview: "An industrial worker who hasn't slept in a year begins to doubt his own sanity.", runtime: 101, genres: ["Thriller", "Drama", "Mystery"] },
  98: { posterPath: "/ty8TGRuvJLPUmAR1H1nRIsgCLYh.jpg", backdropPath: "/grE3jSOsGsmXoFR6pbpjFgfNs35.jpg", rating: 8.2, year: "2000", overview: "In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into chaos. Maximus is one of the Roman army's most capable and trusted generals and a key advisor to the emperor.", runtime: 155, genres: ["Action", "Drama", "Adventure"] },
  3783: { posterPath: "/i1JeWyK3nHzWL0BaPewJuPC2iCo.jpg", backdropPath: "/7XPrxO3EQrM90GDjLYx8uG6sQiG.jpg", rating: 7.4, year: "1997", overview: "An FBI undercover agent infiltrates the mob and finds himself identifying more with the mafia life, at the expense of his regular one.", runtime: 127, genres: ["Crime", "Drama", "Thriller"] },
  334521: { posterPath: "/6fDZ3Q7mAQ2TMeGduhN2m2bJfPl.jpg", backdropPath: "/njXcFTYwBGPqVlVfWGLkzjkHSqG.jpg", rating: 6.9, year: "2015", overview: "A successful New Yorker who has lost the ability to feel undergoes a personal journey of self-discovery after his wife dies in a commuter rail crash.", runtime: 100, genres: ["Drama"] },
  503919: { posterPath: "/3nk9UoepMnRLkgBFNSRQ4bMlpHl.jpg", backdropPath: "/2cKpOAC4CdCBUsnxRZfDhf96kPX.jpg", rating: 7.5, year: "2019", overview: "Two lighthouse keepers try to maintain their sanity while living on a remote and mysterious New England island in the 1890s.", runtime: 110, genres: ["Drama", "Fantasy", "Horror"] },
  120: { posterPath: "/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg", backdropPath: "/vRQnzOn4HjIMX4LBq9nHhFXbXcb.jpg", rating: 8.4, year: "2001", overview: "Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator.", runtime: 179, genres: ["Adventure", "Fantasy", "Action"] },
  423: { posterPath: "/2DFutPfBAnWlIBUqkMHljWKzYb.jpg", backdropPath: "/zYFkEJe1hWE0mvq2JW4vxVdBf3b.jpg", rating: 8.5, year: "2002", overview: "The true story of pianist Władysław Szpilman's experiences in Warsaw during the Nazi occupation.", runtime: 150, genres: ["Drama", "War"] },
  120467: { posterPath: "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg", backdropPath: "/nDhR2GVbJVnOxq6C9RPSxAuihXF.jpg", rating: 8.1, year: "2014", overview: "The adventures of Gustave H, a legendary concierge at a famous European hotel between the wars, and Zero Moustafa, the lobby boy who becomes his most trusted friend.", runtime: 99, genres: ["Comedy", "Drama"] },
  496243: { posterPath: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg", backdropPath: "/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg", rating: 8.5, year: "2019", overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.", runtime: 133, genres: ["Comedy", "Thriller", "Drama"] },
  8363: { posterPath: "/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg", backdropPath: "/rjBwhsOzHKUw2NIOrE7aMqjfe6s.jpg", rating: 7.2, year: "2007", overview: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry.", runtime: 113, genres: ["Comedy"] },
  419430: { posterPath: "/qbaZVg4RMsV6dWzcBNhTFpzR2wP.jpg", backdropPath: "/hQMDH2qBuVN8DvCfFdtJqbvjBo7.jpg", rating: 7.6, year: "2017", overview: "Chris and his girlfriend Rose go upstate to visit her parents for the weekend. At first, Chris reads the family's overly accommodating behavior as nervous attempts to deal with their daughter's interracial relationship.", runtime: 104, genres: ["Horror", "Thriller", "Mystery"] },
  6977: { posterPath: "/bj1v6YKF8yHqA489GFfAWcrKiN1.jpg", backdropPath: "/2rO1FNyFWLyR0pj0y0sCaJAbqlG.jpg", rating: 8.1, year: "2007", overview: "Llewelyn Moss stumbles upon dead bodies, two million dollars and a hoard of heroin in a Texas desert. When he takes the money, he sets off a chain reaction of catastrophic violence.", runtime: 122, genres: ["Crime", "Drama", "Thriller"] },
  1495: { posterPath: "/u1G58XiGQjZfAfuP0lSbXkTMMQs.jpg", backdropPath: "/8HyJOSTaozmzBxjVhTpYMV3ipJP.jpg", rating: 7.1, year: "2005", overview: "After the death of King Richard I, the legendary knight Balian of Ibelin journeys to the Holy Land to join the fight against the Saracens.", runtime: 144, genres: ["Drama", "Action", "Adventure", "History", "War"] },
  1949: { posterPath: "/oOVJgaW74ky3pXIKnpMpbR4p1a2.jpg", backdropPath: "/mOExm0OHEp6wtsofKNtjLUjSUYx.jpg", rating: 7.6, year: "2007", overview: "The true story of the investigation of the Zodiac Killer, a serial killer who terrorized the San Francisco Bay Area during the late 1960s and early 1970s.", runtime: 158, genres: ["Crime", "Drama", "Mystery", "Thriller"] },
  68718: { posterPath: "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg", backdropPath: "/2oZklIzUbvZXXzIFzv7Hi68d6xf.jpg", rating: 8.2, year: "2012", overview: "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.", runtime: 165, genres: ["Drama", "Western"] },
  429: { posterPath: "/bX2xnavhMYjWDoZp1VM6VnU1xwe.jpg", backdropPath: "/qoETbN8H4dNjsKJmfsxrGjafskK.jpg", rating: 8.5, year: "1966", overview: "While the Civil War rages between the Union and the Confederacy, three men – a quiet loner, a ruthless hit man, and a Mexican bandit – comb the American Southwest in search of a strongbox containing $200,000 in stolen gold.", runtime: 161, genres: ["Western"] },
  13: { posterPath: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg", backdropPath: "/7c9UVPPiTPltouxRVY6N9uugaVA.jpg", rating: 8.5, year: "1994", overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events — in each case, far exceeding what anyone imagined he could do.", runtime: 142, genres: ["Comedy", "Drama", "Romance"] },
  266856: { posterPath: "/4jnGo5yXcaFhkWrCOOGfsDB1SBl.jpg", backdropPath: "/zMkU3vGBCODnRCvd0SNIw3lZa1I.jpg", rating: 7.9, year: "2014", overview: "A look at the relationship between the famous physicist Stephen Hawking and his wife.", runtime: 123, genres: ["Drama", "Romance"] },
  453: { posterPath: "/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg", backdropPath: "/4sfBXrBqaA5R5XhN8RxYZYh7FYE.jpg", rating: 8.2, year: "2001", overview: "John Nash is a brilliant but asocial mathematician fighting schizophrenia. After he accepts secret work in cryptography, his life takes a turn for the nightmarish.", runtime: 135, genres: ["Drama", "Romance"] },
  205596: { posterPath: "/noUp0XOqIcmgefRnRZa1nhtRvWO.jpg", backdropPath: "/fII7iBjVemrZDmJpGaStO9gLsiB.jpg", rating: 8.0, year: "2014", overview: "Based on the real life story of legendary cryptanalyst Alan Turing, the film portrays the nail-biting race against time by Turing and his brilliant team of code-breakers at Britain's top-secret Government Code and Cypher School at Bletchley Park.", runtime: 114, genres: ["History", "Drama", "Thriller", "War"] },
  45269: { posterPath: "/6dlnrhk1JiYiRSZCY7CSXDhU8mT.jpg", backdropPath: "/bqz2oRoIKdRCBbEoIGBuOc95d2E.jpg", rating: 8.0, year: "2010", overview: "The story of King George VI, his impromptu ascension to the throne of the British Empire in 1936, and the speech therapist who helped the unsure monarch overcome his stammer.", runtime: 118, genres: ["Drama", "History"] },
  752: { posterPath: "/hVAe6wYJ4fKRbOhAD2OTcb5dOcB.jpg", backdropPath: "/k6rVL4MFgQg5SpYPYgN2FQmg3PG.jpg", rating: 8.2, year: "2005", overview: "In a world in which Great Britain has become a fascist state, a masked vigilante known only as V conducts guerrilla warfare against the oppressive British government.", runtime: 132, genres: ["Action", "Thriller", "Science Fiction"] },
  51876: { posterPath: "/fVAFcaj3A3EaCdPngJCiPVsMjQn.jpg", backdropPath: "/fEilYZ8OuiPJvQYBMDpJnBaDkkK.jpg", rating: 7.2, year: "2011", overview: "A paranoia-fueled action thriller about an unsuccessful writer whose life is transformed by a top-secret smart drug that allows him to use 100% of his brain and become a perfect version of himself.", runtime: 105, genres: ["Thriller", "Mystery", "Science Fiction"] },
  629: { posterPath: "/bUPmtQzrRhzqYySeiMjPMVsbDrP.jpg", backdropPath: "/rB4tBhnPFHJkwJFJuJ0jbIXIiit.jpg", rating: 8.2, year: "1995", overview: "A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, which began when five criminals met at a seemingly random police lineup.", runtime: 106, genres: ["Drama", "Crime", "Thriller"] },
  62: { posterPath: "/ve72VENPsIPXOXNtENpFWnlfiv5.jpg", backdropPath: "/dmPk3jFEOzMhBMEbK7KZyRMfPwc.jpg", rating: 8.1, year: "1968", overview: "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced supercomputer.", runtime: 149, genres: ["Science Fiction", "Mystery", "Adventure"] },
  185: { posterPath: "/4sHeTAp65WrSSuc05nRBKddhBxO.jpg", backdropPath: "/5rTz02VtPWK0k5vgk2s2yIGYbcI.jpg", rating: 8.2, year: "1971", overview: "Demonic gang leader Alex DeLarge is jailed and volunteers for an ideological experiment that is designed to make him sick at the sight or even thought of violence.", runtime: 136, genres: ["Science Fiction", "Drama"] },
  489: { posterPath: "/bABCBKYBK7A5G1x0FzmKjhp434C.jpg", backdropPath: "/cvMnXAOVqsaJi7CUqCo6BnRv1cR.jpg", rating: 8.3, year: "1997", overview: "Will Hunting has a genius-level IQ but chooses to work as a janitor at MIT. When his talents are discovered by Professor Gerald Lambeau, he must confront his demons with the help of a therapist.", runtime: 126, genres: ["Drama"] },
  311: { posterPath: "/i0enkzsL5dPeneWnjl1fCWm6L7k.jpg", backdropPath: "/vnTVnIBz3VQxvVlfW7bgLqT8kyd.jpg", rating: 8.4, year: "1984", overview: "A comprehensive portrait of the lives of small-time hoods in the Jewish neighbourhood of New York's Lower East Side, spanning from the 1920s to the 1960s.", runtime: 229, genres: ["Drama", "Crime"] },
  141: { posterPath: "/fhQoQaJEOpaJMhSBFxknGm20IqN.jpg", backdropPath: "/yOxISTEfFxSU73rMEUf3p5gBD2l.jpg", rating: 7.8, year: "2001", overview: "After narrowly escaping a bizarre accident, a troubled teenager is plagued by visions of a man in a large rabbit suit who manipulates him to commit a series of crimes.", runtime: 113, genres: ["Fantasy", "Drama", "Mystery"] },
  745: { posterPath: "/4AfSDjsOvaHBMlSAzuFjMuRJHTY.jpg", backdropPath: "/gNBCvtYyGPbjPCT1k3MvJuNuXR6.jpg", rating: 8.1, year: "1999", overview: "A boy who communicates with spirits seeks the help of a disheartened child psychologist.", runtime: 107, genres: ["Mystery", "Thriller", "Drama"] },
  50318: { posterPath: "/k0E3a0Hix2tJYMj8DDBKhSKXcHJ.jpg", backdropPath: "/rkT5VGnO1dJFkccDkYc3AshGb7l.jpg", rating: 7.3, year: "2010", overview: "Doug MacRay is a longtime thief, who, smelling trouble, takes a bank manager as a hostage. Yet things go awry when he falls in love with her.", runtime: 125, genres: ["Crime", "Drama", "Thriller"] },
  5765: { posterPath: "/7j8f8pFPjdV47OHbR6gAEsdexYd.jpg", backdropPath: "/kZaKc3vvyNnUIFrdyGHlONWFZLQ.jpg", rating: 8.0, year: "1993", overview: "A father becomes worried when a local mafia boss befriends his son in the Bronx in the 1960s.", runtime: 121, genres: ["Drama", "Crime"] },
  64689: { posterPath: "/oW2aKaMiTMIB29GUcFfLiHNjbOq.jpg", backdropPath: "/k5uD4EnXYSYXjBfJLXDLPpQkH6Y.jpg", rating: 6.4, year: "2011", overview: "A look at how the intense relationship between Carl Jung and Sigmund Freud gives birth to psychoanalysis.", runtime: 99, genres: ["Drama", "Thriller"] },
  152532: { posterPath: "/faUT4x3Wl8M9IVjMeTZkFzNKsVE.jpg", backdropPath: "/qo76UvMHaZOBvQGEAdNnixkidgM.jpg", rating: 8.0, year: "2013", overview: "Determined to find a market for a new AIDS treatment drug, Ron Woodroof establishes a business that challenges the medical and pharmaceutical establishment.", runtime: 117, genres: ["Drama", "History"] },
  938: { posterPath: "/eVqKmjWbOunq2A0P8n0A8nnLmrD.jpg", backdropPath: "/5M0j0B18abtBI5gi2RhfjjurTqb.jpg", rating: 8.0, year: "1965", overview: "Two bounty hunters with the same intentions team up to track down a Western outlaw.", runtime: 132, genres: ["Western"] },
  10344: { posterPath: "/ysH0yUl4IulcmH1MnGUSJn2wtn2.jpg", backdropPath: "/dWLfYKh7hYqbLVzjqENAP3iySlP.jpg", rating: 7.6, year: "1999", overview: "Based on the true story of Homer Hickam, a coal miner's son who was inspired by the first Sputnik launch to take up rocketry against his father's wishes.", runtime: 108, genres: ["Drama", "Family"] },
  7980: { posterPath: "/2rM4k7ESR3mS4lhtN0q4VRgQCBK.jpg", backdropPath: "/5l5qBzDMfb5hgcI2fBhJplMJLJK.jpg", rating: 6.1, year: "2007", overview: "Wannabe biker foursome find their middle-aged lives in a rut, so they don their leathers and hit the road.", runtime: 100, genres: ["Adventure", "Comedy"] },
  1624: { posterPath: "/ilN3fEiOIKADjqpPhMzKJ2oadd3.jpg", backdropPath: "/uQfcz37MuyZtKvezYPv5lJPFluS.jpg", rating: 6.9, year: "1997", overview: "A fast-track lawyer can't lie for 24 hours due to his son's birthday wish after he turns his life around.", runtime: 86, genres: ["Comedy"] },
  39451: { posterPath: "/2TTDNHM9EJiS5nYo3sZNrE2g5Py.jpg", backdropPath: "/gA1C0fUIwkvqy7xOxfygjV1q3T4.jpg", rating: 5.2, year: "2010", overview: "Travel writer Lemuel Gulliver takes an assignment in Bermuda, but ends up on the island of Lilliput, where he towers over its tiny citizens.", runtime: 85, genres: ["Adventure", "Fantasy", "Comedy"] },
};

// GET /api/tmdb/[tmdbId] — Get full movie details from TMDB with fallback
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tmdbId: string }> }
) {
  const { tmdbId } = await params;
  const id = parseInt(tmdbId, 10);

  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("language") || "en";

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid TMDB ID" }, { status: 400 });
  }

  // Try live TMDB API first
  const apiKey = process.env.TMDB_API_KEY;
  if (apiKey && apiKey !== "YOUR_TMDB_API_KEY_HERE" && apiKey.length > 10) {
    try {
      const details = await getMovieDetails(id, lang);
      const response = {
        posterUrl: getPosterUrl(details.poster_path, "w500"),
        backdropUrl: getBackdropUrl(details.backdrop_path),
        overview: details.overview,
        rating: Math.round(details.vote_average * 10) / 10,
        trailerKey: details.trailerKey,
        videos: details.videos || [],
        year: details.release_date?.split("-")[0] || "",
        runtime: details.runtime,
        genres: details.genres.map((g: { name: string }) => g.name),
        cast: details.cast.map(
          (c: { id: number; name: string; character: string; profile_path: string | null }) => ({
            ...c,
            profileUrl: getProfileUrl(c.profile_path),
          })
        ),
      };
      return NextResponse.json(response, {
        headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200" },
      });
    } catch (error) {
      console.warn(`TMDB API failed for ID ${id}, trying fallback:`, (error as Error).message);
    }
  }

  // Fallback: return cached poster/rating data
  const fallback = FALLBACK_DETAILS[id];
  if (fallback) {
    return NextResponse.json({
      posterUrl: `https://image.tmdb.org/t/p/w500${fallback.posterPath}`,
      backdropUrl: fallback.backdropPath ? `https://image.tmdb.org/t/p/w1280${fallback.backdropPath}` : null,
      overview: fallback.overview,
      rating: fallback.rating,
      trailerKey: null,
      videos: [],
      year: fallback.year,
      runtime: fallback.runtime,
      genres: fallback.genres,
      cast: [],
    }, {
      headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200" },
    });
  }

  // No fallback available for this ID
  return NextResponse.json({
    posterUrl: null, backdropUrl: null, overview: "", rating: 0,
    trailerKey: null, videos: [], year: "", runtime: 0, genres: [], cast: [],
  });
}
