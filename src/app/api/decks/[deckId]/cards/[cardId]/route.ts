import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string; cardId: string }> }
) {
  const { deckId, cardId } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { front, back, difficulty } = await request.json();

    if (!front || typeof front !== "string" || front.trim().length === 0) {
      return NextResponse.json(
        { error: "Card front is required" },
        { status: 400 }
      );
    }

    if (!back || typeof back !== "string" || back.trim().length === 0) {
      return NextResponse.json(
        { error: "Card back is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if card exists and belongs to user's deck
    const existingCard = await prisma.flashCard.findFirst({
      where: {
        id: cardId,
        deck: {
          id: deckId,
          userId: user.id
        }
      }
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const updatedCard = await prisma.flashCard.update({
      where: { id: cardId },
      data: {
        front: front.trim(),
        back: back.trim(),
        difficulty: difficulty as "easy" | "medium" | "hard"
      }
    });

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error("Error updating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ deckId: string; cardId: string }> }
) {
  const { deckId, cardId } = await params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if card exists and belongs to user's deck
    const existingCard = await prisma.flashCard.findFirst({
      where: {
        id: cardId,
        deck: {
          id: deckId,
          userId: user.id
        }
      }
    });

    if (!existingCard) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    // Delete the card
    await prisma.flashCard.delete({
      where: { id: cardId }
    });

    // Update deck's card count
    await prisma.deck.update({
      where: { id: deckId },
      data: {
        cardCount: {
          decrement: 1
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 