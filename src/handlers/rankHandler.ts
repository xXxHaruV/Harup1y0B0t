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
// rankHandler.ts

import { Message } from "@discordeno/bot";
import { RankDatabase } from "../database/rankDatabase.ts";

// ランクコマンドの実行
export async function runRankCommand(command: string, message: Message, args: string[]) {
  const userId = message.author.id;

  // RankDatabaseを取得
  const rankDb = message.client.database.rankDatabase;

  // コマンドによる操作
  if (command === "set") {
    if (args.length < 2) {
      message.reply("正しいフォーマットでランクを設定してください。例: a!rank set [ユーザーID] [ランク名]");
      return;
    }
    const targetUserId = args[0];
    const rankName = args[1];

    // ランク設定
    await rankDb.setRank(targetUserId, rankName);
    message.reply(`${targetUserId} のランクが ${rankName} に設定されました。`);
  }

  // XPの追加
  if (command === "add") {
    if (args.length < 2) {
      message.reply("XPの追加数を指定してください。例: a!rank add [ユーザーID] xp [数値]");
      return;
    }
    const targetUserId = args[0];
    const xpToAdd = parseInt(args[1]);

    if (isNaN(xpToAdd)) {
      message.reply("XPの数値を正しく入力してください。");
      return;
    }

    // XP加算
    await rankDb.addXP(targetUserId, xpToAdd);
    message.reply(`${targetUserId} に ${xpToAdd} XP が追加されました。`);
  }

  // XPの削除
  if (command === "remove") {
    if (args.length < 2) {
      message.reply("XPの削除数を指定してください。例: a!rank remove [ユーザーID] xp [数値]");
      return;
    }
    const targetUserId = args[0];
    const xpToRemove = parseInt(args[1]);

    if (isNaN(xpToRemove)) {
      message.reply("XPの数値を正しく入力してください。");
      return;
    }

    // XP削除
    const currentXP = await rankDb.getXP(targetUserId);
    const newXP = currentXP - xpToRemove;

    if (newXP < 0) {
      message.reply("XPがマイナスにはなりません。");
      return;
    }

    await rankDb.setXP(targetUserId, newXP);
    message.reply(`${targetUserId} の XP が ${xpToRemove} 削除されました。`);
  }

  // レベル設定
  if (command === "level") {
    if (args.length < 2) {
      message.reply("レベルを指定してください。例: a!rank level [ユーザーID] [レベル]");
      return;
    }
    const targetUserId = args[0];
    const level = parseInt(args[1]);

    if (isNaN(level)) {
      message.reply("レベルの数値を正しく入力してください。");
      return;
    }

    // レベル設定（例: XPによるレベル計算）
    const xpToLevelUp = level * 100; // 例えば、レベル1で100XP、レベル2で200XP...
    await rankDb.setXP(targetUserId, xpToLevelUp);
    message.reply(`${targetUserId} のレベルが ${level} に設定されました。`);
  }

  // ユーザーのランクとXPを表示
  if (command === "get") {
    const rank = await rankDb.getRank(userId);
    const xp = await rankDb.getXP(userId);

    message.reply(`あなたのランクは "${rank}" で、XPは ${xp} です。`);
  }
}
