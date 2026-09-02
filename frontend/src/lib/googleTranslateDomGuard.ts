/**
 * Google Translate wraps translated text nodes in <font> elements
 * directly in the live DOM. When React later unmounts or reorders that
 * same subtree (closing a modal, a scroll-reveal class toggle, any
 * conditional render), it calls removeChild/insertBefore on a node
 * Google has already moved or removed out from under it — the browser
 * throws `NotFoundError: Failed to execute 'removeChild' on 'Node'`,
 * which crashes the whole React tree.
 *
 * This is the standard, widely-used patch for the problem (React issue
 * #11538): make removeChild/insertBefore a no-op instead of throwing
 * when the node isn't actually where React thinks it is, since in that
 * case the DOM already reflects what React wanted anyway. Only used on
 * the public site (see entries/public/main.tsx) — the admin panel never
 * loads the translate widget, so it doesn't need this.
 */
export function installGoogleTranslateDomGuard(): void {
  if (typeof Node === "undefined" || !Node.prototype) return;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      if (import.meta.env.DEV) {
        console.warn("[googleTranslateDomGuard] skipped removeChild: node is not a child of this parent", child, this);
      }
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(this: Node, newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (import.meta.env.DEV) {
        console.warn("[googleTranslateDomGuard] skipped insertBefore: reference node is not a child of this parent", referenceNode, this);
      }
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}
