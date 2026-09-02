import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken, fetchDiscordUser } from "@/lib/discord";
import { applySessionToResponse, getBaseUrl } from "@/lib/session";
import { UserSessionData } from "@/types/discord";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = getBaseUrl(request);

  // Discord 側で拒否またはエラーが発生した場合
  if (error) {
    console.error(`Discord OAuth error: ${error} - ${errorDescription}`);
    return NextResponse.redirect(
      `${baseUrl}/?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(
        errorDescription || ""
      )}`
    );
  }

  // code または state が存在しない場合
  if (!code || !state) {
    return NextResponse.redirect(`${baseUrl}/?error=missing_code_or_state`);
  }

  // エラーレスポンス生成ヘルパー
  const errorResponse = (errKey: string, message?: string) => {
    const url = new URL(`${baseUrl}/`);
    url.searchParams.set("error", errKey);
    if (message) url.searchParams.set("message", message);
    const res = NextResponse.redirect(url.toString());
    res.cookies.delete("discord_oauth_state");
    return res;
  };

  // CSRF state の検証
  const storedState = request.cookies.get("discord_oauth_state")?.value;
  if (!storedState || storedState !== state) {
    console.warn(`CSRF state mismatch or missing. Stored: ${storedState}, Received: ${state}`);
    return errorResponse(
      "invalid_csrf_state",
      "セッション検証用Stateが一致しませんでした。ブラウザのCookie設定をご確認ください。"
    );
  }

  try {
    // 1. 認可コードをアクセストークンと交換
    const tokenData = await exchangeCodeForToken(code);

    // 2. ユーザー属性情報 (@me) の取得
    const user = await fetchDiscordUser(tokenData.access_token);

    // 3. セッションデータ作成 (Cookie 4KB制限を防ぐためaccessTokenを保持)
    const sessionData: UserSessionData = {
      user,
      accessToken: tokenData.access_token,
      tokenMeta: {
        token_type: tokenData.token_type,
        expires_at: Date.now() + tokenData.expires_in * 1000,
        scope: tokenData.scope,
      },
      fetchedAt: new Date().toISOString(),
      isDemo: false,
    };

    // 4. ダッシュボードへのリダイレクトレスポンスを作成し、直接セッションCookieを書き込む
    const redirectResponse = NextResponse.redirect(`${baseUrl}/dashboard`);
    redirectResponse.cookies.delete("discord_oauth_state");

    return await applySessionToResponse(redirectResponse, sessionData);
  } catch (err: unknown) {
    console.error("Failed to process OAuth callback:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return errorResponse("auth_callback_failed", message);
  }
}
