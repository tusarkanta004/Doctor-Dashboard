import { NextResponse } from 'next/server';
import { Patient } from '@/models/Patient';
import { connectToDatabase } from '@/utils/db';

// Define the shape of the patient request body (optional: match your schema exactly)
interface PatientRequestBody {
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  diagnosis?: string;
  vitalSigns?: Record<string, unknown>;
  medicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
  doctor: string; // assuming it's a required reference
}

export const POST = async (req: Request): Promise<Response> => {
  await connectToDatabase();

  try {
    const body: PatientRequestBody = await req.json();

    const newPatient = await Patient.create(body);

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error('Error registering patient:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Failed to register patient', details: message }, { status: 500 });
  }
};

export const GET = async (req: Request): Promise<Response> => {
  await connectToDatabase();

  try {
    const url = new URL(req.url);
    const doctorId = url.searchParams.get('doctorId');

    const patients = doctorId
      ? await Patient.find({ doctor: doctorId })
      : await Patient.find();

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Failed to fetch patients', details: message }, { status: 500 });
  }
};
