import type { JSX } from "react";

/**
 * Tokenises a pretty-printed JSON string into coloured spans.
 */
export function JsonHighlight({ json }: { json: string }) {
  if (!json) return null;

  const tokens: JSX.Element[] = [];
  let i = 0;

  // Regex that matches JSON tokens in order
  const re =
    /("(?:[^"\\]|\\.)*")\s*(:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b)|(\bnull\b)|([{}[\],])/g;

  let match: RegExpExecArray | null;
  let last = 0;

  while ((match = re.exec(json)) !== null) {
    // Whitespace / newlines between tokens
    if (match.index > last) {
      tokens.push(
        <span key={`ws-${i++}`}>{json.slice(last, match.index)}</span>,
      );
    }
    last = match.index + match[0].length;

    if (match[1] !== undefined) {
      // It's a string — could be a key or a value
      if (match[2] !== undefined) {
        // key: colon follows
        tokens.push(
          <span key={`k-${i++}`} className="text-purple-400">
            {match[1]}
          </span>,
        );
        tokens.push(
          <span key={`c-${i++}`} className="text-gray-400">
            {match[2]}
          </span>,
        );
      } else {
        tokens.push(
          <span key={`s-${i++}`} className="text-green-400">
            {match[1]}
          </span>,
        );
      }
    } else if (match[3] !== undefined) {
      tokens.push(
        <span key={`n-${i++}`} className="text-amber-400">
          {match[3]}
        </span>,
      );
    } else if (match[4] !== undefined) {
      tokens.push(
        <span key={`b-${i++}`} className="text-sky-400">
          {match[4]}
        </span>,
      );
    } else if (match[5] !== undefined) {
      tokens.push(
        <span key={`nl-${i++}`} className="text-red-400">
          {match[5]}
        </span>,
      );
    } else if (match[6] !== undefined) {
      tokens.push(
        <span key={`p-${i++}`} className="text-gray-500">
          {match[6]}
        </span>,
      );
    }
  }

  // Trailing whitespace
  if (last < json.length) {
    tokens.push(<span key={`ws-${i++}`}>{json.slice(last)}</span>);
  }

  return <>{tokens}</>;
}
