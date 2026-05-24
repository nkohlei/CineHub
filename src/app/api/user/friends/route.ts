import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { shareId } = await req.json();
    if (!shareId || typeof shareId !== "string") {
      return NextResponse.json({ error: "Invalid Share ID" }, { status: 400 });
    }

    const cleanShareId = shareId.trim().toUpperCase();

    // Fetch current user details
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, shareId: true, friendIds: true, friendOfIds: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (currentUser.shareId === cleanShareId) {
      return NextResponse.json({ error: "You cannot add yourself as a friend" }, { status: 400 });
    }

    // Find the target user
    const targetUser = await prisma.user.findUnique({
      where: { shareId: cleanShareId },
      select: { id: true, friendIds: true, friendOfIds: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "No user found with this Share ID" }, { status: 404 });
    }

    // Check if already friends
    if (currentUser.friendIds.includes(targetUser.id)) {
      return NextResponse.json({ error: "You are already friends with this user" }, { status: 400 });
    }

    // Symmetric addition (bidirectional relationship)
    await prisma.user.update({
      where: { id: userId },
      data: {
        friendIds: { push: targetUser.id },
        friendOfIds: { push: targetUser.id },
      },
    });

    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        friendIds: { push: userId },
        friendOfIds: { push: userId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add Friend API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { friendId } = await req.json();
    if (!friendId || typeof friendId !== "string") {
      return NextResponse.json({ error: "Invalid Friend ID" }, { status: 400 });
    }

    // Fetch both users
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { friendIds: true, friendOfIds: true },
    });

    const targetUser = await prisma.user.findUnique({
      where: { id: friendId },
      select: { friendIds: true, friendOfIds: true },
    });

    if (!currentUser || !targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Symmetric deletion
    await prisma.user.update({
      where: { id: userId },
      data: {
        friendIds: { set: currentUser.friendIds.filter((id) => id !== friendId) },
        friendOfIds: { set: currentUser.friendOfIds.filter((id) => id !== friendId) },
      },
    });

    await prisma.user.update({
      where: { id: friendId },
      data: {
        friendIds: { set: targetUser.friendIds.filter((id) => id !== userId) },
        friendOfIds: { set: targetUser.friendOfIds.filter((id) => id !== userId) },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove Friend API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
