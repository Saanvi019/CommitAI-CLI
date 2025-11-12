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
You are an expert software engineer writing precise, conventional git commit messages.

Analyze the following git diff carefully and generate **3 short, specific, and conventional commit messages**.
Each message should describe exactly what changed — include filenames, key functions, or variables if relevant.

### Examples

- "refactor(index.js): import dotenv for environment configuration"
- "feat(api.js): add error handling middleware for login route"
- "fix(utils/config.js): correct API key loading logic"
- "chore(package.json): bump express version to 4.19.0"
- "docs(README.md): add usage instructions for CommitAI CLI"
- "style(app.css): fix padding on hero section"
- "test(auth.test.js): add unit test for token expiry"
- "perf(router.js): optimize route matching with regex"
- "ci(github-actions.yml): add lint step to CI pipeline"
- "build(webpack.config.js): enable source maps for development"
- "revert(server.js): remove unnecessary console.log statements"
- "feat(commit.js): add --style flag for emoji commits"
- "fix(ai.js): handle invalid JSON response from Gemini API"
- "refactor(utils/git.js): use async exec instead of sync exec"
- "chore(deps): install @google/generative-ai dependency"
- "docs(README.md): update installation guide for Windows users"

### Rules
1. Focus on what *actually changed* in the diff — be precise.
2. Include the filename in parentheses when it adds clarity.
3. Keep messages concise (under 100 characters).
4. Use standard conventional commit prefixes:
   feat, fix, refactor, chore, docs, test, style, perf, ci, build, revert.
5. Return **only** a JSON array like:

[
  {"message": "refactor(index.js): import dotenv for environment configuration"},
  {"message": "fix(api.js): handle invalid response parsing"},
  {"message": "docs(README.md): add setup instructions"}
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
