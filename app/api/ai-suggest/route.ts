// import { NextResponse } from 'next/server';
// import OpenAI from 'openai';
// import { connectToDatabase } from '@/utils/db';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!
// });

// export async function POST(req: Request) {
//   try {
//     await connectToDatabase();

//     const { patientData } = await req.json();

//     if (!patientData) {
//       return NextResponse.json(
//         { error: 'No patient data provided' },
//         { status: 400 }
//       );
//     }

//     const prompt = `You are an experienced medical AI assistant. Based on the following patient data, suggest a prescription plan.

// Patient Data:
// ${JSON.stringify(patientData, null, 2)}

// Provide a suggested prescription in structured JSON like:
// {
//   "symptoms": "string, comma separated",
//   "diagnosis": "string",
//   "medications": [
//     {
//       "name": "string",
//       "dosage": "string",
//       "instructions": "string"
//     }
//   ]
// }`;

//     const aiResponse = await openai.chat.completions.create({
//       model: 'gpt-4',
//       messages: [{ role: 'user', content: prompt }],
//       temperature: 0.5
//     });

//     const suggestion = aiResponse.choices[0].message?.content;

//     return NextResponse.json({ suggestion }, { status: 200 });

//   } catch (error: any) {
//     console.error('AI suggestion error:', error);
//     return NextResponse.json(
//       { error: 'AI suggestion failed', details: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';

// POST /api/ai-suggest
export async function POST(req: Request) {
  try {
    const { patientData } = await req.json();

    if (!patientData) {
      return NextResponse.json(
        { error: 'No patient data provided' },
        { status: 400 }
      );
    }

    // Dummy AI suggestion response for testing
    const suggestion = JSON.stringify({
      symptoms: "High fever, nausea, headache",
      diagnosis: "Likely Viral Fever",
      medications: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          instructions: "Twice a day after meals"
        },
        {
          name: "ORS Solution",
          dosage: "1 sachet in 500ml water",
          instructions: "After each loose motion"
        }
      ]
    }, null, 2);

    return NextResponse.json({ suggestion }, { status: 200 });

  } catch (error: any) {
    console.error('Mock AI suggestion error:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}
