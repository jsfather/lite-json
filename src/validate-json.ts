export interface JsonProblem {
  message: string;
  line: number;
  column: number;
}

/**
 * Validate a JSON string and return a list of problems.
 * Uses the native JSON.parse error message and extracts position info.
 */
export function validateJson(text: string): JsonProblem[] {
  if (!text.trim()) return [];

  try {
    JSON.parse(text);
    return [];
  } catch (err) {
    const msg = err instanceof SyntaxError ? err.message : String(err);

    // Try to extract position from the error message.
    // Most engines report "at position N" or "at line N column N".
    const posMatch = msg.match(/position\s+(\d+)/i);
    const lineColMatch = msg.match(/line\s+(\d+)\s+column\s+(\d+)/i);

    let line = 1;
    let column = 1;

    if (lineColMatch) {
      line = parseInt(lineColMatch[1], 10);
      column = parseInt(lineColMatch[2], 10);
    } else if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      // Convert absolute position to line/column
      let count = 0;
      const lines = text.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (count + lines[i].length + 1 > pos) {
          line = i + 1;
          column = pos - count + 1;
          break;
        }
        count += lines[i].length + 1; // +1 for \n
      }
    }

    // Clean up the message for display
    const cleanMsg = msg
      .replace(/^JSON\.parse:\s*/i, "")
      .replace(/\s+at position \d+.*$/i, "")
      .replace(/\s+at line \d+ column \d+.*$/i, "");

    return [{ message: cleanMsg, line, column }];
  }
}
