import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if deck exists and belongs to user
    const deck = await prisma.deck.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        cards: {
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    return NextResponse.json(deck.cards);
  } catch (error) {
    console.error("Error fetching cards:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { front, back, difficulty = "medium" } = await request.json();

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

    // Check if deck exists and belongs to user
    const deck = await prisma.deck.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!deck) {
      return NextResponse.json({ error: "Deck not found" }, { status: 404 });
    }

    const card = await prisma.flashCard.create({
      data: {
        front: front.trim(),
        back: back.trim(),
        difficulty: difficulty as "easy" | "medium" | "hard",
        deckId: params.id
      }
    });

    // Update deck's card count
    await prisma.deck.update({
      where: { id: params.id },
      data: {
        cardCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json(card);
  } catch (error) {
    console.error("Error creating card:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 