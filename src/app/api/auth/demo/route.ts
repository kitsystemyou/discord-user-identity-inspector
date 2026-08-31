import { NextRequest, NextResponse } from "next/server";
import { getMockUserData } from "@/lib/discord";
import { saveSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const mockData = getMockUserData();
  await saveSession(mockData);
  const baseUrl = new URL(request.url).origin;
  return NextResponse.redirect(`${baseUrl}/dashboard`);
}
