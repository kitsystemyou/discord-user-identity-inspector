import { NextRequest, NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  await clearSession();
  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(`${baseUrl}/`);
}

export async function POST(request: NextRequest) {
  await clearSession();
  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(`${baseUrl}/`);
}
