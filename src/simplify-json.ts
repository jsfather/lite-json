/**
 * Counts the depth of nesting in a value.
 * Non-empty objects/arrays add 1 + the max depth of their children.
 * Empty arrays/objects return 0 — they carry no inner structure.
 * Primitives have depth 0.
 */
function nestingDepth(value: unknown): number {
  if (Array.isArray(value)) {
    if (value.length === 0) return 0;
    return 1 + Math.max(...value.map(nestingDepth));
  }
  if (value !== null && typeof value === "object") {
    const vals = Object.values(value as Record<string, unknown>);
    if (vals.length === 0) return 0;
    return 1 + Math.max(...vals.map(nestingDepth));
  }
  return 0;
}

/**
 * Recursively simplifies a JSON value by trimming arrays to one element.
 *
 * Selection strategy:
 *  1. Prefer elements with the deepest nesting (most structural info).
 *  2. Among equal depth, pick the smallest by serialized size.
 *
 * This keeps the richest schema shape while minimising token count.
 */
export function simplifyJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];

    let best = value[0];
    let bestDepth = nestingDepth(value[0]);
    let bestSize = JSON.stringify(value[0]).length;

    for (let i = 1; i < value.length; i++) {
      const depth = nestingDepth(value[i]);
      const size = JSON.stringify(value[i]).length;

      if (depth > bestDepth || (depth === bestDepth && size < bestSize)) {
        best = value[i];
        bestDepth = depth;
        bestSize = size;
      }
    }

    return [simplifyJson(best)];
  }

  if (value !== null && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      result[key] = simplifyJson(val);
    }
    return result;
  }

  return value;
}
