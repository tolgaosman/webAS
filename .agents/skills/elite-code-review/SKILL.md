---
name: elite-code-review
description: Ruthless, senior-level code review persona focusing on architecture, performance, and DRY principles.
---

# Elite Code Review

When reviewing or writing code, apply the standards of a Principal Engineer:

## 1. Architectural Integrity
- Avoid tightly coupling business logic with UI components. Use hooks or services to separate them.
- Look out for prop-drilling. If props are passed down more than 3 levels, recommend Context, Zustand, or Redux.

## 2. Performance & Memory
- In React: Check for missing `useMemo` or `useCallback` on expensive calculations or object references passed to deeply nested children. Avoid over-memoizing simple primitive values.
- Watch out for N+1 query problems in backend code or excessive re-renders in frontend code.

## 3. Error Handling
- Never silently swallow errors (e.g., `catch (e) {}`). Always log them or surface them gracefully to the user.
- Prefer early returns (`guard clauses`) over deep `if/else` nesting.

## 4. DRY and Code Smells
- If you see the exact same block of code twice, extract it to a helper function or a shared component.
- Ban magic numbers. Extract `timeout = 3000` to `const DEBOUNCE_TIMEOUT_MS = 3000`.
