import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getChangedFiles } from "./git.js"; // <-- make sure this exists in src/utils/git.js

dotenv.config();

export async function generateCommitMessages(diff) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing GEMINI_API_KEY in .env");
    process.exit(1);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // 🧩 Get list of changed files for more context
  const files = getChangedFiles();
  const filesList = files.length ? files.join(", ") : "unknown files";

  const prompt = `
You are an expert software engineer writing highly precise, conventional git commit messages.

Below is a list of changed files and their diff.
Use both to craft commit messages that clearly describe *what changed and where*.

Each message should:
- Include the filename or module name if relevant.
- Be short (under 100 characters).
- Use standard conventional commit prefixes.

---

### Examples

# --- Feature Commits (feat) ---
- "feat(auth.js): add JWT authentication middleware"
- "feat(api.js): introduce new GET /users endpoint"
- "feat(dashboard.jsx): implement user analytics chart"
- "feat(app.js): add dark mode toggle"
- "feat(config.js): support environment variables via dotenv"
- "feat(profile.js): add profile picture upload functionality"
- "feat(search.js): implement fuzzy search for product list"
- "feat(server.js): add compression middleware for performance"
- "feat(notification.js): add push notification support"
- "feat(routes/user.js): add password reset route"
- "feat(db/schema.sql): create users table with constraints"

# --- Fix Commits (fix) ---
- "fix(auth.js): handle expired token edge case"
- "fix(config.js): correct dotenv import path"
- "fix(api.js): prevent null pointer in login handler"
- "fix(server.js): resolve crash when port already in use"
- "fix(utils/logger.js): fix missing timestamp in logs"
- "fix(router.js): correct route order for 404 handling"
- "fix(package.json): correct dependency version mismatch"
- "fix(index.html): resolve broken favicon link"
- "fix(css/main.css): fix button alignment in mobile view"
- "fix(build.js): fix incorrect output path for bundle"

# --- Refactor Commits (refactor) ---
- "refactor(index.js): import dotenv for environment configuration"
- "refactor(api.js): extract middleware into separate module"
- "refactor(utils/config.js): simplify key loading logic"
- "refactor(helpers/date.js): replace moment with native Date"
- "refactor(app.js): split express routes into separate files"
- "refactor(models/user.js): migrate schema to TypeScript"
- "refactor(server.js): improve async/await readability"
- "refactor(git.js): use async exec instead of sync exec"
- "refactor(cli.js): streamline command registration logic"
- "refactor(db.js): replace callbacks with promises"

# --- Documentation Commits (docs) ---
- "docs(README.md): add setup instructions for new contributors"
- "docs(README.md): update installation steps for Windows"
- "docs(CHANGELOG.md): add 1.0.0 release notes"
- "docs(CONTRIBUTING.md): clarify pull request process"
- "docs(API.md): document new /auth/login endpoint"
- "docs(README.md): add usage examples for CLI commands"
- "docs(FAQ.md): add troubleshooting section for setup"
- "docs(env.md): explain environment variable configuration"
- "docs(index.html): update meta description for SEO"
- "docs(README.md): remove deprecated commands section"

# --- Style Commits (style) ---
- "style(app.css): fix padding in hero section"
- "style(index.html): format HTML structure properly"
- "style(utils.js): apply prettier formatting"
- "style(config.json): sort keys alphabetically"
- "style(components/Button.jsx): adjust border radius"
- "style(main.css): improve typography and spacing"
- "style(navbar.jsx): align logo and menu items"
- "style(theme.css): fix color contrast in dark mode"
- "style(index.js): remove extra semicolons"
- "style(.eslintrc): add rules for import sorting"

# --- Test Commits (test) ---
- "test(auth.test.js): add unit test for expired token"
- "test(api.test.js): cover user registration endpoint"
- "test(router.test.js): test 404 response"
- "test(config.test.js): ensure dotenv loads variables"
- "test(db.test.js): mock MongoDB connection"
- "test(app.test.js): verify API health check"
- "test(login.test.js): validate password reset flow"
- "test(helpers.test.js): test string utility functions"
- "test(cli.test.js): test commit message generation"
- "test(middleware.test.js): add error handler tests"

# --- Performance Commits (perf) ---
- "perf(router.js): optimize route matching with regex"
- "perf(app.js): cache user data for faster load"
- "perf(db.js): add index for user email lookup"
- "perf(api.js): reduce redundant database queries"
- "perf(utils.js): memoize expensive function results"

# --- Build Commits (build) ---
- "build(webpack.config.js): enable source maps for development"
- "build(package.json): bump dependencies to latest"
- "build(eslint): configure lint-staged pre-commit hook"
- "build(vite.config.js): optimize build for production"
- "build(ci.yml): add node 20 support in CI pipeline"

# --- CI Commits (ci) ---
- "ci(github-actions.yml): add lint step to CI pipeline"
- "ci(dockerfile): add health check endpoint"
- "ci(circleci.yml): split jobs into build and deploy"
- "ci(jenkinsfile): add test coverage threshold"
- "ci(github-actions): update cache key for node_modules"

# --- Chore Commits (chore) ---
- "chore(deps): install @google/generative-ai dependency"
- "chore(package.json): remove unused dependencies"
- "chore(config.js): rename env variable for clarity"
- "chore(repo): update .gitignore for node_modules"
- "chore(env): add sample .env.example file"
- "chore(scripts): create postinstall script for setup"
- "chore(logger.js): improve log formatting"
- "chore(readme): update badges and shields"
- "chore(lint): fix lint errors across project"
- "chore(format): run prettier across codebase"

# --- Revert Commits (revert) ---
- "revert(server.js): remove unnecessary console.log statements"
- "revert(package.json): undo dependency version bump"
- "revert(auth.js): rollback authentication middleware change"

---

### Rules
1. Use the format: type(file): concise summary of what changed.
2. Focus on what *actually changed* — be concrete.
3. Include filenames or functions where possible.
4. Keep messages under 100 characters.
5. Use conventional commit prefixes:
   feat, fix, refactor, docs, style, test, perf, build, ci, chore, revert.
6. Return **only** a JSON array like:

[
  {"message": "refactor(index.js): import dotenv for environment configuration"},
  {"message": "fix(config.js): handle missing API key error"},
  {"message": "docs(README.md): add setup instructions"}
]

---

### Changed Files
${filesList}

### Git Diff
${diff.slice(0, 4000)}
`;


  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();

    // 🧠 If wrapped in Markdown code block → remove ```json ... ```
    if (text.startsWith("```")) {
      text = text.replace(/```json|```/g, "").trim();
    }

    // Try parsing JSON output safely
    const parsed = JSON.parse(text);
    return parsed.map((item, i) => ({ id: i + 1, message: item.message }));
  } catch (err) {
    console.error("❌ Error generating commit messages:", err.message);
    return [{ id: 1, message: "chore: manual commit message (fallback)" }];
  }
}
