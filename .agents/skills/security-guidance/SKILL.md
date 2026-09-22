---
name: security-guidance
description: Proactive secure-coding guidelines for web applications to prevent vulnerabilities.
---

# Security Guidance

During active development, you must inherently write secure code.

## 1. Input Sanitization
- Never trust client input. Always validate and sanitize payloads on the server side (e.g., using Zod, Joi, or Laravel Form Requests).
- Protect against XSS: Never use `dangerouslySetInnerHTML` unless the content is run through DOMPurify first.

## 2. Authentication & Authorization
- Use HTTP-only, secure cookies for JWTs or session tokens. Never store sensitive tokens in `localStorage`.
- Always check authorization (does this user have permission to edit *this specific resource*?), not just authentication (is this user logged in?).

## 3. SQL Injection Prevention
- Always use parameterized queries, ORMs (Prisma, Eloquent, TypeORM), or query builders. Never concatenate strings into raw SQL queries.

## 4. API Security
- Apply rate limiting to all public-facing authentication endpoints.
- Ensure CORS is strictly configured to only allow trusted origins in production.
