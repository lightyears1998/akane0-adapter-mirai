import { config as dotenvConfig } from "dotenv";
import debug from "debug";
import { WebSocket } from "ws";

import { SyncID } from "./config";

const log = debug("adapter");

dotenvConfig();

const host = process.env.MIRAI_WS_HOST;
const port = process.env.MIRAI_WS_PORT;
const auth = process.env.MIRAI_WS_AUTH;
const servant = process.env.SERVANT_QQ;

const uri = `ws://${host}:${port}/all`;
log("using uri:", uri);

const mirai = new WebSocket(uri, {
  headers: {
    "verifyKey": auth,
    "qq": servant
  }
});

mirai.on("open", () => {
  const payload = {
    "syncId": SyncID.ABOUT, "command": "about", "subCommand": null
  };
  const message = JSON.stringify(payload);
  mirai.send(message);
});

mirai.on("message", messageBuffer => {
  const message = JSON.parse(messageBuffer.toString());
  message.syncId = Number(message.syncId);
  const { syncId, data: payload } = message;

  switch (syncId) {
    case 0: {
      console.log("Session established, id:", payload.session);
      break;
    }

    case SyncID.ABOUT: {
      console.log("mirai-http-api version:", payload.data.version);
      break;
    }

    default: {
      const { type } = payload.data;
      switch (type) {
        default: {
          console.log(type);
        }
      }
    }
  }
});
