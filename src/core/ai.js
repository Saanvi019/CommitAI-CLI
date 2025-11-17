
import fetch from "node-fetch";
import { getChangedFiles } from "./git.js";
import { readConfig } from "./config.js";

  const API_BASE= process.env.API_BASE || "http://localhost:4000";

export async function generateCommitMessages(diff) {
  // 1. Load token
  const { token } = readConfig();

  if (!token) {
    console.error(" No token found. Please login first:");
    console.error("   commitai login");
    return [{ id: 1, message: "chore: please login first" }];
  }

  // 2. Gather changed files (optional but good)
  const files = getChangedFiles();
  const filesList = files.length ? files.join(", ") : "unknown files";

  try {
    const res = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`    
      },
      body: JSON.stringify({
        diff,
        filesList
      })
    });

    const data = await res.json();

    if (!data.success) {
      console.error("❌ Backend error:", data.error);
      return [{ id: 1, message: "chore: fallback commit message" }];
    }
if (res.status === 429) {
  console.log(chalk.red(`❌ ${data.error}`));
  return null;
}
    return data.suggestions.map((s, i) => ({
      id: i + 1,
      message: s.message
    }));

  } catch (err) {
    console.error("❌ Cannot reach CommitAI backend:", err.message);
    return [{ id: 1, message: "chore: fallback commit message" }];
  }
}