'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
}

export default function PatientDetailsPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');

  useEffect(() => {
    const fetchPatient = async () => {
      const res = await fetch(`/api/patients/${id}`);
      const data = await res.json();
      setPatient(data);
    };
    fetchPatient();
  }, [id]);

  const handlePrescriptionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/prescriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patientId: patient?._id,
        symptoms,
        diagnosis,
        prescription
      })
    });

    if (res.ok) {
      alert('Prescription submitted successfully!');
      setSymptoms('');
      setDiagnosis('');
      setPrescription('');
    } else {
      alert('Failed to submit prescription.');
    }
  };

  if (!patient) return <p className="p-6">Loading patient details…</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{patient.name}</h1>
      <p className="mb-1">Age: {patient.age}</p>
      <p className="mb-6">Gender: {patient.gender}</p>

      <h2 className="text-xl font-bold mb-3">Generate Prescription</h2>
      <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
        <textarea
          placeholder="Symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded"
          required
        />

        <textarea
          placeholder="Diagnosis"
          value={diagnosis}
          onChange={(e) => setDiagnosis(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded"
          required
        />

        <textarea
          placeholder="Prescription"
          value={prescription}
          onChange={(e) => setPrescription(e.target.value)}
          className="w-full p-2 border border-slate-300 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Prescription
        </button>
      </form>
    </div>
  );
}
