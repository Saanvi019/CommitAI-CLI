import fs from "fs";
import path from "path";
import os from "os";

const CONFIG_PATH = path.join(os.homedir(), ".commitai.config");

export function loadConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    return {};
  }
  const content = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(content);
}

export function saveConfig(data) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
  console.log("✅ Config saved to", CONFIG_PATH);
}
