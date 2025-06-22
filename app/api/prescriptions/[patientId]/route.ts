import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { Prescription } from '@/models/Prescription';

interface Params {
  params: {
    patientId: string;
  };
}

// GET /api/prescriptions/:patientId
export async function GET(
  req: Request,
  { params }: Params
): Promise<Response> {
  try {
    await connectToDatabase();

    const prescriptions = await Prescription.find({ patientId: params.patientId })
      .populate('doctorId', 'fullName specializations')
      .sort({ createdAt: -1 });

    if (!prescriptions.length) {
      return NextResponse.json(
        { message: 'No prescriptions found for this patient' },
        { status: 404 }
      );
    }

    return NextResponse.json(prescriptions, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Prescription fetch error:', message);
    return NextResponse.json(
      { message: 'Server error', details: message },
      { status: 500 }
    );
  }
}
