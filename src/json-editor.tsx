import { useRef, useCallback, type ReactNode, type ChangeEvent, type KeyboardEvent } from "react";
import { JsonHighlight } from "./json-highlight";

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  children?: ReactNode;
}

/**
 * A code-editor-style input: transparent <textarea> layered over a
 * syntax-highlighted <pre>.  Both scroll in sync.
 */
export function JsonEditor({ value, onChange, className = "", children }: JsonEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  /** Keep the highlight layer scrolled in sync with the textarea */
  const handleScroll = useCallback(() => {
    const ta = textareaRef.current;
    const pre = preRef.current;
    if (ta && pre) {
      pre.scrollTop = ta.scrollTop;
      pre.scrollLeft = ta.scrollLeft;
    }
  }, []);

  /** Handle tab key to insert 2 spaces instead of moving focus */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const newValue = value.slice(0, start) + "  " + value.slice(end);
        onChange(newValue);
        // restore cursor after React re-render
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange],
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    [onChange],
  );

  return (
    <div className={`json-editor-wrap ${className}`}>
      {/* Highlighted layer (behind) */}
      <pre
        ref={preRef}
        className="json-editor-highlight"
        aria-hidden
      >
        <JsonHighlight json={value} />
        {/* Extra newline so the <pre> height matches the textarea exactly */}
        {"\n"}
      </pre>

      {/* Editable layer (in front, transparent text) */}
      <textarea
        ref={textareaRef}
        className="json-editor-textarea"
        value={value}
        onChange={handleChange}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />

      {/* Overlay elements (error banners, buttons) */}
      {children}
    </div>
  );
}
