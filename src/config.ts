import { config as dotenvConfig } from "dotenv";
dotenvConfig();

export const MIRAI_HOST = process.env.MIRAI_WS_HOST;
export const MIRAI_PORT = process.env.MIRAI_WS_PORT;
export const MIRAI_AUTH = process.env.MIRAI_WS_AUTH;
export const SERVANT_QQ = process.env.SERVANT_QQ;

export enum SyncID {
  ABOUT = 1
}
