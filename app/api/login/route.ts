import { NextResponse } from 'next/server';
import Doctor from '@/models/Doctor';
import { connectToDatabase } from '@/utils/db';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 401 });
    }

    if (doctor.password !== password) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful", doctor }, { status: 200 });
  } catch (err: any) {
    console.error("Login error:", err.message);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
