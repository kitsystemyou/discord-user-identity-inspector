# Discord User Identity Inspector (3rd Party DevTool)

> **⚠️ 免責事項 (Disclaimer)**
> 本ツールは Discord, Inc. 公式の製品・サービスではありません。Discord OAuth2 API (v10) の挙動確認や、取得できるユーザー属性の検証・デバッグを行うためのサードパーティ製オープンソース開発者向けツールです。

---

## 🔒 OAuth2 スコープについて（重要）

本アプリケーションの OAuth2 要求スコープは、**最小権限の原則に基づき、デフォルトでは `identify` のみ** を要求する設定になっております。

```text
デフォルトスコープ: identify
```

メールアドレス（`email`）や所属サーバー一覧（`guilds`）、外部連携アカウント（`connections`）などの追加情報を取得・検証したい場合は、**環境変数 `DISCORD_SCOPES` またはコード内の定数を任意で変更**してください。

### スコープの拡張方法

#### 方法 1: 環境変数（推奨）
`.env.local` の `DISCORD_SCOPES` に必要なスコープをスペース区切りで記述します：

```env
# 例: 全属性（メール、サーバー、連携アカウント）を検証する場合
DISCORD_SCOPES=identify email guilds connections
```

#### 方法 2: コード定数の変更
[`src/lib/constants.ts`](src/lib/constants.ts) 内の `DEFAULT_SCOPES` を修正します：

```typescript
export const DEFAULT_SCOPES = [
  "identify",
  "email",
  "guilds",
  "connections",
];
```

---

## 主な機能

1. **OAuth2 認証フロー検証 (v10 API)**
   - CSRF対策用の暗号化 `state` パラメータ生成と検証
   - `jose` を使用したセキュアな HTTP-Only Cookie セッション管理
2. **取得可能な全ユーザー属性の完全可視化**
   - **基本属性 (`identify`)**: ユーザーID (Snowflake), ユーザーネーム, 表示名 (Global Name), 識別子 (Discriminator), アバター (アニメーションGIF / アバター装飾 Avatar Decoration / エラー時フォールバック対応), バナー, アクセントカラー, クラン情報
   - **セキュリティ & ステータス**: メールアドレス (`email`), メール認証済みフラグ (Verified), 2要素認証有効化 (2FA/MFA), ロケール (言語), Bot / System フラグ
   - **Nitro & バッジ (Bitfield Flags)**: Nitro プラン種別 (Classic / Full / Basic), Active Developer, HypeSquad, Early Supporter, Staff, Bug Hunter などのビットフラグ解析
   - **所属サーバー (`guilds`)**: 参加サーバーの名前、アイコン、オーナー権限、メンバー数など
   - **連携サービス (`connections`)**: 外部アカウント連携 (GitHub, Steam, Spotify, Twitch, YouTube, X など)
   - **OAuth2 メタ情報**: トークン種別, 付与スコープ, 有効期限, 取得日時
3. **生データ JSON ビューア (Raw JSON)**
   - Discord API (`/users/@me`, `/guilds`, `/connections`) から取得された生レスポンスを完全表示
   - ワンクリックでのクリップボードコピー機能
4. **デモモード搭載**
   - Discord Client ID / Secret を設定する前でも、モックデータで画面の表示と全属性の動作確認が可能

---

## セットアップ手順

### 1. Discord Developer Portal での設定

1. [Discord Developer Portal](https://discord.com/developers/applications) にアクセスし、ログインします。
2. 右上の **「New Application」** をクリックしてアプリケーションを作成します。
3. 左サイドメニューの **「OAuth2」** を選択します。
4. **「Redirects」** セクションで **「Add Redirect」** をクリックし、以下を入力して **「Save Changes」** を押します：
   ```text
   http://localhost:3000/api/auth/callback
   ```
5. **「Client ID」** をコピーします。
6. **「Client Secret」** の **「Reset Secret」** ボタンをクリックし、生成されたシークレットをコピーします。

---

### 2. 環境変数の設定

プロジェクトルートの `.env.local` に先ほど取得した情報を設定します：

```env
DISCORD_CLIENT_ID=あなたのクライアントID
DISCORD_CLIENT_SECRET=あなたのクライアントシークレット
DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/callback
DISCORD_SCOPES=identify
SESSION_SECRET=32文字以上のランダムな秘密鍵文字列
```

---

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

- **「Discord アカウントでログイン」**: 自身で登録した開発用アプリ経由で実際の Discord アカウントでログインし属性を検証します。
- **「デモデータで画面を確認」**: 認証情報を設定せずとも、取得属性のプレビュー画面を確認できます。
