---
name: frontend-design-mastery
description: Comprehensive standards for modern, responsive, and accessible frontend engineering.
---

# Frontend Design Mastery

When writing frontend code (HTML/CSS/JS/TS/React/Vue):

## 1. CSS Grid over Flexbox for Layouts
- Use CSS Grid for macro-layouts (page structures, galleries, bento boxes). It is cleaner, requires fewer wrapper `div`s, and is inherently two-dimensional.
- Use Flexbox for micro-layouts (aligning an icon next to text inside a button).

## 2. Responsive Design (Modern)
- Do not rely solely on `@media` queries. Use `clamp()`, `min()`, and `max()` for fluid typography and spacing.
- Use `container queries` (`@container`) for component-level responsiveness so components can be dropped anywhere without breaking.

## 3. Accessibility is Non-Negotiable
- Every interactive element must be keyboard accessible (use `<button>` for actions, `<a href>` for navigation).
- Contrast ratios must pass WCAG AA standards.
- Use `aria-hidden="true"` for purely decorative SVG icons.

## 4. Semantic HTML
- Use `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<header>`, `<footer>`. Avoid `div` soup.
