"use client";

import React, { useState } from "react";
import { Copy, Check, Info } from "lucide-react";

interface PropertyRowProps {
  label: string;
  jsonKey: string;
  type: string;
  value: unknown;
  description: string;
  customRenderer?: React.ReactNode;
}

export const PropertyRow: React.FC<PropertyRowProps> = ({
  label,
  jsonKey,
  type,
  value,
  description,
  customRenderer,
}) => {
  const [copied, setCopied] = useState(false);

  const displayValue = value === null ? "null" : value === undefined ? "undefined" : typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(displayValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTypeBadgeClass = (t: string) => {
    switch (t.toLowerCase()) {
      case "string":
        return "bg-green-950/60 text-green-300 border-green-800/40";
      case "number":
      case "integer":
        return "bg-blue-950/60 text-blue-300 border-blue-800/40";
      case "boolean":
        return "bg-purple-950/60 text-purple-300 border-purple-800/40";
      case "object":
      case "array":
        return "bg-amber-950/60 text-amber-300 border-amber-800/40";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  return (
    <div className="py-3 px-4 rounded-lg bg-discord-light/50 hover:bg-discord-light transition-colors border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* 属性名・キー・説明 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white text-sm">{label}</span>
          <code className="text-xs bg-discord-darkest/60 px-2 py-0.5 rounded text-discord-blurple font-mono">
            {jsonKey}
          </code>
          <span
            className={`text-[11px] px-2 py-0.5 rounded border font-mono ${getTypeBadgeClass(
              type
            )}`}
          >
            {type}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Info className="w-3 h-3 flex-shrink-0 text-gray-500" />
          {description}
        </p>
      </div>

      {/* 値の表示 */}
      <div className="flex items-center gap-2 md:justify-end max-w-full md:max-w-md">
        {customRenderer ? (
          <div>{customRenderer}</div>
        ) : (
          <div className="bg-discord-darkest/70 px-3 py-1.5 rounded-md border border-white/10 text-xs font-mono text-gray-200 overflow-x-auto max-w-full">
            {value === null ? (
              <span className="text-gray-500 italic">null</span>
            ) : value === undefined ? (
              <span className="text-gray-600 italic">undefined</span>
            ) : typeof value === "boolean" ? (
              <span className={value ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                {String(value)}
              </span>
            ) : typeof value === "object" ? (
              <pre className="text-[11px] whitespace-pre-wrap">{displayValue}</pre>
            ) : (
              <span className="break-all">{displayValue}</span>
            )}
          </div>
        )}

        {/* コピーボタン */}
        <button
          onClick={copyToClipboard}
          title="値をコピー"
          className="p-1.5 rounded-md bg-discord-darker hover:bg-discord-lighter text-gray-400 hover:text-white transition-colors flex-shrink-0 border border-white/10"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
