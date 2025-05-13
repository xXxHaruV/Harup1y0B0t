// banHandler.ts

import { Message } from "@discordeno/bot";
import { BanDatabase } from "../database/banDatabase.ts"; // Banデータを管理するデータベース

// 期限付きBanを実行
export async function temporaryBan(message: Message, targetUserId: string, duration: number, reason: string) {
  const banDb = message.client.database.banDatabase;

  // Banを実行
  await banDb.addBan(targetUserId, duration, reason);

  message.reply(`${targetUserId} が ${duration} 分間Banされました。理由: ${reason}`);
}
