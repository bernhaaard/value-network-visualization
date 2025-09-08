import { NextRequest, NextResponse } from "next/server";
import { completeStudySession } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Check required data is present
    if (!data.sessionMetadata || !data.userFeedbackData || !data.valueProfile) {
      return NextResponse.json(
        { error: "Missing required data: sessionMetadata, userFeedbackData, valueProfile" },
        { status: 400 },
      );
    }

    // Save final study data
    const result = await completeStudySession(data);

    return NextResponse.json({
      success: true,
      analytics: result,
    });
  } catch (error) {
    console.error("Study completion error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to complete study" },
      { status: 500 },
    );
  }
}
