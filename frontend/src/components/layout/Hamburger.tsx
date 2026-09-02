/**
 * Swaps between hamburger/X icon by rendering different children
 * instead of the legacy code's `element.innerHTML =` string swap.
 */
export function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button className="hamburger" id="hamburger" aria-label={open ? "Close Menu" : "Open Menu"} onClick={onClick}>
      {open ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      )}
    </button>
  );
}
