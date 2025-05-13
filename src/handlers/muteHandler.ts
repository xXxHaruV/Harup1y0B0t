// muteHandler.ts

import { Message } from "@discordeno/bot";
import { MuteDatabase } from "../database/muteDatabase.ts"; // Muteデータを管理するデータベース

// 期限付きMuteを実行
export async function temporaryMute(message: Message, targetUserId: string, duration: number, reason: string) {
  const muteDb = message.client.database.muteDatabase;

  // Muteを実行
  await muteDb.addMute(targetUserId, duration, reason);

  message.reply(`${targetUserId} が ${duration} 分間Muteされました。理由: ${reason}`);
}
