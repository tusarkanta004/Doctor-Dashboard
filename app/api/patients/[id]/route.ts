import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { Patient } from '@/models/Patient';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();

  const { id } = params;

  try {
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching patient', error }, { status: 500 });
  }
}
