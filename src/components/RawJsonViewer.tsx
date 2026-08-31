"use client";

import React, { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, FileCode } from "lucide-react";

interface RawJsonViewerProps {
  data: unknown;
  title?: string;
  defaultExpanded?: boolean;
}

export const RawJsonViewer: React.FC<RawJsonViewerProps> = ({
  data,
  title = "Raw JSON Response",
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-discord-darkest shadow-xl">
      <div className="flex items-center justify-between px-4 py-3 bg-discord-darker border-b border-white/10 select-none">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-200 hover:text-white transition-colors"
        >
          <FileCode className="w-4 h-4 text-discord-blurple" />
          <span>{title}</span>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-discord-light hover:bg-discord-lighter text-gray-200 hover:text-white rounded-md border border-white/10 transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">コピー完了</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>JSONをコピー</span>
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs text-gray-300 leading-relaxed scrollbar-thin">
          <pre className="text-emerald-400 whitespace-pre">{jsonString}</pre>
        </div>
      )}
    </div>
  );
};
