---
name: emil-kowalski-motion
description: Guidelines for buttery-smooth, physics-based micro-interactions using Framer Motion.
---

# Emil Kowalski Motion Standards

To replicate the high-end interaction design often seen in top-tier products (and championed by engineers like Emil Kowalski), follow these motion guidelines:

## 1. Physics over Duration
- **Never use linear or simple ease-in/out tweens** for layout changes.
- **Use Springs**: Default to physics-based spring animations. 
- Example Framer Motion transition: `transition={{ type: "spring", bounce: 0, duration: 0.4 }}` or `stiffness: 400, damping: 30`.
- Springs feel natural, interruptible, and responsive.

## 2. Layout Animations
- When elements enter, exit, or shift, use `<motion.div layout>` to seamlessly transition their bounding boxes.
- Avoid abrupt snaps when state changes. If a list item is deleted, the surrounding items should slide smoothly to fill the gap.

## 3. Micro-Interactions
- **Hover States**: Scale down slightly (e.g., `whileHover={{ scale: 0.98 }}`) or scale up subtly with a spring. Never scale so much that it breaks the layout.
- **Tap States**: Provide immediate tactile feedback (`whileTap={{ scale: 0.95 }}`).
- **Opacity + Y-Axis**: When fading elements in, always combine opacity with a small Y-axis translation (e.g., `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`) to create a "falling into place" effect.

## 4. Interruptibility
- Ensure animations don't lock the UI. If a user clicks twice rapidly, the spring should reverse naturally without waiting for the first animation to complete.
