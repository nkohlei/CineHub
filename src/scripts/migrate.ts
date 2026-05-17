import { PrismaClient } from "@prisma/client";
import { FALLBACK_MOVIES } from "../lib/fallback-data";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Fetching active user from database...");
  const users = await prisma.user.findMany();
  
  if (users.length === 0) {
    console.error("❌ No users found in the database. Please log in on the browser first so a user account is created in MongoDB Atlas!");
    process.exit(1);
  }

  // Print all users to identify
  console.log(`Found ${users.length} user(s):`);
  users.forEach((u) => console.log(`- ID: ${u.id}, Name: ${u.name}, Email: ${u.email}`));

  // Bilal's account is the first logged-in user
  const targetUser = users[0];
  console.log(`🎯 Migrating movies for target user: ${targetUser.email} (ID: ${targetUser.id})`);

  console.log(`📦 Preparing to migrate ${FALLBACK_MOVIES.length} movies...`);

  let count = 0;
  for (const fallback of FALLBACK_MOVIES) {
    // Check if the movie already exists for this user by title (avoid duplicates)
    const existing = await prisma.movie.findFirst({
      where: {
        title: fallback.title,
        userId: targetUser.id
      }
    });

    if (existing) {
      console.log(`⏭️ Skipping "${fallback.title}" (already exists for user)`);
      continue;
    }

    // Insert the movie linked to the user's ID
    await prisma.movie.create({
      data: {
        title: fallback.title,
        isWatched: fallback.isWatched,
        watchedAt: fallback.watchedAt ? new Date(fallback.watchedAt) : null,
        tagColor: fallback.tagColor,
        tmdbId: fallback.tmdbId ? Number(fallback.tmdbId) : null,
        posterPath: fallback.posterPath,
        backdropPath: fallback.backdropPath,
        rating: fallback.rating,
        imdbRating: fallback.imdbRating,
        trailerKey: fallback.trailerKey,
        releaseDate: fallback.releaseDate || null,
        cast: fallback.cast ? (fallback.cast as any) : [],
        userId: targetUser.id
      }
    });
    count++;
  }

  console.log(`🎉 SUCCESS: Migrated ${count} movies directly to your MongoDB Atlas watchlist under ${targetUser.email}!`);
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
