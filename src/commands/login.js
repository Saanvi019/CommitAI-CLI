import open from "open";
import { writeConfig } from "../core/config.js";
import { waitForToken } from "../core/localCallbackServer.js";

const API_BASE = process.env.API_BASE  || "https://commitai-backend.onrender.com";

export default async function loginCommand() {
  console.log("🔑 Opening GitHub login...");

  const callbackURL = "http://localhost:9900/callback";
  const loginURL = `${API_BASE}/api/auth/github?callback=${encodeURIComponent(callbackURL)}`;

  await open(loginURL);

  const token = await waitForToken();

  writeConfig({ token });

  console.log("✅ Login successful!");
}
