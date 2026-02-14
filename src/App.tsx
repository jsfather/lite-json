import { useState } from "react";
import { simplifyJson } from "./simplify-json";

const PLACEHOLDER = JSON.stringify(
  { data: [{ name: "keyvan", last: "matin" }, { name: "pezhman", last: "dswad" }] },
  null,
  2,
);

function App() {
  const [input, setInput] = useState(PLACEHOLDER);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleSimplify = () => {
    try {
      const parsed = JSON.parse(input);
      const simplified = simplifyJson(parsed);
      setOutput(JSON.stringify(simplified, null, 2));
      setError("");
    } catch {
      setError("Invalid JSON — please fix and try again.");
      setOutput("");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center p-6 gap-6">
      <h1 className="text-3xl font-bold tracking-tight">Lite JSON</h1>
      <p className="text-gray-400 text-sm max-w-lg text-center">
        Paste your JSON below and click <strong>Simplify</strong>. Every array
        will be trimmed to its first element, recursively.
      </p>

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Input
          </label>
          <textarea
            className="h-80 rounded-lg bg-gray-900 border border-gray-700 p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            Output
          </label>
          <textarea
            className="h-80 rounded-lg bg-gray-900 border border-gray-700 p-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={output}
            readOnly
          />
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-sm font-medium">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          onClick={handleSimplify}
          className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors cursor-pointer"
        >
          Simplify
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          Copy Output
        </button>
      </div>
    </div>
  );
}

export default App;
