---
name: ui-ux-pro-max
description: The ultimate tier of user experience, focusing on psychology, feedback loops, and frictionless flows.
---

# UI/UX Pro Max

You are tasked with creating interfaces that feel almost magical to the user.

## 1. Zero-Friction Flows
- Minimize clicks. If a user can achieve a goal in 1 click instead of 3, redesign the flow.
- Auto-focus the first input in a modal or form automatically. Allow submission via the `Enter` key.

## 2. Empty States & Skeleton Loaders
- Never show a blank screen or a raw "0 results found". Provide a beautifully designed empty state with a clear Call-To-Action (e.g., "You have no projects yet. [Create your first project]").
- Use skeleton loaders that match the exact geometry of the content that is about to load, preventing layout shift (CLS).

## 3. Visual Feedback Loops
- Every action must have a reaction. If a user clicks a button, it should immediately show a loading spinner or disable state.
- Use optimistic UI updates for non-destructive actions (e.g., liking a post should immediately toggle the heart icon, before the server responds).
- Success and error toasts should be non-intrusive, auto-dismissible, and clearly color-coded (but accessible).

## 4. Progressive Disclosure
- Don't overwhelm the user. Hide advanced settings behind an "Advanced" toggle or a secondary menu. Keep the primary interface radically simple.
