import { NextRequest, NextResponse } from "next/server";
import {
  exchangeCodeForToken,
  fetchDiscordUser,
  fetchDiscordGuilds,
  fetchDiscordConnections,
} from "@/lib/discord";
import { saveSession, verifyAndClearOAuthState } from "@/lib/session";
import { UserSessionData } from "@/types/discord";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = new URL(request.url).origin;

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

  // CSRF state の検証
  const isValidState = await verifyAndClearOAuthState(state);
  if (!isValidState) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_csrf_state`);
  }

  try {
    // 1. 認可コードをアクセストークンと交換
    const tokenData = await exchangeCodeForToken(code);

    // 2. ユーザー属性情報 (@me) の取得
    const user = await fetchDiscordUser(tokenData.access_token);

    // 3. 所属サーバー一覧 (guilds) の取得（スコープに含まれている場合）
    let guilds = undefined;
    if (tokenData.scope.includes("guilds")) {
      guilds = await fetchDiscordGuilds(tokenData.access_token);
    }

    // 4. 連携アカウント一覧 (connections) の取得（スコープに含まれている場合）
    let connections = undefined;
    if (tokenData.scope.includes("connections")) {
      connections = await fetchDiscordConnections(tokenData.access_token);
    }

    // 5. セッションデータ作成と保存
    const sessionData: UserSessionData = {
      user,
      guilds,
      connections,
      tokenMeta: {
        token_type: tokenData.token_type,
        expires_at: Date.now() + tokenData.expires_in * 1000,
        scope: tokenData.scope,
      },
      fetchedAt: new Date().toISOString(),
      isDemo: false,
    };

    await saveSession(sessionData);

    // ダッシュボードへリダイレクト
    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (err: unknown) {
    console.error("Failed to process OAuth callback:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.redirect(
      `${baseUrl}/?error=auth_callback_failed&message=${encodeURIComponent(message)}`
    );
  }
}
