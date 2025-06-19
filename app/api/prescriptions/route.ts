import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { Prescription } from '@/models/Prescription';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    const { patientId, doctorId, symptoms, diagnosis, medications } = body;

    if (
      !patientId ||
      !doctorId ||
      !symptoms ||
      !Array.isArray(symptoms) ||
      !diagnosis ||
      !Array.isArray(medications)
    ) {
      return NextResponse.json(
        { message: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    const newPrescription = await Prescription.create({
      doctorId,
      patientId,
      symptoms,
      diagnosis,
      medications
    });

    return NextResponse.json(
      { message: 'Prescription saved successfully', prescription: newPrescription },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Prescription creation error:', error);
    return NextResponse.json(
      { message: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}
