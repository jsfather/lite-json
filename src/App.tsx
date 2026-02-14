import { useState } from "react";
import { simplifyJson } from "./simplify-json";
import { JsonHighlight } from "./json-highlight";

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

  const handleSimplify = () => {
    try {
      const parsed = JSON.parse(input);
      const simplified = simplifyJson(parsed);
      const result = JSON.stringify(simplified, null, 2);
      setOutput(result);
      setStats({ before: input.length, after: result.length });
      setError("");
    } catch {
      setError("Invalid JSON — please fix and try again.");
      setOutput("");
      setStats(null);
    }
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
          <textarea
            className="flex-1 min-h-0 rounded-lg bg-gray-900 border border-gray-800 p-4 font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-1.5 min-h-0">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Output
          </label>
          <pre className="flex-1 min-h-0 rounded-lg bg-gray-900 border border-gray-800 p-4 font-mono text-sm leading-relaxed overflow-auto whitespace-pre-wrap">
            <JsonHighlight json={output} />
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
