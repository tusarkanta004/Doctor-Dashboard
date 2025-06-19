import { NextResponse } from 'next/server';
import Doctor from '@/models/Doctor';
import { connectToDatabase } from '@/utils/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    console.log("✅ Connected to MongoDB");

    const formData = await request.json();
    console.log("📥 Received form data:", formData);

    // ✅ Validate required fields
    const requiredFields = [
      'email', 'phone', 'password', 'licenseNumber', 'firstName', 'lastName'
    ];
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

    // ✅ Hash password
    //const hashedPassword = await bcrypt.hash(formData.password, 10);

    // ✅ Create new Doctor instance
    const newDoctor = new Doctor({
      ...formData,
      //password: hashedPassword,
fullName: formData.firstName && formData.lastName 
  ? `Dr.${formData.firstName} ${formData.lastName}` 
  : formData.firstName || formData.lastName || "Doctor"
    });

    // ✅ Save to DB
    const savedDoctor = await newDoctor.save();
    console.log("🎉 Doctor registered:", savedDoctor.email);

    return NextResponse.json({
      message: "Doctor registered successfully",
      doctorId: savedDoctor.doctorId,
    }, { status: 201 });

  } catch (error: any) {
    console.error("❌ Registration error:", error.message);
    return NextResponse.json({
      error: 'Server error',
      details: error.message
    }, { status: 500 });
  }
}
