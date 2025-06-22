import { Patient } from '@/models/Patient';
import { connectToDatabase } from '@/utils/db';
import { NextResponse } from 'next/server';

export const GET = async (
  req: Request,
  context: { params: { id: string } }
): Promise<Response> => {
  try {
    await connectToDatabase();

    const patient = await Patient.findById(context.params.id);

    if (!patient) {
      return NextResponse.json({ message: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json(patient, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Fetch patient error:', message);

    return NextResponse.json(
      { message: 'Failed to fetch patient', details: message },
      { status: 500 }
    );
  }
};
