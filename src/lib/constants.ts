// Discord API Constants and Flag Maps

export const DISCORD_API_ENDPOINT = "https://discord.com/api/v10";
export const DISCORD_OAUTH2_AUTHORIZE_URL = "https://discord.com/oauth2/authorize";
export const DISCORD_OAUTH2_TOKEN_URL = `${DISCORD_API_ENDPOINT}/oauth2/token`;

// OAuth2 要求スコープ
export const DEFAULT_SCOPES = [
  "identify",
];

// Discord ユーザーフラグ（ビットフィールド）定義
export interface FlagDefinition {
  bit: number;
  name: string;
  description: string;
  badgeName: string;
  iconColor: string;
}

export const USER_FLAGS: FlagDefinition[] = [
  {
    bit: 1 << 0, // 1
    name: "STAFF",
    description: "Discord 公式スタッフ",
    badgeName: "Discord Staff",
    iconColor: "bg-blue-600 text-white",
  },
  {
    bit: 1 << 1, // 2
    name: "PARTNER",
    description: "パートナーサーバーオーナー",
    badgeName: "Partnered Server Owner",
    iconColor: "bg-blue-500 text-white",
  },
  {
    bit: 1 << 2, // 4
    name: "HYPESQUAD",
    description: "HypeSquad Events 参加者",
    badgeName: "HypeSquad Events",
    iconColor: "bg-yellow-500 text-black",
  },
  {
    bit: 1 << 3, // 8
    name: "BUG_HUNTER_LEVEL_1",
    description: "バグハンター Level 1",
    badgeName: "Bug Hunter Level 1",
    iconColor: "bg-green-600 text-white",
  },
  {
    bit: 1 << 6, // 64
    name: "HYPESQUAD_ONLINE_HOUSE_1",
    description: "HypeSquad Bravery（勇気）ハウス所属",
    badgeName: "HypeSquad Bravery",
    iconColor: "bg-purple-600 text-white",
  },
  {
    bit: 1 << 7, // 128
    name: "HYPESQUAD_ONLINE_HOUSE_2",
    description: "HypeSquad Brilliance（才気）ハウス所属",
    badgeName: "HypeSquad Brilliance",
    iconColor: "bg-red-500 text-white",
  },
  {
    bit: 1 << 8, // 256
    name: "HYPESQUAD_ONLINE_HOUSE_3",
    description: "HypeSquad Balance（調和）ハウス所属",
    badgeName: "HypeSquad Balance",
    iconColor: "bg-teal-500 text-white",
  },
  {
    bit: 1 << 9, // 512
    name: "PREMIUM_EARLY_SUPPORTER",
    description: "早期 Nitro サポーター",
    badgeName: "Early Supporter",
    iconColor: "bg-yellow-400 text-black",
  },
  {
    bit: 1 << 10, // 1024
    name: "TEAM_PSEUDO_USER",
    description: "開発者チームアカウント",
    badgeName: "Team User",
    iconColor: "bg-gray-600 text-white",
  },
  {
    bit: 1 << 14, // 16384
    name: "BUG_HUNTER_LEVEL_2",
    description: "バグハンター Level 2（ゴールド）",
    badgeName: "Bug Hunter Level 2",
    iconColor: "bg-yellow-600 text-white",
  },
  {
    bit: 1 << 16, // 65536
    name: "VERIFIED_BOT",
    description: "認証済みBot",
    badgeName: "Verified Bot",
    iconColor: "bg-indigo-600 text-white",
  },
  {
    bit: 1 << 17, // 131072
    name: "VERIFIED_DEVELOPER",
    description: "早期認証済みBot開発者",
    badgeName: "Early Verified Bot Developer",
    iconColor: "bg-blue-700 text-white",
  },
  {
    bit: 1 << 18, // 262144
    name: "CERTIFIED_MODERATOR",
    description: "Discord 公認モデレーター（旧モデレータープログラム修了者）",
    badgeName: "Certified Moderator",
    iconColor: "bg-blue-900 text-white",
  },
  {
    bit: 1 << 19, // 524288
    name: "BOT_HTTP_INTERACTIONS",
    description: "HTTP Interactions のみを使用するBot",
    badgeName: "HTTP Interactions Bot",
    iconColor: "bg-gray-700 text-white",
  },
  {
    bit: 1 << 22, // 4194304
    name: "ACTIVE_DEVELOPER",
    description: "アクティブ開発者バッジ保有者",
    badgeName: "Active Developer",
    iconColor: "bg-green-500 text-black font-semibold",
  },
];

// Premium Type（Nitro）の定義
export const PREMIUM_TYPE_LABELS: Record<number, { name: string; description: string; color: string }> = {
  0: { name: "なし (None)", description: "Nitro に加入していません", color: "text-gray-400" },
  1: { name: "Nitro Classic", description: "旧Nitro Classic プラン", color: "text-blue-400" },
  2: { name: "Nitro", description: "フル機能 Nitro プラン（サーバーブースト・カスタム絵文字・大容量送信等）", color: "text-pink-400" },
  3: { name: "Nitro Basic", description: "Nitro Basic プラン（カスタム絵文字等の軽量プラン）", color: "text-purple-400" },
};
