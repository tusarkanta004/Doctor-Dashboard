import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import { Prescription } from '@/models/Prescription';

interface PrescriptionRequestBody {
  patientId: string;
  doctorId: string;
  symptoms: string[];
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    instructions: string;
  }[];
}

export async function POST(req: Request): Promise<Response> {
  try {
    await connectToDatabase();

    const body: PrescriptionRequestBody = await req.json();

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
      medications,
    });

    return NextResponse.json(
      { message: 'Prescription saved successfully', prescription: newPrescription },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Prescription creation error:', message);
    return NextResponse.json(
      { message: 'Server error', details: message },
      { status: 500 }
    );
  }
}
