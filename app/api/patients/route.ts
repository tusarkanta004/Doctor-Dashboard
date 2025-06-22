import { Patient } from '@/models/Patient';
import { connectToDatabase } from '@/utils/db';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const GET = async (req: Request): Promise<Response> => {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const doctorId = url.searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return NextResponse.json({ error: 'Invalid Doctor ID format' }, { status: 400 });
    }

    const patients = await Patient.find({ doctor: doctorId });

    return NextResponse.json(patients, { status: 200 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error("❌ Error fetching patients:", message);
    return NextResponse.json(
      { error: 'Internal Server Error', details: message },
      { status: 500 }
    );
  }
};
