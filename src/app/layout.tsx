import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { Terminal, ShieldAlert, Code2, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Discord User Identity Inspector (3rd Party DevTool)",
  description: "Discord OAuth2 API を用いたサードパーティ開発者向け属性検証・デバッグツール",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-discord-darker text-gray-100 flex flex-col min-h-screen">
        {/* ナビゲーションバー */}
        <header className="border-b border-white/10 bg-discord-darkest/90 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 font-bold text-lg text-white hover:opacity-90 transition-opacity">
              {/* 開発者用オリジナルアイコン (Terminal + Code) */}
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-white/10">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight">User Identity Inspector</span>
                  <span className="text-[10px] leading-none px-1.5 py-[2px] rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium inline-flex items-center">
                    3rd Party DevTool
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-normal">
                  for Discord OAuth2 API
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-full font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                v10 API Debugger
              </span>
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {children}
        </main>

        {/* フッター */}
        <footer className="border-t border-white/10 bg-discord-darkest/80 py-6 text-center text-xs text-gray-400">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-gray-400">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                本ツールは Discord, Inc. 公式のサービスではなく、API 検証用のサードパーティ開発者ツールです。
              </span>
            </div>
            <p className="text-gray-500 text-[11px]">
              Discord User Identity Inspector • 3rd-Party Developer Utility
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
