import { NextRequest, NextResponse } from "next/server";

// Powers "Let AI Decide" tiebreaker in the Decide Now face-off screen.
// Calls Gemini server-side using process.env.GEMINI_API_KEY.
export async function POST(request: NextRequest) {
  // TODO: read the two contenders + group taste data, call Gemini, return verdict text
  return NextResponse.json({ verdict: "" });
}
