import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import {
  getBannerUrl,
  formatAccentColor,
  parseUserFlags,
  fetchDiscordGuilds,
  fetchDiscordConnections,
} from "@/lib/discord";
import { PREMIUM_TYPE_LABELS } from "@/lib/constants";
import { UserAvatar } from "@/components/UserAvatar";
import { BadgeList } from "@/components/BadgeList";
import { PropertyRow } from "@/components/PropertyRow";
import { RawJsonViewer } from "@/components/RawJsonViewer";
import { GuildsList } from "@/components/GuildsList";
import { ConnectionsList } from "@/components/ConnectionsList";
import Link from "next/link";
import Image from "next/image";
import {
  LogOut,
  User,
  Shield,
  Award,
  Key,
  Server,
  Link as LinkIcon,
  Code2,
  Calendar,
  Clock,
  Sparkles,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const { user, tokenMeta, fetchedAt, isDemo, accessToken } = session;

  // guilds と connections のオンデマンド取得 (Cookie 4KB上限回避のため)
  let guilds = session.guilds;
  let connections = session.connections;

  if (accessToken && !isDemo) {
    if (tokenMeta.scope.includes("guilds") && !guilds) {
      guilds = await fetchDiscordGuilds(accessToken);
    }
    if (tokenMeta.scope.includes("connections") && !connections) {
      connections = await fetchDiscordConnections(accessToken);
    }
  }

  const bannerUrl = getBannerUrl(user);
  const hexAccentColor = formatAccentColor(user.accent_color);
  const premiumInfo = user.premium_type !== undefined ? PREMIUM_TYPE_LABELS[user.premium_type] : PREMIUM_TYPE_LABELS[0];

  // バナー背景スタイル（バナー画像がある場合は画像、なければアクセントカラー、どちらもなければデフォルトグラデーション）
  const bannerStyle = bannerUrl
    ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
    : hexAccentColor
    ? { backgroundColor: hexAccentColor }
    : { background: "linear-gradient(135deg, #5865F2 0%, #7289DA 50%, #404EED 100%)" };

  return (
    <div className="space-y-8 pb-12">
      {/* 3rd Party ツール表記 */}
      <div className="flex items-center justify-between text-xs text-gray-400 bg-discord-darkest px-4 py-2 rounded-xl border border-white/5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-mono">
            3rd-Party DevTool
          </span>
          <span>User Identity Inspector (非公式・開発者向け)</span>
        </div>
        <Link href="/" className="text-indigo-400 hover:underline text-xs">
          ← トップへ戻る
        </Link>
      </div>
      {/* デモモード告知バナー */}
      {isDemo && (
        <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-800/70 text-amber-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>
              <strong>デモモードで表示中:</strong> 現在はサンプルのモックデータが表示されています。Discord Developer Portal の認証情報を設定することで、ご自身のアカウントでログインできます。
            </span>
          </div>
          <Link
            href="/"
            className="px-3 py-1 bg-amber-900/80 hover:bg-amber-800 rounded text-amber-100 font-medium transition-colors"
          >
            トップへ戻る
          </Link>
        </div>
      )}

      {/* ユーザープロファイルヘッダーカード */}
      <div className="rounded-2xl overflow-hidden bg-discord-darkest border border-white/10 shadow-2xl">
        {/* バナー */}
        <div className="h-44 sm:h-52 w-full relative" style={bannerStyle}>
          {hexAccentColor && !bannerUrl && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-black/60 backdrop-blur text-[11px] font-mono text-white">
              Accent Color: {hexAccentColor}
            </div>
          )}
        </div>

        {/* ユーザー基本情報バー */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20">
            {/* アバター & 名前 */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <UserAvatar user={user} size={96} imageSize={256} className="ring-4 ring-discord-darkest shadow-xl" />
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {user.global_name || user.username}
                  </h1>
                  {user.clan && (
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-discord-blurple/20 text-discord-blurple border border-discord-blurple/40">
                      [{user.clan.tag}]
                    </span>
                  )}
                  {user.bot && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-discord-blurple text-white uppercase tracking-wider">
                      BOT
                    </span>
                  )}
                  {user.system && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-600 text-white uppercase tracking-wider">
                      SYSTEM
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                  <span>@{user.username}</span>
                  {user.discriminator && user.discriminator !== "0" && (
                    <span>#{user.discriminator}</span>
                  )}
                  <span>•</span>
                  <span>ID: {user.id}</span>
                </div>
              </div>
            </div>

            {/* アクション（ログアウト） */}
            <div className="flex items-center gap-3 self-start sm:self-end pt-2">
              <a
                href="/api/auth/logout"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-red-100 border border-red-800/40 text-xs font-semibold transition-all shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>ログアウト</span>
              </a>
            </div>
          </div>

          {/* バッジ一覧 */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 font-medium">
              <Award className="w-3.5 h-3.5 text-discord-blurple" />
              <span>所持バッジ & Nitroステータス</span>
            </div>
            <BadgeList
              flags={user.flags}
              publicFlags={user.public_flags}
              premiumType={user.premium_type}
            />
          </div>
        </div>
      </div>

      {/* 属性カテゴリ 1: 基本プロフィール属性 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <User className="w-4 h-4 text-discord-blurple" />
          <span>基本ユーザー属性 (Core Identity)</span>
        </div>
        <div className="space-y-2">
          <PropertyRow
            label="ユーザー ID"
            jsonKey="id"
            type="string"
            value={user.id}
            description="Discordにおけるユーザーの一意のスノーフレーク(Snowflake)ID"
          />
          <PropertyRow
            label="ユーザー名 (Unique)"
            jsonKey="username"
            type="string"
            value={user.username}
            description="英数字とドット・アンダースコアで構成される一意のアカウント名"
          />
          <PropertyRow
            label="表示名 (Global Name)"
            jsonKey="global_name"
            type="string | null"
            value={user.global_name}
            description="サーバーやフレンド一覧で優先表示されるディスプレイネーム"
          />
          <PropertyRow
            label="識別子 (Discriminator)"
            jsonKey="discriminator"
            type="string"
            value={user.discriminator}
            description="旧タグ番号。新ユーザー名システム移行後は '0' が設定されます"
          />
          <PropertyRow
            label="アバターハッシュ"
            jsonKey="avatar"
            type="string | null"
            value={user.avatar}
            description="カスタムアバター画像のハッシュ値（a_で始まる場合はGIFアニメーション）"
          />
          <PropertyRow
            label="アバター装飾データ"
            jsonKey="avatar_decoration_data"
            type="object | null"
            value={user.avatar_decoration_data}
            description="ショップ等で購入したアバター装飾フレーム情報 (asset, sku_id)"
          />
          <PropertyRow
            label="バナーハッシュ"
            jsonKey="banner"
            type="string | null"
            value={user.banner}
            description="プロフィールのカスタムバナー画像のハッシュ値"
          />
          <PropertyRow
            label="アクセントカラー (HEX & 整数)"
            jsonKey="accent_color"
            type="number | null"
            value={user.accent_color}
            description="カスタムバナー未設定時にプロフィール背景に使用されるカラー値"
            customRenderer={
              hexAccentColor ? (
                <div className="flex items-center gap-2 bg-discord-darkest/70 px-3 py-1.5 rounded-md border border-white/10 font-mono text-xs text-gray-200">
                  <span
                    className="w-3.5 h-3.5 rounded border border-white/30"
                    style={{ backgroundColor: hexAccentColor }}
                  />
                  <span>{hexAccentColor}</span>
                  <span className="text-gray-500">({user.accent_color})</span>
                </div>
              ) : undefined
            }
          />
          <PropertyRow
            label="クラン / ギルドタグ"
            jsonKey="clan"
            type="object | null"
            value={user.clan}
            description="ユーザーが所属・表示しているプライマリクラン情報"
          />
        </div>
      </section>

      {/* 属性カテゴリ 2: セキュリティ & アカウントステータス */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>セキュリティ & アカウントステータス</span>
        </div>
        <div className="space-y-2">
          <PropertyRow
            label="メールアドレス"
            jsonKey="email"
            type="string | null"
            value={user.email}
            description="登録されているメールアドレス (email スコープが必要です)"
          />
          <PropertyRow
            label="メール認証済みフラグ"
            jsonKey="verified"
            type="boolean"
            value={user.verified}
            description="メールアドレスが認証済みであるかどうか"
            customRenderer={
              user.verified !== undefined ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-discord-darkest border border-white/10">
                  {user.verified ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">認証済み (Verified)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-rose-400">未認証 (Unverified)</span>
                    </>
                  )}
                </div>
              ) : undefined
            }
          />
          <PropertyRow
            label="2要素認証 (MFA / 2FA)"
            jsonKey="mfa_enabled"
            type="boolean"
            value={user.mfa_enabled}
            description="アカウントで2要素認証が有効化されているかどうか"
            customRenderer={
              user.mfa_enabled !== undefined ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded bg-discord-darkest border border-white/10">
                  {user.mfa_enabled ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">有効 (Enabled)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-rose-400">無効 (Disabled)</span>
                    </>
                  )}
                </div>
              ) : undefined
            }
          />
          <PropertyRow
            label="ロケール・選択言語"
            jsonKey="locale"
            type="string"
            value={user.locale}
            description="Discordクライアントで設定されている言語ロケール（例: ja, en-US）"
          />
          <PropertyRow
            label="Bot アカウント"
            jsonKey="bot"
            type="boolean"
            value={user.bot ?? false}
            description="Botアカウントかどうか"
          />
          <PropertyRow
            label="システムアカウント"
            jsonKey="system"
            type="boolean"
            value={user.system ?? false}
            description="Discord公式システムメッセージ用アカウントかどうか"
          />
        </div>
      </section>

      {/* 属性カテゴリ 3: Nitro & フラグ詳細 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Award className="w-4 h-4 text-pink-400" />
          <span>Nitro & アカウントフラグ (Bitfield Flags)</span>
        </div>
        <div className="space-y-2">
          <PropertyRow
            label="Nitro プラン種別"
            jsonKey="premium_type"
            type="number"
            value={user.premium_type ?? 0}
            description={`0: なし, 1: Nitro Classic, 2: Nitro, 3: Nitro Basic (現在: ${premiumInfo?.name || "なし"})`}
          />
          <PropertyRow
            label="ユーザーフラグ (Flags)"
            jsonKey="flags"
            type="number"
            value={user.flags ?? 0}
            description="アカウントに付与されている全フラグのビットマスク値"
          />
          <PropertyRow
            label="公開フラグ (Public Flags)"
            jsonKey="public_flags"
            type="number"
            value={user.public_flags ?? 0}
            description="他のユーザーにも公開されているバッジ等のフラグビットマスク値"
          />
        </div>
      </section>

      {/* 属性カテゴリ 4: OAuth2 メタ情報 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Key className="w-4 h-4 text-yellow-400" />
          <span>OAuth2 トークン & セッション情報</span>
        </div>
        <div className="space-y-2">
          <PropertyRow
            label="トークン種別"
            jsonKey="token_type"
            type="string"
            value={tokenMeta.token_type}
            description="APIアクセス時に Authorization ヘッダーで使用するタイプ (Bearer)"
          />
          <PropertyRow
            label="付与スコープ (Scopes)"
            jsonKey="scope"
            type="string"
            value={tokenMeta.scope}
            description="認可時にユーザーが許可したスコープ一覧"
          />
          <PropertyRow
            label="トークン有効期限"
            jsonKey="expires_at"
            type="timestamp"
            value={new Date(tokenMeta.expires_at).toLocaleString("ja-JP")}
            description="アクセストークンの有効期限日時"
          />
          <PropertyRow
            label="データ取得日時"
            jsonKey="fetched_at"
            type="timestamp"
            value={new Date(fetchedAt).toLocaleString("ja-JP")}
            description="Discord API からユーザー属性をフェッチした日時"
          />
        </div>
      </section>

      {/* 属性カテゴリ 5: 所属サーバー一覧 (Guilds) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Server className="w-4 h-4 text-indigo-400" />
            <span>所属サーバー一覧 (Guilds)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-discord-light text-gray-300 font-mono">
              {guilds ? guilds.length : 0} 件
            </span>
          </div>
        </div>
        <GuildsList guilds={guilds} />
      </section>

      {/* 属性カテゴリ 6: 連携アカウント (Connections) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <LinkIcon className="w-4 h-4 text-emerald-400" />
            <span>連携外部サービス (Connections)</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-discord-light text-gray-300 font-mono">
              {connections ? connections.length : 0} 件
            </span>
          </div>
        </div>
        <ConnectionsList connections={connections} />
      </section>

      {/* 属性カテゴリ 7: 完全な生データ JSON (Raw Response) */}
      <section className="space-y-3 pt-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Code2 className="w-4 h-4 text-discord-blurple" />
          <span>Discord API レスポンス完全生データ (Raw JSON)</span>
        </div>
        <p className="text-xs text-gray-400">
          Discord API (<code>/users/@me</code>, <code>/guilds</code>, <code>/connections</code>) から返却された生の JSON データをそのまま表示しています。
        </p>

        <div className="space-y-4">
          <RawJsonViewer
            data={user}
            title="GET /users/@me (ユーザーオブジェクト全属性)"
            defaultExpanded={true}
          />
          {guilds && guilds.length > 0 && (
            <RawJsonViewer
              data={guilds}
              title={`GET /users/@me/guilds (${guilds.length} 件のサーバーデータ)`}
              defaultExpanded={false}
            />
          )}
          {connections && connections.length > 0 && (
            <RawJsonViewer
              data={connections}
              title={`GET /users/@me/connections (${connections.length} 件の連携データ)`}
              defaultExpanded={false}
            />
          )}
        </div>
      </section>
    </div>
  );
}
