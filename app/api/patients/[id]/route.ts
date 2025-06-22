import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { Patient } from '@/models/Patient';

interface Context {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Context) {
  await connectToDatabase();

  try {
    const patient = await Patient.findById(params.id);
    if (!patient) {
      return NextResponse.json(
        { message: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(patient);
  } catch (error) {
    return NextResponse.json(
      { message: 'Error fetching patient', error },
      { status: 500 }
    );
  }
}