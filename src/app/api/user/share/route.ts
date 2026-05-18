import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { friendId, type, data } = await req.json();

    if (!friendId || typeof friendId !== "string") {
      return NextResponse.json({ error: "Invalid Friend ID" }, { status: 400 });
    }

    if (type !== "movie" && type !== "list") {
      return NextResponse.json({ error: "Invalid Share Type" }, { status: 400 });
    }

    if (!data) {
      return NextResponse.json({ error: "No share data provided" }, { status: 400 });
    }

    // Retrieve sender's info
    const sender = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    // Fetch the target user's inbox
    const targetUser = await prisma.user.findUnique({
      where: { id: friendId },
      select: { inbox: true, friendIds: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Recipient user not found" }, { status: 404 });
    }

    // Security check: Verify that they are friends
    if (!targetUser.friendIds.includes(userId)) {
      return NextResponse.json({ error: "You can only share with users in your friends list" }, { status: 403 });
    }

    // Create the unique share packet
    const shareItem = {
      id: crypto.randomUUID(),
      type,
      from: userId,
      senderName: sender.name || sender.email || "Someone",
      data,
      timestamp: new Date().toISOString(),
    };

    const currentInbox = Array.isArray(targetUser.inbox) ? targetUser.inbox : [];
    const updatedInbox = [...currentInbox, shareItem];

    await prisma.user.update({
      where: { id: friendId },
      data: { inbox: updatedInbox },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Share API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
