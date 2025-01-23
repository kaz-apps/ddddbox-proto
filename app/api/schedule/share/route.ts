import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { Task } from "@/types/schedule";

// 共有データを一時的に保存するためのMap
// 本番環境では、RedisやDBを使用することを推奨
const shareStore = new Map<string, {
  tasks: Task[];
  expiresAt: Date;
}>();

// 期限切れのデータを定期的に削除
setInterval(() => {
  const now = new Date();
  for (const [key, value] of shareStore.entries()) {
    if (value.expiresAt < now) {
      shareStore.delete(key);
    }
  }
}, 1000 * 60 * 60); // 1時間ごとにクリーンアップ

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

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const shareId = url.pathname.split("/").pop();

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

    return NextResponse.json(shareData);
  } catch (error) {
    console.error("Error retrieving share data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 