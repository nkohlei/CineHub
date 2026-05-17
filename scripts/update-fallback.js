const fs = require('fs');

const routeContent = fs.readFileSync('src/app/api/tmdb/[tmdbId]/route.ts', 'utf8');

// Extract FALLBACK_DETAILS object
const match = routeContent.match(/const FALLBACK_DETAILS: Record<number, \{[^}]+\}> = (\{[\s\S]+?\});\n\n\/\//);
if (!match) {
  console.error("Could not find FALLBACK_DETAILS");
  process.exit(1);
}

// Safely parse the object
let fallbackDetails;
try {
  // It's a JS object, not strict JSON (no quotes around keys), so eval is easiest
  fallbackDetails = eval('(' + match[1] + ')');
} catch (e) {
  console.error("Failed to parse FALLBACK_DETAILS", e);
  process.exit(1);
}

let fallbackDataContent = fs.readFileSync('src/lib/fallback-data.ts', 'utf8');

for (const [tmdbIdStr, details] of Object.entries(fallbackDetails)) {
  const tmdbId = parseInt(tmdbIdStr, 10);
  
  // Create regex to match the object for this tmdbId
  // Example: { id: "f1", ..., tmdbId: 335984, createdAt: "2025-01-01T00:00:00Z", posterPath: null, backdropPath: null, trailerKey: null, rating: null }
  
  const regex = new RegExp(`({[^}]+tmdbId: ${tmdbId},[^}]+createdAt: "[^"]+"(?:, posterPath: null, backdropPath: null, trailerKey: null, rating: null)? })`);
  
  fallbackDataContent = fallbackDataContent.replace(regex, (fullMatch) => {
    // Remove the trailing '}' and any trailing null fields we added earlier
    let clean = fullMatch.replace(/, posterPath: null, backdropPath: null, trailerKey: null, rating: null \}/, '');
    clean = clean.replace(/ \}$/, '');
    
    return `${clean}, posterPath: "${details.posterPath}", backdropPath: "${details.backdropPath}", trailerKey: null, rating: ${details.rating} }`;
  });
}

fs.writeFileSync('src/lib/fallback-data.ts', fallbackDataContent);
console.log("Successfully updated fallback-data.ts");
