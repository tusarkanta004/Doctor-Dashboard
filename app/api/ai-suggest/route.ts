import { NextResponse } from 'next/server';

interface Medication {
  name: string;
  dosage: string;
  instructions: string;
}

interface PrescriptionSuggestion {
  symptoms: string;
  diagnosis: string;
  medications: Medication[];
}

interface RequestBody {
  patientData: Record<string, unknown>;
}

// POST /api/ai-suggest
export async function POST(req: Request): Promise<Response> {
  try {
    const body: RequestBody = await req.json();

    if (!body.patientData) {
      return NextResponse.json(
        { error: 'No patient data provided' },
        { status: 400 }
      );
    }

    const suggestion: PrescriptionSuggestion = {
      symptoms: "High fever, nausea, headache",
      diagnosis: "Likely Viral Fever",
      medications: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          instructions: "Twice a day after meals",
        },
        {
          name: "ORS Solution",
          dosage: "1 sachet in 500ml water",
          instructions: "After each loose motion",
        },
      ],
    };

    return NextResponse.json({ suggestion }, { status: 200 });

  } catch (error) {
    console.error('Mock AI suggestion error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Server error', details: message },
      { status: 500 }
    );
  }
}
