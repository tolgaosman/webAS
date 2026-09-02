/**
 * Both icons are always in the DOM — styles.css's `.theme-toggle .sun-icon`
 * / `[data-theme="dark"] .theme-toggle .moon-icon` rules (lines ~261-303)
 * handle the visibility swap purely in CSS via the `data-theme` attribute
 * on <html>, exactly how this component was designed to be driven even
 * though the legacy static HTML never actually rendered the button (see
 * useTheme.ts's docblock).
 */
export function ThemeToggle({ onClick }: { onClick: () => void }) {
  return (
    <button className="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode" onClick={onClick}>
      <svg className="moon-icon" viewBox="0 0 24 24">
        <path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 13.66 12.05 1 1 0 0 0-.02-1.41z" />
      </svg>
      <svg className="sun-icon" viewBox="0 0 24 24">
        <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-13a1 1 0 0 1-1-1V1a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zm0 18a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1zM4.22 5.64a1 1 0 0 1-1.42-1.42l1.42-1.41a1 1 0 1 1 1.41 1.41zm14.14 14.14a1 1 0 0 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 1.42zM3 13H1a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2zm20 0h-2a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2zM4.22 18.36l-1.42-1.41a1 1 0 1 1 1.42-1.42l1.41 1.42a1 1 0 0 1-1.41 1.41zM19.78 5.64l-1.42-1.42a1 1 0 1 1 1.42-1.41l1.41 1.41a1 1 0 0 1-1.41 1.42z" />
      </svg>
    </button>
  );
}
