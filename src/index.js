#!/usr/bin/env node
import { execSync } from "child_process";

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "commit":
    import("./commands/commit.js").then((m) => m.default());
    break;
  case "config":
    import("./commands/config.js").then((m) => m.default());
    break;
  default:
    console.log(`
CommitAI CLI
Usage:
  commitai commit   Generate AI commit messages
  commitai config   Manage local config
`);
}
