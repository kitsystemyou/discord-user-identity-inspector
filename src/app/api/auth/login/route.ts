import { NextRequest, NextResponse } from "next/server";
import { getDiscordOAuthUrl } from "@/lib/discord";
import { applyStateToResponse, getBaseUrl } from "@/lib/session";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request);

  try {
    const clientId = process.env.DISCORD_CLIENT_ID;
    if (!clientId) {
      return NextResponse.redirect(`${baseUrl}/?error=missing_credentials`);
    }

    // CSRF対策用のランダムな state を生成
    const state = crypto.randomBytes(24).toString("hex");

    // Discord OAuth2 認可URLを構築
    const authUrl = getDiscordOAuthUrl(state);

    // リダイレクトレスポンスを作成し、直接 state Cookie を確実に設定
    const response = NextResponse.redirect(authUrl);
    return applyStateToResponse(response, state);
  } catch (error) {
    console.error("Login redirect error:", error);
    return NextResponse.redirect(`${baseUrl}/?error=oauth_init_failed`);
  }
}
