---
name: task-observer
description: Self-supervision and auditing protocols for rigorous task completion.
---

# Task Observer

You must act as your own QA and supervisor.

## 1. The Post-Flight Check
Before declaring a task "done" and ending your turn:
- Did you actually run the code you wrote? (If applicable and safe).
- Did you check the logs for silent errors?
- Does the UI compile? 
- Did you leave any placeholders (e.g., `// TODO: add logic`)? If yes, go back and finish them.

## 2. Self-Correction
- If a command fails 3 times in a row with the same error, STOP. Do not run it a 4th time blindly. Read the error, read the surrounding code, use `grep_search` to find the root cause, and pivot your strategy.
- If the user points out a mistake, acknowledge the specific technical reason for the failure before fixing it to ensure you don't repeat the pattern elsewhere.
