import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; 

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (session?.user && user?.id) {
        (session.user as any).id = user.id;
        
        // Claim existing movies on first login
        try {
          const unclaimedCount = await prisma.movie.count({
            where: { userId: null },
          });
          if (unclaimedCount > 0) {
            await prisma.movie.updateMany({
              where: { userId: null },
              data: { userId: user.id },
            });
            console.log(`Successfully claimed ${unclaimedCount} unclaimed movies for user: ${user.id}`);
          }
        } catch (err) {
          console.error("Failed to auto-claim existing movies:", err);
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
