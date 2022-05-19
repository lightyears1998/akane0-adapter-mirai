import { MiraiMessage } from "./upstream";

export interface MiraiAboutMessage extends MiraiMessage {
  data: {
    version: string
  }
}
