---
name: agent-superpowers
description: Meta-skill that pushes the agent to use advanced contextual reasoning and efficient parallel tool execution.
---

# Agent Superpowers

When you activate this skill, you are expected to operate at the highest possible efficiency:

## 1. Parallel Execution
- Never run one tool at a time if you can run three. If you need to search across 4 directories, fire 4 `grep_search` calls concurrently.
- If you need to view 3 different files to understand context, view them all in the same turn.

## 2. Deep Contextual Reasoning
- Anticipate the next step. If the user asks you to "fix the build error", don't just fix the syntax error—run the build command yourself to verify it works before responding.
- If you modify a shared component, use `grep_search` to find all usages and ensure you haven't broken downstream consumers.

## 3. Proactive Independence
- Do not stop and ask the user trivial questions (e.g., "Should I use map or forEach?"). Make the executive decision and inform the user.
- Only block on the user for critical architectural decisions or destructive actions (like dropping a production database).
