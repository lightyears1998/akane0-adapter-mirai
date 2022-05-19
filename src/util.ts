import { generate as randomString } from "randomstring";

export function randomSyncId(syncId: string) {
  return syncId + "_" + randomString({
    length: 4, readable: true, charset: "alphanumeric", capitalization: "lowercase"
  });
}
