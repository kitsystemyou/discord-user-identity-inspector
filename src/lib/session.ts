import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { UserSessionData } from "@/types/discord";

export const SESSION_COOKIE_NAME = "discord_oauth_session";
export const STATE_COOKIE_NAME = "discord_oauth_state";

// セッション署名キー (環境変数 SESSION_SECRET またはフォールバック)
function getSecretKey(): Uint8Array {
  const secret = process.env.SESSION_SECRET || "default_super_secret_session_key_32bytes_long_12345";
  return new TextEncoder().encode(secret.padEnd(32, "!").slice(0, 32));
}

/**
 * リクエストのベースURLを取得する
 */
export function getBaseUrl(request: NextRequest): string {
  return new URL(request.url).origin;
}

/**
 * セッションデータから軽量なJWTトークンを生成する
 * (Cookie 4KB制限を回避するため、accessToken と user 基本情報のみをJWTに格納)
 */
export async function createSessionToken(data: UserSessionData): Promise<string> {
  const key = getSecretKey();

  // Cookieサイズを4KB未満に収めるため、巨大になりうるguilds/connectionsは除外してtokenを保持
  const lightweightData: UserSessionData = {
    user: data.user,
    tokenMeta: data.tokenMeta,
    fetchedAt: data.fetchedAt,
    isDemo: data.isDemo,
  };

  return await new SignJWT({ data: lightweightData })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/**
 * NextResponse にセッション Cookie を付加する
 */
export async function applySessionToResponse(
  response: NextResponse,
  data: UserSessionData
): Promise<NextResponse> {
  const token = await createSessionToken(data);

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7日間
  });

  return response;
}

/**
 * NextResponse に OAuth2 state Cookie を付加する
 */
export function applyStateToResponse(
  response: NextResponse,
  state: string
): NextResponse {
  response.cookies.set(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10, // 10分
  });

  return response;
}

/**
 * Cookieからセッションデータを取得・検証する
 */
export async function getSession(req?: NextRequest): Promise<UserSessionData | null> {
  try {
    let token: string | undefined;

    if (req) {
      token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    } else {
      const cookieStore = cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    }

    if (!token) return null;

    const key = getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return (payload as { data: UserSessionData }).data;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && err.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    return null;
  }
}

/**
 * ログアウト時に Cookie を削除する
 */
export function applyLogoutToResponse(response: NextResponse): NextResponse {
  response.cookies.delete(SESSION_COOKIE_NAME);
  response.cookies.delete(STATE_COOKIE_NAME);
  return response;
}
