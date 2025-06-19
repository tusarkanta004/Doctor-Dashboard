import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/auth";
import { NextResponse } from "next/server";

export const GET = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "No active session" }, { status: 401 });
  }

  return NextResponse.json({
    message: "Session active",
    session
  });
};
