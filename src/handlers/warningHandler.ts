// warningHandler.ts

import { Message } from "@discordeno/bot";
import { WarningDatabase } from "../database/warningDatabase.ts"; // 警告データを管理するためのデータベース

// 警告を発行
export async function issueWarning(message: Message, targetUserId: string, reason: string) {
  const warningDb = message.client.database.warningDatabase;

  // 警告を発行
  await warningDb.addWarning(targetUserId, reason);

  message.reply(`${targetUserId} に警告が発行されました。理由: ${reason}`);
}

// 警告を削除
export async function removeWarning(message: Message, targetUserId: string, warningId: string) {
  const warningDb = message.client.database.warningDatabase;

  // 警告IDで削除
  const success = await warningDb.removeWarning(targetUserId, warningId);
  
  if (success) {
    message.reply(`${targetUserId} の警告ID ${warningId} を削除しました。`);
  } else {
    message.reply(`警告ID ${warningId} は見つかりませんでした。`);
  }
}

// 警告リストの取得
export async function listWarnings(message: Message, targetUserId: string) {
  const warningDb = message.client.database.warningDatabase;

  const warnings = await warningDb.getWarnings(targetUserId);

  if (warnings.length === 0) {
    message.reply(`${targetUserId} には警告がありません。`);
  } else {
    let warningList = "警告リスト:\n";
    warnings.forEach((warning, index) => {
      warningList += `${index + 1}. ID: ${warning.id} - 理由: ${warning.reason}\n`;
    });
    message.reply(warningList);
  }
}
