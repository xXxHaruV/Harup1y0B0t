import { createBot, getBotIdFromToken, startBot } from "@discordeno/mod.ts";
import "$std/dotenv/load.ts";

// イベントハンドラのインポート（ここが追加部分）
import { handleMessageCreate } from "./src/events/messageCreate.ts";

// Botのトークンを.envから取得
const BotToken: string = Deno.env.get("BOT_TOKEN")!;

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
    messageCreate: handleMessageCreate,
  }
});

// Botの起動
await startBot(bot);

// 2分おきのログ出力
Deno.cron("Continuous Request", "*/2 * * * *", () => {
  console.log("running...");
});
