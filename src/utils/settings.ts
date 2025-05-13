// settings.ts
const filePath = "./src/data/guildSettings.json";

// 設定の型
interface GuildSettings {
  [guildId: string]: {
    prefix?: string;
    slashCommandsEnabled?: boolean;
    logChannelId?: string;
    muteRoleId?: string;
    modRoleId?: string;
  };
}

// 初期ロード
let guildSettings: GuildSettings = {};
try {
  const raw = await Deno.readTextFile(filePath);
  guildSettings = JSON.parse(raw);
} catch {
  console.log("guildSettings.json not found. Creating a new one.");
  await Deno.writeTextFile(filePath, JSON.stringify({}));
}

// 保存関数
async function saveSettings() {
  await Deno.writeTextFile(filePath, JSON.stringify(guildSettings, null, 2));
}

export { guildSettings, saveSettings };
