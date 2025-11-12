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

// 🧠 NEW: Get a list of changed files (staged only)
export function getChangedFiles() {
  try {
    const files = execSync("git diff --cached --name-only", { encoding: "utf-8" })
      .split("\n")
      .filter(Boolean);
    return files;
  } catch (err) {
    console.error("❌ Error getting changed files:", err.message);
    return [];
  }
}
