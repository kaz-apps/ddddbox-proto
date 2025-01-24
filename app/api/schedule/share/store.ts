import { Task } from "@/types/schedule";

// 共有データを一時的に保存するためのMap
// 本番環境では、RedisやDBを使用することを推奨
export const shareStore = new Map<string, {
  tasks: Task[];
  expiresAt: Date;
}>();

// 期限切れのデータを定期的に削除
setInterval(() => {
  const now = new Date();
  Array.from(shareStore.entries()).forEach(([key, value]) => {
    if (value.expiresAt < now) {
      shareStore.delete(key);
    }
  });
}, 1000 * 60 * 60); // 1時間ごとにクリーンアップ 