import debug from "debug";
import { WebSocket } from "ws";

import {
  MIRAI_AUTH,
  MIRAI_HOST, MIRAI_PORT, SERVANT_QQ, SyncID
} from "./config";

const log = debug("adapter");

const uri = `ws://${MIRAI_HOST}:${MIRAI_PORT}/all`;
log("using uri:", uri);

const mirai = new WebSocket(uri, {
  headers: {
    "verifyKey": MIRAI_AUTH,
    "qq": SERVANT_QQ
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
      const { type } = payload;
      switch (type) {
        case "FriendMessage": {
          const { messageChain, sender } = payload;
          if (messageChain.length > 1) {
            const message = messageChain[1];
            if (message.type === "Plain") {
              if (message.text.indexOf("自我介绍") !== -1) {
                mirai.send(JSON.stringify({
                  "syncId": 666,
                  "command": "sendFriendMessage",
                  "content": {
                    "target": sender.id,
                    "messageChain": [{ "type": "Plain", "text": "New Game!" }]
                  }
                }));
              }
            }
          }
          break;
        }
        default: {
          console.log(payload);
        }
      }
    }
  }
});
