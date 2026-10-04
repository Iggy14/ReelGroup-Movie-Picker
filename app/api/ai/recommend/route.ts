import { NextRequest, NextResponse } from "next/server";

// Powers "Surprise Us (AI Pick)" in the Suggest a Film modal.
// Calls Gemini server-side using process.env.GEMINI_API_KEY.
export async function POST(request: NextRequest) {
  // TODO: read group's watch history from Supabase, call Gemini, return suggestions
  return NextResponse.json({ suggestions: [] });
}
