import { createBot, getBotIdFromToken, startBot } from "@discordeno/mod.ts";
import { runRankCommand } from "./handlers/rankHandler.ts";
import { issueWarning, removeWarning, listWarnings } from "./handlers/warningHandler.ts"; // 追加
import { temporaryBan } from "./handlers/banHandler.ts"; // 追加
import { temporaryMute } from "./handlers/muteHandler.ts"; // 追加

import "$std/dotenv/load.ts";

// Botのトークンを.envから取得
const BotToken: string = Deno.env.get("BOT_TOKEN")!;

// ボットの作成
const bot = createBot({
  token: BotToken,
  botId: getBotIdFromToken(BotToken) as bigint,

  events: {
    // 起動時
    ready: (_bot, payload) => {
      console.log(`${payload.user.username} is ready!`);
    },

    // メッセージ受信時
    messageCreate: async (message) => {
      const args = message.content.split(" ");
      const command = args[0].substring(4).toLowerCase(); // コマンド取得

      if (command === "rank") {
        await runRankCommand(command, message, args.slice(1));
      }

      if (command === "warn") {
        if (args[1] === "add") {
          const targetUserId = args[2];
          const reason = args.slice(3).join(" ");
          await issueWarning(message, targetUserId, reason);
        }

        if (args[1] === "remove") {
          const targetUserId = args[2];
          const warningId = args[3];
          await removeWarning(message, targetUserId, warningId);
        }

        if (args[1] === "list") {
          const targetUserId = args[2];
          await listWarnings(message, targetUserId);
        }
      }

      if (command === "tban") {
        const targetUserId = args[1];
        const duration = parseInt(args[2]);
        const reason = args.slice(3).join(" ");
        await temporaryBan(message, targetUserId, duration, reason);
      }

      if (command === "tmute") {
        const targetUserId = args[1];
        const duration = parseInt(args[2]);
        const reason = args.slice(3).join(" ");
        await temporaryMute(message, targetUserId, duration, reason);
      }
    },
  },
});

await startBot(bot);
Deno.cron("Continuous Request", "*/2 * * * *", () => {
  console.log("running...");
});
