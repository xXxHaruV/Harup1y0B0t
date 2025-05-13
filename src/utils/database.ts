// database.ts
import { Database } from "sqlite";
import { open } from "sqlite";
import { RankDatabase } from "../database/rankDatabase.ts";

// データベースの接続を管理する
export let db: Database;

export async function initializeDatabase() {
  // SQLiteデータベースに接続（ファイル名は適宜変更してください）
  db = await open({ filename: "./data/rank.db", driver: Database });
  console.log("Database connected.");

  // RankDatabaseインスタンスを作成
  return new RankDatabase(db);
}
