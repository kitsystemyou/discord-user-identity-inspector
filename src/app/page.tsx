import Link from "next/link";
import { getSession } from "@/lib/session";
import {
  Key,
  Database,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Terminal,
  ShieldAlert,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface HomePageProps {
  searchParams: {
    error?: string;
    error_description?: string;
    message?: string;
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const session = await getSession();

  const errorMessage = searchParams.error
    ? searchParams.message ||
      searchParams.error_description ||
      (searchParams.error === "missing_credentials"
        ? "DISCORD_CLIENT_ID または DISCORD_CLIENT_SECRET が環境変数に設定されていません。.env.local を作成して設定してください。"
        : `ログイン処理中にエラーが発生しました (${searchParams.error})`)
    : null;

  return (
    <div className="space-y-12 py-4 max-w-4xl mx-auto">
      {/* エラーアラート */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold">認証エラーが発生しました</p>
            <p className="text-red-300 mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* サードパーティ製ツールの明示バナー */}
      <div className="p-3.5 rounded-xl bg-discord-darkest/90 border border-amber-500/30 text-amber-200/90 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>サードパーティ開発者向けツール:</strong> 本ツールは Discord API (OAuth2 v10) の属性取得挙動を検証するための非公式開発者用ユーティリティです。
          </span>
        </div>
      </div>

      {/* ヒーローセクション */}
      <section className="text-center space-y-6 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>3rd-Party Developer Utility • Discord User Identity Inspector</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Discord OAuth2 API<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
            ユーザー属性インスペクター
          </span>
        </h1>

        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          OAuth2 認可フローを通じて Discord API から返却されるプロフィール情報、アバター、Nitro種別、フラグバッジ、所属サーバー、連携アカウントなどの全属性データをリアルタイムにデバッグ・検証できます。
        </p>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <a
            href="/api/auth/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] border border-white/10"
          >
            <Key className="w-5 h-5 text-indigo-200" />
            <span>Discord アカウントでログイン</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          {/* デモモード体験ボタン */}
          <a
            href="/api/auth/demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-discord-light hover:bg-discord-lighter text-gray-200 hover:text-white font-semibold text-base border border-white/10 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>デモデータで画面を確認</span>
          </a>
        </div>

        {session && (
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-indigo-400 hover:underline font-medium"
            >
              現在ログイン中です (ユーザー: {session.user.global_name || session.user.username}) → ダッシュボードを開く
            </Link>
          </div>
        )}
      </section>

      {/* 取得可能な属性のハイライト */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-discord-darkest/60 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">基本プロフィール属性</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            ユーザーID、ユーザー名、グローバル表示名、アバター、バナー画像、アクセントカラー、言語ロケール、メールアドレス、2FA認証状態など
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-discord-darkest/60 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">フラグ & Nitro バッジ</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Active Developer、HypeSquad、Early Supporter、Bug Hunter、Staff などのアカウントフラグ(Flags)をビット解析してバッジ化
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-discord-darkest/60 border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">拡張属性 & 生JSON</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            所属サーバー一覧 (Guilds)、外部連携アカウント (Connections: GitHub/Steam/Spotify等)、およびDiscord APIが返却する完全な生JSON
          </p>
        </div>
      </section>
    </div>
  );
}
