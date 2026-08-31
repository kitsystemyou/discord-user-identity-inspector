import { NextRequest, NextResponse } from "next/server";
import { getDiscordOAuthUrl } from "@/lib/discord";
import { saveOAuthState } from "@/lib/session";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const clientId = process.env.DISCORD_CLIENT_ID;
    if (!clientId) {
      return NextResponse.redirect(
        new URL("/?error=missing_credentials", request.url)
      );
    }

    // CSRF対策用のランダムな state を生成
    const state = crypto.randomBytes(24).toString("hex");
    await saveOAuthState(state);

    // Discord OAuth2 認可URLを構築
    const authUrl = getDiscordOAuthUrl(state);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Login redirect error:", error);
    return NextResponse.redirect(
      new URL("/?error=oauth_init_failed", request.url)
    );
  }
}
