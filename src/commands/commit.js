import chalk from "chalk";
import inquirer from "inquirer";
import { getStagedDiff, makeCommit } from "../utils/git.js";
import { generateCommitMessages } from "../utils/ai.js";

export async function runCommitCommand(options) {
  console.log(chalk.cyan("🚀 Generating AI-powered commit message..."));
  const diff = getStagedDiff();
  const suggestions = await generateCommitMessages(diff);

  console.log(chalk.yellow("\n💡 Commit Suggestions:\n"));
  suggestions.forEach((s) => {
    console.log(chalk.green(`${s.id}. ${s.message}`));
  });

  const { choice } = await inquirer.prompt([
    {
      type: "list",
      name: "choice",
      message: "Select your commit message:",
      choices: suggestions.map((s) => ({
        name: s.message,
        value: s.message
      }))
    }
  ]);

  if (!options.dryRun) {
    makeCommit(choice);
  } else {
    console.log(chalk.gray("\n🧪 Dry run mode — not committing.\n"));
  }
}
