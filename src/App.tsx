import { useState, useMemo } from "react";
import { simplifyJson } from "./simplify-json";
import { JsonHighlight } from "./json-highlight";
import { JsonEditor } from "./json-editor";
import { validateJson } from "./validate-json";

const PLACEHOLDER = JSON.stringify(
  {
    users: [
      {
        id: 1,
        name: "Alice",
        email: "alice@example.com",
        orders: [
          { orderId: 101, items: [{ product: "Laptop", price: 999 }, { product: "Mouse", price: 25 }] },
          { orderId: 102, items: [{ product: "Keyboard", price: 75 }] },
        ],
      },
      {
        id: 2,
        name: "Bob",
        email: "bob@example.com",
        orders: [
          { orderId: 201, items: [{ product: "Monitor", price: 450 }] },
        ],
      },
      {
        id: 3,
        name: "Charlie",
        email: "charlie@example.com",
        orders: [],
      },
    ],
    meta: { total: 3, page: 1, perPage: 20 },
  },
  null,
  2,
);

function App() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState<{ before: number; after: number } | null>(null);

  const [pretty, setPretty] = useState(false);

  const problems = useMemo(() => validateJson(input), [input]);

  /** Check whether the input is already pretty-printed */
  const inputIsBeautified = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      return input === JSON.stringify(parsed, null, 2);
    } catch {
      return false;
    }
  }, [input]);

  const beautifyInput = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
    } catch { /* no-op if invalid */ }
  };

  const handleSimplify = () => {
    try {
      const parsed = JSON.parse(input);
      const simplified = simplifyJson(parsed);
      const result = JSON.stringify(simplified);
      setOutput(result);
      setStats({ before: input.length, after: result.length });
      setPretty(false);
      setError("");
    } catch {
      setError("Invalid JSON — please fix and try again.");
      setOutput("");
      setStats(null);
    }
  };

  const toggleFormat = () => {
    try {
      const parsed = JSON.parse(output);
      const next = !pretty;
      const formatted = next
        ? JSON.stringify(parsed, null, 2)
        : JSON.stringify(parsed);
      setOutput(formatted);
      setStats((prev) => (prev ? { ...prev, after: formatted.length } : null));
      setPretty(next);
    } catch { /* no-op */ }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="h-screen bg-gray-950 text-gray-100 flex flex-col p-4 gap-3">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lite JSON</h1>
          <p className="text-gray-500 text-xs max-w-md">
            Shrink large JSON payloads before feeding them to an LLM — smaller context, sharper answers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <p className="text-red-400 text-sm font-medium">{error}</p>
          )}

          {stats && (
            <p className="text-gray-400 text-sm">
              <span className="text-gray-100 font-medium">{stats.before.toLocaleString()}</span>
              {" → "}
              <span className="text-gray-100 font-medium">{stats.after.toLocaleString()}</span>
              {" chars · "}
              <span className="text-green-400 font-medium">
                {((1 - stats.after / stats.before) * 100).toFixed(2)}% reduced
              </span>
            </p>
          )}

          <button
            onClick={handleSimplify}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors cursor-pointer"
          >
            Simplify
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className={`px-4 py-1.5 rounded-lg text-white text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
              copied
                ? "bg-green-600 hover:bg-green-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Panels */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Input */}
        <div className="flex flex-col gap-1.5 min-h-0">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Input
          </label>
          <JsonEditor
            className="flex-1 min-h-0 rounded-lg bg-gray-900 border border-gray-800 focus-within:ring-2 focus-within:ring-blue-500"
            value={input}
            onChange={setInput}
          >
            {/* Fixed error banner inside the editor */}
            {problems.length > 0 && (
              <div className="json-editor-banner">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0 mt-px">
                  <path fillRule="evenodd" d="M6.701 2.25c.577-1 2.02-1 2.598 0l5.318 9.2c.577 1-.144 2.25-1.299 2.25H2.682c-1.155 0-1.876-1.25-1.3-2.25l5.319-9.2ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                <div className="space-y-0.5">
                  {problems.map((p, i) => (
                    <p key={i} className="text-xs font-mono">
                      <span className="font-semibold">Ln {p.line}, Col {p.column}:</span>{" "}
                      {p.message}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Beautify button (hidden when already pretty) */}
            {!inputIsBeautified && problems.length === 0 && (
              <button
                onClick={beautifyInput}
                className="absolute bottom-3 right-3 z-10 px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Beautify
              </button>
            )}
          </JsonEditor>
        </div>

        {/* Output */}
        <div className="flex flex-col gap-1.5 min-h-0 relative">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Output
          </label>
          <pre className="flex-1 min-h-0 rounded-lg bg-gray-900 border border-gray-800 p-4 pb-12 font-mono text-sm leading-relaxed overflow-auto whitespace-pre-wrap">
            <JsonHighlight json={output} />
          </pre>
          {output && (
            <button
              onClick={toggleFormat}
              className="absolute bottom-3 right-3 px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium transition-colors cursor-pointer"
            >
              {pretty ? "Minify" : "Beautify"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
