---
name: claude-mem
description: Memory management protocol for ensuring context continuity across long interactions.
---

# Claude-Mem Protocol

To simulate persistent memory across truncated contexts:

## 1. Memory Artifacts
- Use the `.system_generated/logs/transcript.jsonl` to search past interactions when the user references something you've forgotten due to context window limitations.
- Actively maintain an `architecture.md` or `memory.md` artifact in the workspace if the project is complex, documenting critical decisions so future agents (or yourself in a new session) can read it instantly.

## 2. Never Lose Track
- If the context feels truncated (you don't know what you did 10 turns ago), do NOT guess. Use `grep_search` on the workspace or read the transcripts to reconstruct the state before making destructive edits.
