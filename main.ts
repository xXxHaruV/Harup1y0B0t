import { createBot, getBotIdFromToken, startBot } from "@discordeno/mod.ts";
import { initializeDatabase } from "./utils/database.ts";
import { RankDatabase } from "./database/rankDatabase.ts";
import { runRankCommand } from "./handlers/rankHandler.ts";

import "$std/dotenv/load.ts";

// Botのトークンを.envから取得
const BotToken: string = Deno.env.get("BOT_TOKEN")!;

// データベース接続の初期化
let rankDatabase: RankDatabase;

async function initialize() {
  rankDatabase = await initializeDatabase(); // データベース接続
  console.log("Bot initialized.");
}

// ボットの作成
const bot = createBot({
  token: BotToken,
  botId: getBotIdFromToken(BotToken) as bigint,

  // イベント発火時に実行する関数など
  events: {
    // 起動時
    ready: (_bot, payload) => {
      console.log(`${payload.user.username} is ready!`);
    },

    // メッセージ受信時
    messageCreate: async (message) => {
      if (message.content.startsWith("a!rank")) {
        const args = message.content.split(" ");
        const command = args[0].substring(4).toLowerCase(); // "rank" コマンド取得
        await runRankCommand(command, message, args.slice(1));
      }
    },
  },
});

await initialize(); // データベース初期化

await startBot(bot);
Deno.cron("Continuous Request", "*/2 * * * *", () => {
  console.log("running...");
});
