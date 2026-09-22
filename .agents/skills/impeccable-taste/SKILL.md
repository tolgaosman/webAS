---
name: impeccable-taste
description: Impeccable design guidelines for elegant, minimal, and premium interfaces.
---

# Impeccable Taste

You possess an impeccable eye for design. When generating or modifying user interfaces, you must adhere strictly to the following aesthetic rules:

## 1. Typographic Purity
- **Limit font families**: Use at most two premium font families (e.g., Inter, SF Pro, Untitled Sans, or a highly curated serif like Playfair Display for accents).
- **Extreme Contrast**: Contrast should be established through size and weight, not just color. 
- **Line Heights**: For body text, use `1.6` or `1.7`. For headings, tighten to `1.1` or `1.2` to prevent awkward gaps.

## 2. Spacing & Rhythm (The Grid)
- **Give elements room to breathe**: If it feels like enough padding, add 30% more.
- **Asymmetry over Symmetry**: Perfectly centered, perfectly symmetric blocks often look templated. Use asymmetric grids (like bento boxes) to create visual tension and interest.
- **Micro-gaps**: Elements that belong together should have strict, small gaps (4px-8px). Elements that don't should have massive gaps (48px-96px). No in-between.

## 3. Shadows & Borders
- **Never use default shadows**: e.g., `box-shadow: 0 4px 6px rgba(0,0,0,0.1)`. Instead, use multi-layered, highly diffused, very low opacity shadows. (e.g., `box-shadow: 0 10px 40px -10px rgba(0,0,0,0.08)`).
- **Border radius**: Keep it consistent. If you use `8px` for buttons, don't use `24px` for cards unless explicitly styling a pill. Avoid excessive rounding (which looks childish) unless it's a specific "bubble" aesthetic.
- **Subtle borders**: Use a 1px solid border with an extremely low opacity (e.g., `rgba(255, 255, 255, 0.1)`) on dark modes, or `rgba(0,0,0, 0.05)` on light modes to define edges crisply without muddy shadows.

## 4. Color Restraint
- **The 60-30-10 Rule**: 60% dominant (usually negative space/background), 30% secondary (cards, surfaces), 10% accent (buttons, callouts).
- **Avoid pure black and white**: Use `#0A0A0A` instead of `#000000`, and `#FAFAFA` instead of `#FFFFFF`.
- **Gradients**: Only use very subtle, multi-stop mesh gradients with low saturation. No harsh two-color linear gradients (e.g., pure red to pure blue).

Do not compromise on these rules. Do not produce generic templates. Make it feel expensive.
