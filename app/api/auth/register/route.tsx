import { NextResponse } from 'next/server';
import Doctor from '@/models/Doctor';
import { connectToDatabase } from '@/utils/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const formData = await request.json();

    const existingEmail = await Doctor.findOne({ email: formData.email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    const existingPhone = await Doctor.findOne({ phone: formData.phone });
    if (existingPhone) {
      return NextResponse.json(
        { error: 'Phone number already exists' },
        { status: 400 }
      );
    }

    // Check if license number already exists
    const existingLicense = await Doctor.findOne({ licenseNumber: formData.licenseNumber });
    if (existingLicense) {
      return NextResponse.json(
        { error: 'License number already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(formData.password, salt);

    // Create new doctor with hashed password
    const newDoctor = new Doctor({
      ...formData,
      password: hashedPassword,
      fullName: `${formData.firstName} ${formData.lastName}`
    });

    // Save to database
    await newDoctor.save();

    return NextResponse.json(
      { 
        message: 'Doctor registered successfully!',
        doctorId: newDoctor.doctorId 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

// Optional: GET request handler to check if email/phone exists
export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (email) {
      const exists = await Doctor.findOne({ email });
      return NextResponse.json({ exists: !!exists });
    }

    if (phone) {
      const exists = await Doctor.findOne({ phone });
      return NextResponse.json({ exists: !!exists });
    }

    return NextResponse.json(
      { error: 'No email or phone provided' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error checking existence:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}