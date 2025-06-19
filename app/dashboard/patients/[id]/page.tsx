'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  diagnosis: any;
  vitalSigns: any;
  medicalHistory: any;
  medications: any;
  allergies: string[];
}

export default function PatientDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<any>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previousPrescriptions, setPreviousPrescriptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("👤 Patient object:", patient);
      const patientRes = await fetch(`/api/patients/${id}`);
      const patientData = await patientRes.json();
      setPatient(patientData);

      const prescriptionsRes = await fetch(`/api/prescriptions/${id}`);
      const prescriptionsData = await prescriptionsRes.json();
      if (Array.isArray(prescriptionsData)) {
        setPreviousPrescriptions(prescriptionsData);
      }
    };
    fetchData();
  }, [id]);

  const handleGenerateSuggestion = async () => {
    console.log("💡 Generate AI Suggestion button clicked");

    if (!patient) {
      console.warn("No patient loaded yet");
      return;
    }

    setLoadingSuggestion(true);

    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: patient })
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("📦 AI Suggestion response:", data);

      if (data.suggestion) {
        setAiSuggestion(JSON.parse(data.suggestion));
      } else {
        console.warn("No suggestion found in response");
      }

    } catch (err) {
      console.error("❌ Error fetching AI suggestion:", err);
    } finally {
      setLoadingSuggestion(false);
    }
  };


  const handleSubmitPrescription = async () => {
    if (!patient || !aiSuggestion || !session?.user?.id) return;
    setSubmitting(true);
    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patient._id,
        doctorId: session.user.id,
        symptoms: aiSuggestion.symptoms.split(',').map((s: string) => s.trim()),
        diagnosis: aiSuggestion.diagnosis,
        medications: aiSuggestion.medications
      })
    });
    const data = await res.json();
    if (res.ok) {
      alert('✅ Prescription saved!');
      router.push('/dashboard');
    } else {
      alert(`❌ Error: ${data.message}`);
    }
    setSubmitting(false);
  };

  if (!patient) return <p className="p-5">Loading patient details...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>

      <button
        onClick={handleGenerateSuggestion}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loadingSuggestion ? 'Generating...' : '💡 Generate AI Suggestion'}
      </button>

      {aiSuggestion && (
        <div className="mt-6 p-4 bg-slate-100 rounded">
          <h2 className="text-xl font-semibold mb-3">AI Suggested Prescription</h2>

          <textarea
            value={aiSuggestion.symptoms}
            onChange={(e) => setAiSuggestion({ ...aiSuggestion, symptoms: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            rows={2}
            placeholder="Symptoms"
          />
          <textarea
            value={aiSuggestion.diagnosis}
            onChange={(e) => setAiSuggestion({ ...aiSuggestion, diagnosis: e.target.value })}
            className="w-full p-2 border rounded mb-2"
            rows={2}
            placeholder="Diagnosis"
          />
          <textarea
            value={JSON.stringify(aiSuggestion.medications, null, 2)}
            onChange={(e) =>
              setAiSuggestion({ ...aiSuggestion, medications: JSON.parse(e.target.value) })
            }
            className="w-full p-2 border rounded mb-2"
            rows={5}
            placeholder="Medications (JSON)"
          />

          <button
            onClick={handleSubmitPrescription}
            disabled={submitting}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
          >
            {submitting ? 'Saving...' : '💾 Save Prescription'}
          </button>
        </div>
      )}

      {previousPrescriptions.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">📜 Previous Prescriptions</h2>

          {previousPrescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="mb-5 p-3 bg-slate-50 rounded border border-slate-200"
            >
              <p className="text-sm text-slate-600 mb-1">
                <strong>By:</strong> {prescription.doctorId.fullName} ({prescription.doctorId.specializations.join(', ')})
              </p>
              <p className="text-sm text-slate-600 mb-2">
                <strong>Date:</strong> {new Date(prescription.createdAt).toLocaleString()}
              </p>
              <div className="mb-2">
                <strong>Symptoms:</strong> {prescription.symptoms.join(', ')}
              </div>
              <div className="mb-2">
                <strong>Diagnosis:</strong> {prescription.diagnosis}
              </div>
              <div className="mb-2">
                <strong>Medications:</strong>
                <ul className="list-disc ml-6">
                  {prescription.medications.map((med: any, index: number) => (
                    <li key={index}>
                      {med.name} - {med.dosage} ({med.instructions})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
