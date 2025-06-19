import { Patient } from '@/models/Patient';
import { connectToDatabase } from '@/utils/db';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const GET = async (req: Request) => {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const doctorId = url.searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    // Validate doctorId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ error: 'Invalid Doctor ID format' }, { status: 400 });
    }

    const patients = await Patient.find({ doctor: doctorId });

    return NextResponse.json(patients, { status: 200 });
  } catch (err: any) {
    console.error("❌ Error fetching patients:", err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
