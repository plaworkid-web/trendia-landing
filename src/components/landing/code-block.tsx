"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border bg-[#050505] text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-xs text-neutral-400">
        <span>{label}</span>
        <button type="button" onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 hover:bg-white/10" aria-live="polite">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-6 text-neutral-300"><code>{code}</code></pre>
    </div>
  );
}
