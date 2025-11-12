export async function generateCommitMessages(diff) {
  // mock logic (for now)
  const suggestions = [
    "feat: add new feature for user profile",
    "fix: resolve bug in login handler",
    "chore: update dependencies"
  ];

  return suggestions.map((msg, i) => ({ id: i + 1, message: msg }));
}
