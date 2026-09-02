import { NextRequest, NextResponse } from "next/server";
import { getMockUserData } from "@/lib/discord";
import { applySessionToResponse, getBaseUrl } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const mockData = getMockUserData();
  const baseUrl = getBaseUrl(request);
  const response = NextResponse.redirect(`${baseUrl}/dashboard`);
  return await applySessionToResponse(response, mockData);
}
