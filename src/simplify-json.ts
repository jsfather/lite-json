/**
 * Recursively simplifies a JSON value by trimming arrays to their first element.
 * - Arrays keep only the first item (which is itself simplified recursively).
 * - Objects have each value simplified recursively.
 * - Primitives are returned as-is.
 */
export function simplifyJson(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.length === 0) return [];
    return [simplifyJson(value[0])];
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
