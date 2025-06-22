import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { NextResponse } from "next/server";

export const GET = async (): Promise<Response> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { message: "No active session" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        message: "Session active",
        session,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Session check error:", message);

    return NextResponse.json(
      { message: "Server error", details: message },
      { status: 500 }
    );
  }
};
