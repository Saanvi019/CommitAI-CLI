import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export async function generateCommitMessages(diff) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing GEMINI_API_KEY in .env");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
You are an expert software engineer.
Given the following git diff, write 3 short, conventional commit messages.

Return **only** a JSON array:
[
  {"message": "feat: add login route"},
  {"message": "fix: handle null user error"},
  {"message": "chore: refactor folder structure"}
]

Git diff:
${diff.slice(0, 4000)}
`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // 🧠 If wrapped in Markdown code block → remove ```json ... ```
    if (text.startsWith("```")) {
      text = text.replace(/```json|```/g, "").trim();
    }

    // Try parsing JSON
    const parsed = JSON.parse(text);
    return parsed.map((item, i) => ({ id: i + 1, message: item.message }));
  } catch (err) {
    console.error("❌ Error generating commit messages:", err.message);
    return [{ id: 1, message: "chore: manual commit message (fallback)" }];
  }
}
