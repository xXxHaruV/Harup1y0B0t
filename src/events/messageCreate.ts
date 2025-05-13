// messageCreate.ts
import { Message } from "@discordeno/bot";
import { guildSettings } from "../utils/settings.ts"; // プレフィックスや設定の読み込み
import { runModerationCommand } from "../handlers/moderationHandler.ts";
import { runRankCommand } from "../handlers/rankHandler.ts";
import { runXPCommand } from "../handlers/xpHandler.ts";
import { runConfigCommand } from "../handlers/configHandler.ts";

export async function handleMessageCreate(message: Message) {
  // ボットのメッセージは無視
  if (message.isBot) return;

  const guildId = message.guildId?.toString();
  if (!guildId) return;

  // サーバーごとのプレフィックスを取得（デフォルト: a!）
  const prefix = guildSettings[guildId]?.prefix ?? "a!";
  if (!message.content.startsWith(prefix)) return;

  const [command, ...args] = message.content.slice(prefix.length).trim().split(/\s+/);

  // 管理系コマンドディスパッチ
  if (["mute", "unmute", "ban", "unban", "kick", "warn", "listwarns", "delwarn", "clearwarns", "tban"].includes(command)) {
    await runModerationCommand(command, message, args);
  } else if (command === "rank" || command === "setrank") {
    await runRankCommand(command, message, args);
  } else if (command === "cgxp") {
    await runXPCommand(message, args);
  } else if (["setmuterole", "setmodrole", "setlogchannel", "setprefix", "ca"].includes(command)) {
    await runConfigCommand(command, message, args);
  }
}
