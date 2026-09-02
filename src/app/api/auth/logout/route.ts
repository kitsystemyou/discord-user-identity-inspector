import { NextRequest, NextResponse } from "next/server";
import { applyLogoutToResponse, getBaseUrl } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  const response = NextResponse.redirect(`${baseUrl}/`);
  return applyLogoutToResponse(response);
}

export async function POST(request: NextRequest) {
  const baseUrl = getBaseUrl(request);
  const response = NextResponse.redirect(`${baseUrl}/`);
  return applyLogoutToResponse(response);
}
