// rankHandler.ts
import { Message } from "@discordeno/bot";
import { guildSettings } from "../utils/settings.ts";
import { logAction } from "../utils/logger.ts";

// XPやランクを管理する
export async function runRankCommand(command: string, message: Message, args: string[]) {
  const guildId = message.guildId?.toString();
  if (!guildId) return;

  // コマンドを実行できる権限をチェック（ここでは仮に 'ADMIN' として実装）
  if (!message.member?.permissions.has("ADMINISTRATOR")) {
    message.reply("このコマンドを実行する権限がありません。");
    return;
  }

  // コマンドの実行
  switch (command) {
    case "rank":
      await manageRank(message, args);
      break;
    case "xp":
      await manageXP(message, args);
      break;
    case "setrank":
      await setRank(message, args);
      break;
    case "setxp":
      await setXP(message, args);
      break;
    default:
      message.reply("不正なコマンドです。");
  }
}

// ランク管理
async function manageRank(message: Message, args: string[]) {
  const target = message.mentions.members?.first();
  if (!target) {
    message.reply("ランクを管理するユーザーを指定してください。");
    return;
  }

  // ランク情報取得（仮実装）
  const userRank = "ゲスト"; // ダミー
  message.reply(`${target.user.tag} のランク: ${userRank}`);
  logAction(message.guildId!, `${target.user.tag} のランクを確認しました。`);
}

// XP管理
async function manageXP(message: Message, args: string[]) {
  const target = message.mentions.members?.first();
  if (!target) {
    message.reply("XPを管理するユーザーを指定してください。");
    return;
  }

  // XP情報取得（仮実装）
  const userXP = 100; // ダミー
  message.reply(`${target.user.tag} のXP: ${userXP}`);
  logAction(message.guildId!, `${target.user.tag} のXPを確認しました。`);
}

// ランク設定
async function setRank(message: Message, args: string[]) {
  const target = message.mentions.members?.first();
  const rankName = args[1];
  if (!target || !rankName) {
    message.reply("ランクを設定するユーザーとランク名を指定してください。");
    return;
  }

  // ランクを設定（仮実装）
  message.reply(`${target.user.tag} にランク ${rankName} を設定しました。`);
  logAction(message.guildId!, `${target.user.tag} にランク ${rankName} を設定しました。`);
}

// XP設定
async function setXP(message: Message, args: string[]) {
  const target = message.mentions.members?.first();
  const xp = parseInt(args[1]);
  if (!target || isNaN(xp)) {
    message.reply("XPを設定するユーザーとXPの値を指定してください。");
    return;
  }

  // XPを設定（仮実装）
  message.reply(`${target.user.tag} のXPを ${xp} に設定しました。`);
  logAction(message.guildId!, `${target.user.tag} のXPを ${xp} に設定しました。`);
}
