import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        shareId: true,
        friends: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            shareId: true,
          },
        },
        inbox: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      shareId: userProfile.shareId,
      friends: userProfile.friends,
      inbox: userProfile.inbox || [],
    });
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
