import { NextRequest, NextResponse } from "next/server";
import { createSessionRecord } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required data
    if (!data.sessionMetadata || !data.demographics || !data.valueProfile || !data.responses) {
      return NextResponse.json(
        { error: "Missing required data: sessionMetadata, demographics, valueProfile, responses" },
        { status: 400 },
      );
    }

    const result = await createSessionRecord(data);
    return NextResponse.json({ success: true, sessionId: result.id });
  } catch (error) {
    console.error("Study session API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
