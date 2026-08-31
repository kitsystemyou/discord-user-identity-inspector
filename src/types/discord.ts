// Discord API Type Definitions

export interface DiscordAvatarDecorationData {
  asset: string;
  sku_id: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
  avatar_decoration_data?: DiscordAvatarDecorationData | null;
  clan?: {
    identity_guild_id: string;
    identity_enabled: boolean;
    tag: string;
    badge: string;
  } | null;
  // 追加のDiscord属性（将来の拡張用）
  [key: string]: unknown;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

export interface DiscordConnection {
  id: string;
  name: string;
  type: string;
  verified: boolean;
  friend_sync: boolean;
  show_activity: boolean;
  two_way_link: boolean;
  visibility: number;
}

export interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface UserSessionData {
  user: DiscordUser;
  guilds?: DiscordGuild[];
  connections?: DiscordConnection[];
  tokenMeta: {
    token_type: string;
    expires_at: number;
    scope: string;
  };
  fetchedAt: string;
  isDemo?: boolean;
}
