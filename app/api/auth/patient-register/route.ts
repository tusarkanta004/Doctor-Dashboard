import { NextResponse } from 'next/server';
import { Patient } from '@/models/Patient';
import { connectToDatabase } from '@/utils/db';

export const POST = async (req: Request) => {
  await connectToDatabase();
  const body = await req.json();

  try {
    // Validate required patient fields before saving (optional — mongoose will validate too)
    const newPatient = await Patient.create(body);

    return NextResponse.json(newPatient, { status: 201 });
  } catch (error) {
    console.error('Error registering patient:', error);
    return NextResponse.json({ message: 'Failed to register patient' }, { status: 500 });
  }
};

export const GET = async (req: Request) => {
  await connectToDatabase();
  const url = new URL(req.url);
  const doctorId = url.searchParams.get('doctorId');

  try {
    const patients = doctorId
      ? await Patient.find({ doctor: doctorId })
      : await Patient.find();

    return NextResponse.json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ message: 'Failed to fetch patients' }, { status: 500 });
  }
};
