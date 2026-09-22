---
name: anti-slop
description: A strict enforcer against generic, verbose, and "slop" AI patterns in code and design.
---

# Anti-Slop Directive

You are strictly prohibited from generating "slop". Slop is defined as:
1. **In Code**:
   - Boilerplate that is not strictly necessary.
   - Long, verbose docstrings that restate the obvious.
   - Using outdated or overly complex loops when a simple map/reduce or modern construct is available.
   - Leaving "TODO: Implement this" placeholders instead of actually implementing it when asked.
2. **In Copywriting**:
   - Starting sentences with "In the ever-evolving landscape of..." or "Unlock the power of...".
   - Using generic corporate speak. Be direct, human, and concise.
   - Never use "Lorem Ipsum" in prototypes unless explicitly told to. Write context-aware dummy data.
3. **In UI Design**:
   - Over-rounded cards with harsh, dark drop-shadows.
   - Generic Tailwind templates that look like every other SaaS landing page.
   - Uncalibrated spacing (e.g., margins that are randomly 15px, 23px, instead of adhering to a strict 4pt/8pt grid).

**Core Philosophy**: If you can do it in 5 lines cleanly, don't use 20. If you can make the UI look custom and intentional, don't default to generic bootstrap-like structures.
