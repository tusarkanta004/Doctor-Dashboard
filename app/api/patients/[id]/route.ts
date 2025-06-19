import { Patient } from '@/models/Patient';
import { connectToDatabase } from '@/utils/db';
import { NextResponse } from 'next/server';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  await connectToDatabase();
  const patient = await Patient.findById(params.id);
  if (!patient) {
    return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
  }
  return NextResponse.json(patient);
};
