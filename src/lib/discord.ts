import {
  DISCORD_API_ENDPOINT,
  DISCORD_OAUTH2_AUTHORIZE_URL,
  DISCORD_OAUTH2_TOKEN_URL,
  DEFAULT_SCOPES,
  USER_FLAGS,
  FlagDefinition,
} from "./constants";
import {
  DiscordUser,
  DiscordGuild,
  DiscordConnection,
  DiscordTokenResponse,
} from "@/types/discord";

/**
 * Discord OAuth2 認可URLを構築する
 */
export function getDiscordOAuthUrl(state: string, customScopes?: string[]): string {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = process.env.DISCORD_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  if (!clientId) {
    throw new Error("DISCORD_CLIENT_ID is not configured in environment variables.");
  }

  const envScopes = process.env.DISCORD_SCOPES ? process.env.DISCORD_SCOPES.split(" ") : undefined;
  const scopes = customScopes || envScopes || DEFAULT_SCOPES;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: scopes.join(" "),
    state: state,
    prompt: "consent",
  });

  return `${DISCORD_OAUTH2_AUTHORIZE_URL}?${params.toString()}`;
}

/**
 * 認可コード(code)をアクセストークンと交換する
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri?: string
): Promise<DiscordTokenResponse> {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const actualRedirectUri =
    redirectUri || process.env.DISCORD_REDIRECT_URI || "http://localhost:3000/api/auth/callback";

  if (!clientId || !clientSecret) {
    throw new Error("DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET is not configured.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: actualRedirectUri,
  });

  const response = await fetch(DISCORD_OAUTH2_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to exchange code for token: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * ユーザー情報 (@me) を取得する
 */
export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API_ENDPOINT}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch Discord user: ${response.status} - ${errorText}`);
  }

  return response.json();
}

/**
 * ユーザーの所属サーバー一覧を取得する (guilds スコープが必要)
 */
export async function fetchDiscordGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch(`${DISCORD_API_ENDPOINT}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.warn(`Could not fetch guilds: ${response.status}`);
    return [];
  }

  return response.json();
}

/**
 * ユーザーの連携アカウント一覧を取得する (connections スコープが必要)
 */
export async function fetchDiscordConnections(accessToken: string): Promise<DiscordConnection[]> {
  const response = await fetch(`${DISCORD_API_ENDPOINT}/users/@me/connections`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    console.warn(`Could not fetch connections: ${response.status}`);
    return [];
  }

  return response.json();
}

/**
 * Discord CDN の size パラメータを有効な2の累乗 (16, 32, 64, 128, 256, 512, 1024, 2048, 4096) に正規化する
 */
export function normalizeDiscordImageSize(size: number = 256): number {
  const VALID_SIZES = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
  if (!size || size < 16) return 16;
  if (size > 4096) return 4096;
  
  // 渡された size 以上の最小の2の累乗を探す
  const matched = VALID_SIZES.find((s) => s >= size);
  return matched || 256;
}

/**
 * ユーザーのアバター画像URLを取得する
 */
export function getAvatarUrl(user: DiscordUser, size: number = 256): string {
  const normalizedSize = normalizeDiscordImageSize(size);

  if (!user || !user.avatar || typeof user.avatar !== "string" || user.avatar.trim() === "") {
    // デフォルトアバターの計算
    // 新仕様 (discriminator === "0" の場合: (userId >> 22) % 6)
    if (user?.id) {
      try {
        const defaultIndex = Number((BigInt(user.id) >> BigInt(22)) % BigInt(6));
        const index = isNaN(defaultIndex) ? 0 : Math.abs(defaultIndex % 6);
        return `https://cdn.discordapp.com/embed/avatars/${index}.png?size=${normalizedSize}`;
      } catch {
        return `https://cdn.discordapp.com/embed/avatars/0.png?size=${normalizedSize}`;
      }
    }
    const discriminatorNum = parseInt(user?.discriminator || "0", 10);
    const defaultIndex = !isNaN(discriminatorNum) && discriminatorNum > 0 ? discriminatorNum % 5 : 0;
    return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png?size=${normalizedSize}`;
  }

  const isAnimated = user.avatar.startsWith("a_");
  const ext = isAnimated ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=${normalizedSize}`;
}

/**
 * バナー画像URLを取得する
 */
export function getBannerUrl(user: DiscordUser, size: number = 512): string | null {
  if (!user || !user.banner || typeof user.banner !== "string" || user.banner.trim() === "") {
    return null;
  }
  const normalizedSize = normalizeDiscordImageSize(size);
  const isAnimated = user.banner.startsWith("a_");
  const ext = isAnimated ? "gif" : "png";
  return `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.${ext}?size=${normalizedSize}`;
}

/**
 * アバターデコレーションURLを取得する
 */
export function getAvatarDecorationUrl(user: DiscordUser, size: number = 256): string | null {
  if (!user?.avatar_decoration_data?.asset) return null;
  const normalizedSize = normalizeDiscordImageSize(size);
  return `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=${normalizedSize}`;
}

/**
 * サーバーアイコンURLを取得する
 */
export function getGuildIconUrl(guild: DiscordGuild, size: number = 128): string | null {
  if (!guild || !guild.icon || typeof guild.icon !== "string") return null;
  const normalizedSize = normalizeDiscordImageSize(size);
  const isAnimated = guild.icon.startsWith("a_");
  const ext = isAnimated ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=${normalizedSize}`;
}

/**
 * ユーザーフラグ（ビットフィールド）を解析して保有バッジ一覧を返す
 */
export function parseUserFlags(flags: number = 0): FlagDefinition[] {
  return USER_FLAGS.filter((def) => (flags & def.bit) === def.bit);
}

/**
 * 16進数カラーコードをCSSのhex文字列に変換する
 */
export function formatAccentColor(accentColor?: number | null): string | null {
  if (accentColor === undefined || accentColor === null || isNaN(accentColor)) return null;
  return `#${accentColor.toString(16).padStart(6, "0")}`;
}

/**
 * デモ用のモックユーザーデータを生成する
 */
export function getMockUserData(): {
  user: DiscordUser;
  guilds: DiscordGuild[];
  connections: DiscordConnection[];
  tokenMeta: {
    token_type: string;
    expires_at: number;
    scope: string;
  };
  fetchedAt: string;
  isDemo: boolean;
} {
  return {
    user: {
      id: "803511102246789140",
      username: "lady_eleanor_dev",
      discriminator: "0",
      global_name: "Eleanor | Web Developer",
      avatar: null, // 公式デフォルトアバター (cdn.discordapp.com/embed/avatars/0.png) を使用
      bot: false,
      system: false,
      mfa_enabled: true,
      banner: null,
      accent_color: 5793266, // #5865F2
      locale: "ja",
      verified: true,
      email: "eleanor.developer@example.com",
      flags: 4194304 | 128 | 512, // Active Developer + HypeSquad Brilliance + Early Supporter
      premium_type: 2, // Full Nitro
      public_flags: 4194304 | 128 | 512,
      avatar_decoration_data: null,
      clan: {
        identity_guild_id: "999888777666555444",
        identity_enabled: true,
        tag: "DEV",
        badge: "clan_badge_hash_example",
      },
    },
    guilds: [
      {
        id: "100000000000000001",
        name: "Developer Community Hub",
        icon: null,
        owner: false,
        permissions: "1071698660929",
        features: ["COMMUNITY", "VERIFIED", "NEWS", "DISCOVERABLE"],
        approximate_member_count: 245000,
      },
      {
        id: "100000000000000002",
        name: "Gaming & TypeScript Lab",
        icon: null,
        owner: true,
        permissions: "8",
        features: ["COMMUNITY", "ROLE_ICONS"],
        approximate_member_count: 120,
      },
      {
        id: "100000000000000003",
        name: "Next.js & Cloud Architecture",
        icon: null,
        owner: false,
        permissions: "2147483647",
        features: ["THREADS_ENABLED"],
        approximate_member_count: 530,
      },
    ],
    connections: [
      {
        id: "octocat_eleanor",
        name: "eleanor-github",
        type: "github",
        verified: true,
        friend_sync: false,
        show_activity: true,
        two_way_link: true,
        visibility: 1,
      },
      {
        id: "eleanor_steam_76561198000000000",
        name: "Eleanor Gaming",
        type: "steam",
        verified: true,
        friend_sync: true,
        show_activity: true,
        two_way_link: true,
        visibility: 1,
      },
      {
        id: "eleanor_spotify",
        name: "Eleanor | Lo-Fi & Classical",
        type: "spotify",
        verified: true,
        friend_sync: false,
        show_activity: true,
        two_way_link: true,
        visibility: 1,
      },
    ],
    tokenMeta: {
      token_type: "Bearer",
      expires_at: Date.now() + 604800 * 1000,
      scope: "identify email guilds connections",
    },
    fetchedAt: new Date().toISOString(),
    isDemo: true,
  };
}
