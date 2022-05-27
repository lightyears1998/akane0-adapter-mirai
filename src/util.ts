import fs from "fs";
import path from "path";

import { generate as randomString } from "randomstring";
import type { PackageJson } from "type-fest";

export function getPackageJsonVersion(): string {
  const packageFilePath = path.resolve(__dirname, "../package.json");
  const packageFile = fs.readFileSync(packageFilePath, { encoding: "utf-8" });
  const packageJSON: PackageJson = JSON.parse(packageFile);
  return packageJSON.version as string;
}

export function randomSyncId(syncId: string) {
  return syncId + "_" + randomString({
    length: 4, readable: true, charset: "alphanumeric", capitalization: "lowercase"
  });
}
