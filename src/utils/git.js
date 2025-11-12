import { execSync } from "child_process";

export function getStagedDiff() {
  try {
    const diff = execSync("git diff --cached", { encoding: "utf-8" });
    if (!diff.trim()) throw new Error("No staged changes found.");
    return diff;
  } catch (err) {
    console.error("❌ Error getting diff:", err.message);
    process.exit(1);
  }
}

export function makeCommit(message) {
  try {
    execSync(`git commit -m "${message}"`, { stdio: "inherit" });
  } catch (err) {
    console.error("❌ Commit failed:", err.message);
  }
}
