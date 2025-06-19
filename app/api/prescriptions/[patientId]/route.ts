import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { Prescription } from '@/models/Prescription';

// GET /api/prescriptions/:patientId
export async function GET(
  req: Request,
  { params }: { params: { patientId: string } }
) {
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
  } catch (error: any) {
    console.error('Prescription fetch error:', error);
    return NextResponse.json(
      { message: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}
