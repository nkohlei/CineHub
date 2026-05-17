const fs = require('fs');

let data = fs.readFileSync('src/lib/fallback-data.ts', 'utf8');

// Fix syntax errors first
data = data.replace(/createdAt:\s*,/g, 'createdAt: "2025-01-01T00:00:00Z",');
data = data.replace(/, posterPath: null, backdropPath: null, trailerKey: null, rating: null/g, '');

const routeContent = fs.readFileSync('src/app/api/tmdb/[tmdbId]/route.ts', 'utf8');
const match = routeContent.match(/const FALLBACK_DETAILS: Record<number, \{[^}]+\}> = (\{[\s\S]+?\});\n\n\/\//);
const fallbackDetails = eval('(' + match[1] + ')');

const lines = data.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('tmdbId: ')) {
    const tmdbIdMatch = lines[i].match(/tmdbId: (\d+)/);
    if (tmdbIdMatch) {
      const tmdbId = parseInt(tmdbIdMatch[1], 10);
      const details = fallbackDetails[tmdbId];
      if (details) {
        // Remove trailing ' }' or ' },'
        lines[i] = lines[i].replace(/ \},?$/, '');
        lines[i] += `, posterPath: "${details.posterPath}", backdropPath: "${details.backdropPath}", trailerKey: null, rating: ${details.rating} },`;
      }
    }
  }
}

fs.writeFileSync('src/lib/fallback-data.ts', lines.join('\n'));
