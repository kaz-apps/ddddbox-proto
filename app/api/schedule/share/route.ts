import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { Task } from "@/types/schedule";
import { shareStore } from "./store";

export async function POST(request: Request) {
  try {
    const { tasks, expiryHours } = await request.json();

    // バリデーション
    if (!Array.isArray(tasks) || !expiryHours || typeof expiryHours !== "number") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // 共有IDを生成
    const shareId = nanoid();

    // 有効期限を計算
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiryHours);

    // データを保存
    shareStore.set(shareId, {
      tasks,
      expiresAt,
    });

    // 共有URLを生成
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/schedule/share/${shareId}`;

    return NextResponse.json({ url: shareUrl });
  } catch (error) {
    console.error("Error generating share URL:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 