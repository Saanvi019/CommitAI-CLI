#!/usr/bin/env node
import { Command } from "commander";
import { runCommitCommand } from "../src/commands/commit.js";

const program = new Command();

program
  .name("commitai")
  .description("AI-powered commit message generator")
  .version("1.0.0");

program
  .command("commit")
  .description("Generate AI commit messages")
  .option("--dry-run", "Preview messages without committing")
  .action(runCommitCommand);

program.parse(process.argv);