import { Patient } from '@/models/Patient';
import { connectToDatabase } from '@/utils/db';
import { NextResponse } from 'next/server';

export const GET = async (req: Request) => {
  await connectToDatabase();
  const url = new URL(req.url);
  const doctorId = url.searchParams.get('doctorId');

  if (!doctorId) {
    return NextResponse.json({ message: 'Doctor ID missing' }, { status: 400 });
  }

  const patients = await Patient.find({ doctor: doctorId });
  return NextResponse.json(patients);
};
