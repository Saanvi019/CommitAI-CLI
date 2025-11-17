# 🚀 CommitAI CLI  
### AI-powered, conventional commit message generator for developers.

CommitAI automatically generates clean, meaningful, conventional commit messages by analyzing your staged Git changes.  
Stop wasting time thinking about commit messages — let AI handle it.

---

## 📦 Installation


npm install -g @commitai/cli
Requires Node.js 18+.

🔑 Login (via GitHub)
Before generating commits, authenticate using GitHub OAuth:


commitai login
This will:

open GitHub login in your browser

authenticate your GitHub account

return a secure token to your CLI

store it at:


~/.commitai.json
✨ Generate Commit Messages
1️⃣ Stage your files:

git add .

2️⃣ Generate commit messages:

commitai commit
You will see something like:

💡 Commit Suggestions:

1. fix(api): improve error msg when token is missing
2. fix(api): add descriptive error msg for missing token
3. fix(api): enhance error handling on auth token failure

✔ Select your commit message:
After selection, CommitAI automatically runs:

git commit -m "<your message>"

📚 CLI Commands
Command	Description
commitai login	       Login with GitHub
commitai commit	       Generate commit messages


🔒 Daily Usage Limit
All users get 30 AI commits per day.

No billing

No paid plans

Resets at midnight (IST)

Prevents API abuse

When the limit is hit:

⛔ Daily limit reached (30/30)
Try again tomorrow.