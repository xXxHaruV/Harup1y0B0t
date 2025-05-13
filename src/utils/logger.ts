// logger.ts
import { Message } from "@discordeno/bot";
import { guildSettings } from "./settings.ts";

// ログアクションを実行
export async function logAction(guildId: string, action: string) {
  const settings = guildSettings[guildId];
  if (!settings || !settings.logChannelId) return;

  const logChannel = await getLogChannel(settings.logChannelId);
  if (!logChannel) return;

  // ログチャンネルにメッセージを送信
  try {
    await logChannel.send(`**アクション**: ${action} (日時: ${new Date().toLocaleString()})`);
  } catch (error) {
    console.error(`ログ送信エラー: ${error}`);
  }
}

// ログチャンネルを取得（仮実装）
async function getLogChannel(logChannelId: string) {
  // ギルドのチャンネルを取得
  const channel = await bot.getChannel(logChannelId);
  if (channel?.type !== "text") {
    console.error("ログチャンネルが見つかりません。");
    return null;
  }

  return channel;
}
