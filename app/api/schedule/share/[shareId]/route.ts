import { NextResponse } from "next/server";
import { shareStore } from "../store";

export async function GET(
  request: Request,
  { params }: { params: { shareId: string } }
) {
  try {
    const { shareId } = params;

    if (!shareId) {
      return NextResponse.json(
        { error: "Share ID is required" },
        { status: 400 }
      );
    }

    const shareData = shareStore.get(shareId);

    if (!shareData) {
      return NextResponse.json(
        { error: "Share not found" },
        { status: 404 }
      );
    }

    if (shareData.expiresAt < new Date()) {
      shareStore.delete(shareId);
      return NextResponse.json(
        { error: "Share has expired" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      tasks: shareData.tasks,
      expiresAt: shareData.expiresAt
    });
  } catch (error) {
    console.error("Error retrieving share data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 