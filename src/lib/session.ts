import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { UserSessionData } from "@/types/discord";

const SESSION_COOKIE_NAME = "discord_oauth_session";
const STATE_COOKIE_NAME = "discord_oauth_state";

// セッション署名キー (環境変数 SESSION_SECRET またはフォールバック)
function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "default_super_secret_session_key_32bytes_long_12345";
  return new TextEncoder().encode(secret.padEnd(32, "!").slice(0, 32));
}

/**
 * セッションデータを暗号化JWTとしてCookieに保存する
 */
export async function saveSession(data: UserSessionData): Promise<void> {
  const key = getSecretKey();
  const jwt = await new SignJWT({ data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7日間
  });
}

/**
 * Cookieからセッションデータを取得・検証する
 */
export async function getSession(): Promise<UserSessionData | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return (payload as { data: UserSessionData }).data;
  } catch (err: unknown) {
    // Next.js の dynamic server usage エラーは再スロー
    if (err && typeof err === "object" && "digest" in err && err.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    return null;
  }
}

/**
 * セッションCookieを削除する
 */
export async function clearSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(STATE_COOKIE_NAME);
}

/**
 * OAuth2 CSRF防止用 state を保存する
 */
export async function saveOAuthState(state: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10分
  });
}

/**
 * OAuth2 state を取得・検証して削除する
 */
export async function verifyAndClearOAuthState(stateToVerify: string): Promise<boolean> {
  const cookieStore = cookies();
  const storedState = cookieStore.get(STATE_COOKIE_NAME)?.value;
  cookieStore.delete(STATE_COOKIE_NAME);

  if (!storedState || storedState !== stateToVerify) {
    return false;
  }
  return true;
}
