import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const movies = [
  { title: "Blade Runner 2049", isWatched: false },
  { title: "Schindler's List", isWatched: false },
  { title: "Joker", isWatched: true, watchedAt: new Date("2025-10-17T00:00:00Z"), tagColor: "green" },
  { title: "The Gentlemen", isWatched: false },
  { title: "Goodfellas", isWatched: true, watchedAt: new Date("2025-11-01T00:00:00Z"), tagColor: "green" },
  { title: "The Irishman", isWatched: false },
  { title: "American Psycho", isWatched: false },
  { title: "Memento", isWatched: true, watchedAt: new Date("2026-02-03T00:00:00Z"), tagColor: "blue" },
  { title: "The Godfather / TG Part 2", isWatched: false },
  { title: "Pulp Fiction / Ucuz Roman", isWatched: true, watchedAt: new Date("2026-01-30T00:00:00Z"), tagColor: "yellow" },
  { title: "Machinist", isWatched: true, watchedAt: new Date("2026-05-02T00:00:00Z"), tagColor: "green" },
  { title: "Gladiator / G 2", isWatched: false },
  { title: "Donnie Brasco / Köstebek", isWatched: false },
  { title: "Demolition / Yeniden Başla", isWatched: false },
  { title: "The Lighthouse / Deniz Feneri", isWatched: false },
  { title: "The Lord of The Rings Series", isWatched: true, watchedAt: new Date("2025-10-30T00:00:00Z"), tagColor: "blue" },
  { title: "The Pianist", isWatched: false },
  { title: "The Grand Budapest Hotel", isWatched: true, watchedAt: new Date("2026-03-02T00:00:00Z"), tagColor: "blue" },
  { title: "Parasite", isWatched: true, watchedAt: new Date("2025-10-27T00:00:00Z"), tagColor: "blue" },
  { title: "Superbad", isWatched: false },
  { title: "Get out", isWatched: false },
  { title: "No Country for Old Men / İhtiyarlara Yer Yok", isWatched: false },
  { title: "Kingdom of Heaven / Cennetin Krallığı", isWatched: false },
  { title: "Zodiac", isWatched: false },
  { title: "Django", isWatched: true, watchedAt: new Date("2025-11-07T00:00:00Z"), tagColor: "blue" },
  { title: "The Good, The Bad and The Ugly", isWatched: true, watchedAt: new Date("2026-01-21T00:00:00Z"), tagColor: "blue" },
  { title: "Forrest Gump", isWatched: false },
  { title: "The Theory of Everything", isWatched: false },
  { title: "A Beautiful Mind", isWatched: false },
  { title: "The Imitation Game / Enigma", isWatched: false },
  { title: "The King's Speech / Zoraki Kral", isWatched: false },
  { title: "V for Vendetta", isWatched: true, watchedAt: new Date("2025-12-30T00:00:00Z"), tagColor: "blue" },
  { title: "Limitless / Limit Yok", isWatched: false },
  { title: "The Usual Suspects / Olağan Şüpheliler", isWatched: true, watchedAt: new Date("2025-10-18T00:00:00Z"), tagColor: "blue" },
  { title: "2001: A Space Odyssey", isWatched: false },
  { title: "The Clockwork Orange / Otomatik Portakal", isWatched: false },
  { title: "Good Will Hunting / Can Dostum", isWatched: true, watchedAt: new Date("2025-11-23T00:00:00Z"), tagColor: "blue" },
  { title: "Once Upon A Time in America", isWatched: false },
  { title: "Donnie Darko", isWatched: false },
  { title: "The Sixth Sense / Altıncı His", isWatched: false },
  { title: "The Town / Hırsızlar Şehri", isWatched: false },
  { title: "A Bronx Tale / Günaha Davet", isWatched: false },
  { title: "A Dangerous Method / Tehlikeli İlişki", isWatched: false },
  { title: "Dallas Buyers Club / Sınırsızlar Kulübü", isWatched: false },
  { title: "For a Few Dollars More / Bir kaç dolar için", isWatched: false },
  { title: "October Sky / Ekim Düşü", isWatched: false },
  { title: "Wild Hogs / Çılgın Motorcular", isWatched: false },
  { title: "Liar Liar / Yalancı yalancı", isWatched: false },
  { title: "Gulliver'in Gezileri", isWatched: false },
];

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.movie.deleteMany();
  const result = await prisma.movie.createMany({ data: movies });
  console.log(`✅ Seeded ${result.count} movies successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
