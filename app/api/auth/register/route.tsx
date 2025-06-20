import { NextResponse } from 'next/server';
import Doctor from '@/models/Doctor';
import { connectToDatabase } from '@/utils/db';
// import bcrypt from 'bcryptjs'; // Uncomment if using password hashing

interface DoctorFormData {
  email: string;
  phone: string;
  password: string;
  licenseNumber: string;
  firstName?: string;
  lastName?: string;
  [key: string]: string | undefined;
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    console.log("✅ Connected to MongoDB");

    const formData: DoctorFormData = await request.json();
    console.log("📥 Received form data:", formData);

    // ✅ Validate required fields
    const requiredFields = ['email', 'phone', 'password', 'licenseNumber', 'firstName', 'lastName'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // ✅ Check if email, phone, or license already exists
    const [existingEmail, existingPhone, existingLicense] = await Promise.all([
      Doctor.findOne({ email: formData.email }),
      Doctor.findOne({ phone: formData.phone }),
      Doctor.findOne({ licenseNumber: formData.licenseNumber }),
    ]);

    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    if (existingPhone) {
      return NextResponse.json({ error: 'Phone number already exists' }, { status: 400 });
    }
    if (existingLicense) {
      return NextResponse.json({ error: 'License number already exists' }, { status: 400 });
    }

    // ✅ Optional: Hash password before saving
    // const hashedPassword = await bcrypt.hash(formData.password, 10);

    const newDoctor = new Doctor({
      ...formData,
      // password: hashedPassword,
      fullName:
        formData.firstName && formData.lastName
          ? `Dr.${formData.firstName} ${formData.lastName}`
          : formData.firstName || formData.lastName || "Doctor",
    });

    const savedDoctor = await newDoctor.save();
    console.log("🎉 Doctor registered:", savedDoctor.email);

    return NextResponse.json(
      {
        message: "Doctor registered successfully",
        doctorId: savedDoctor.doctorId,
      },
      { status: 201 }
    );

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Registration error:", message);

    return NextResponse.json({
      error: 'Server error',
      details: message,
    }, { status: 500 });
  }
}
