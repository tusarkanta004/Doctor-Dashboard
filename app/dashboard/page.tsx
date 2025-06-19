
'use client';

import React, { useState, useEffect } from 'react';
import { IPatient } from '@/models/Patient';

export default function Dashboard() {
  const [doctor, setDoctor] = useState<any>(null);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Prescription form state
  const [condition, setCondition] = useState('');
  const [medication, setMedication] = useState('');
  const [strength, setStrength] = useState('');
  const [frequency, setFrequency] = useState('');
  const [duration, setDuration] = useState('');
  const [quantity, setQuantity] = useState('');
  const [meal, setMeal] = useState('Before Meal');
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      const parsedDoctor = JSON.parse(storedDoctor);
      setDoctor(parsedDoctor);

      fetch(`/api/patients?doctorId=${parsedDoctor._id}`)
        .then((res) => res.json())
        .then((data) => setPatients(data))
        .catch((err) => console.error('Failed to fetch patients', err));
    }
  }, []);

  const handlePatientClick = (patient: IPatient) => {
    setSelectedPatient(patient);
  };

  const handlePrescriptionSubmit = () => {
    const payload = {
      doctorId: doctor?._id,
      patientId: selectedPatient?._id,
      condition,
      medication,
      strength,
      frequency,
      duration,
      quantity,
      meal,
      instructions
    };

    console.log('Send prescription:', payload);
    alert('Prescription sent successfully!');
  };

  return (
    <div className="p-5">
      {/* Topbar */}
      <div className="bg-white mb-8 p-5 rounded-2xl flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Doctor Logo"
            className="h-12 w-12 rounded-xl"
          />
          <h1 className="text-xl font-bold text-blue-900">Doctor Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <p className="font-semibold text-slate-900">
              Dr. {doctor?.firstName} {doctor?.lastName}
            </p>
            <p className="text-sm text-slate-500">
              {doctor?.specializations?.join(', ') || 'Specialist'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex gap-5 max-h-[calc(100vh-180px)] overflow-hidden">
        {/* Left Panel: Patient List */}
        <div className="bg-white p-5 rounded-xl shadow-md w-56 flex-shrink-0 overflow-y-auto">
          <h3 className="text-lg font-bold text-blue-900 mb-4 text-center">Your Patients</h3>
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full p-2 mb-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="list-none p-0 m-0">
            {patients
              .filter((patient) =>
                patient.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((patient) => (
                <li key={patient._id as string}>
                  <button
                    onClick={() => handlePatientClick(patient)}
                    className={`block w-full text-left p-3 rounded-lg mb-2 ${
                      selectedPatient?._id === patient._id ? 'bg-blue-100 font-semibold' : 'bg-slate-100'
                    } hover:bg-blue-100 transition`}
                  >
                    {patient.name}
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {selectedPatient ? (
          <>
            {/* Middle Panel: Patient Details */}
            <div className="bg-white p-5 rounded-xl shadow-md flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold text-blue-900 mb-2">🧑 {selectedPatient.name}</h2>
                  <p className="text-sm text-gray-600">
                    <strong>Age:</strong> {selectedPatient.age} &nbsp; | &nbsp;
                    <strong>Gender:</strong> {selectedPatient.gender} &nbsp; | &nbsp;
                    <strong>Blood Group:</strong> {selectedPatient.bloodGroup}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">📋 Contact Info</h3>
                  <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                  <p><strong>Email:</strong> {selectedPatient.email}</p>
                  <p><strong>Address:</strong> {selectedPatient.address}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">🦠 Medical History</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedPatient.medicalHistory.map((entry, index) => (
                      <li key={index}>
                        {entry.notes} – {entry.year}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">💊 Medications</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedPatient.medications.map((med, index) => (
                      <li key={index}>
                        <strong>{med.name}</strong> – {med.dosage}, {med.instructions}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">📌 Allergies</h3>
                  <p>{selectedPatient.allergies.join(', ') || 'None'}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">💓 Vital Signs</h3>
                  <p><strong>Blood Pressure:</strong> {selectedPatient.vitalSigns.bloodPressure}</p>
                  <p><strong>Pulse:</strong> {selectedPatient.vitalSigns.pulse} bpm</p>
                  <p><strong>Temperature:</strong> {selectedPatient.vitalSigns.temperature}</p>
                  <p><strong>Weight:</strong> {selectedPatient.vitalSigns.weight}</p>
                </div>
              </div>
            </div>

            {/* Right Panel: Prescription Form */}
            <div className="bg-white p-5 rounded-xl shadow-md w-[400px] flex-shrink-0 overflow-y-auto max-h-[calc(100vh-180px)]">
              <h3 className="text-xl font-bold text-center mb-4 text-blue-900">📝 Generate Prescription</h3>
              <div className="grid grid-cols-1 gap-4">
                <textarea value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Diagnosis / Symptoms" className="p-2 border border-gray-300 rounded" />
                <input value={medication} onChange={(e) => setMedication(e.target.value)} placeholder="Medication (e.g. Metoprolol)" className="p-2 border border-gray-300 rounded" />
                <input value={strength} onChange={(e) => setStrength(e.target.value)} placeholder="Strength (e.g. 25mg)" className="p-2 border border-gray-300 rounded" />
                <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="p-2 border border-gray-300 rounded">
                  <option value="">Frequency</option>
                  <option value="Once a day">Once a day</option>
                  <option value="Twice a day">Twice a day</option>
                  <option value="Thrice a day">Thrice a day</option>
                </select>
                <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (e.g. 7 days)" className="p-2 border border-gray-300 rounded" />
                <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity (e.g. 14 tablets)" className="p-2 border border-gray-300 rounded" />
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input type="radio" name="meal" value="Before Meal" checked={meal === 'Before Meal'} onChange={() => setMeal('Before Meal')} /> Before Meal
                  </label>
                  <label className="flex items-center gap-1">
                    <input type="radio" name="meal" value="After Meal" checked={meal === 'After Meal'} onChange={() => setMeal('After Meal')} /> After Meal
                  </label>
                </div>
                <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Additional Instructions..." className="p-2 border border-gray-300 rounded" />
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <button onClick={handlePrescriptionSubmit} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">✅ Send to Patient</button>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">💡 Get AI Suggestion</button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 text-center flex items-center justify-center">
            <div>
              <h2 className="text-2xl font-bold text-blue-900 mb-3 tracking-wide">
                Select a patient to view details
              </h2>
              <p className="text-slate-600">Choose a patient from the left panel.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
