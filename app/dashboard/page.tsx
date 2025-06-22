'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IPatient } from '@/models/Patient';

interface IDoctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender?: string;
  dateOfBirth?: string;
  specializations?: string[];
  bio?: string;
  experience?: number;
  licenseNumber: string;
  medicalSchool?: string;
  graduationYear?: number;
  clinicName?: string;
  practiceAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  consultationFee?: number;
  medicalLicenseDocument?: string;
}

interface IMedication {
  name: string;
  dosage: string;
  instructions: string;
}

interface IAiSuggestion {
  symptoms: string;
  diagnosis: string;
  medications: IMedication[];
}

export default function Dashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<IAiSuggestion | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('doctor');
    router.push('/login');
  };

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
      instructions,
    };
    console.log('Prescription Payload:', payload);
    alert('Prescription submitted!');
  };

  const handleGenerateSuggestion = async () => {
    console.log("💡 AI Suggestion button clicked");
    setLoadingSuggestion(true);

    try {
      const res = await fetch('/api/ai-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientData: {
            name: "Test Patient",
            age: 35,
            gender: "Male",
            symptoms: ["Fever", "Headache"]
          }
        })
      });

      const data = await res.json();
      console.log("📦 AI Suggestion response:", data);

      if (data.suggestion) {
  const parsedSuggestion =
    typeof data.suggestion === 'string'
      ? JSON.parse(data.suggestion)
      : data.suggestion;

  setAiSuggestion(parsedSuggestion);
}
 else {
        alert("No AI suggestion received.");
      }

    } catch (err) {
      console.error("❌ Error fetching AI suggestion:", err);
      alert("Failed to fetch AI suggestion.");
    } finally {
      setLoadingSuggestion(false);
    }
  };


  return (
    <div className="p-5 min-h-screen">
      {/* Header */}
      <div className="bg-white mb-6 p-5 rounded-2xl flex justify-between items-center shadow relative">
        <div className="flex items-center gap-4">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Doctor Logo"
            width={48}
            height={48}
            className="h-12 w-12 rounded-xl"
          />
          <h1 className="text-xl font-bold text-blue-900">Doctor Dashboard</h1>
        </div>

        {/* Dropdown Trigger moved to Doctor Name */}
        <div
          className="text-right cursor-pointer relative"
          ref={dropdownRef}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <p className="font-semibold text-slate-900">
            Dr. {doctor?.firstName} {doctor?.lastName}
          </p>
          <p className="text-sm text-slate-500">
            {doctor?.specializations?.join(', ') || 'Specialist'}
          </p>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-48 z-10">
              <ul className="text-sm text-gray-700">
                <li>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="block px-4 py-2 hover:bg-blue-100 w-full text-left"
                  >
                    👤 Profile
                  </button>
                </li>

                <li
                  onClick={() => {
                    setDropdownOpen(false);
                    router.push('/change-password');
                  }}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-left"
                >
                  Change Password
                </li>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-red-100 text-red-600 font-medium cursor-pointer text-left"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>


      {/* Main Content */}
      <main>
        <section className="flex flex-col lg:flex-row gap-5">
          {/* Left Panel: Patient List */}
          <div className="bg-white p-4 rounded-xl shadow-md w-full lg:w-1/6 h-fit max-h-[calc(100vh-160px)] overflow-y-auto">
            <h3 className="text-lg font-bold text-blue-900 mb-4 text-center">Your Patients</h3>
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full p-2 mb-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <ul className="list-none p-0 m-0">
              {patients
                .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((p) => (
                  <li key={p._id}>
                    <button
                      onClick={() => handlePatientClick(p)}
                      className={`block w-full text-left p-3 rounded-lg mb-2 ${selectedPatient?._id === p._id
                        ? 'bg-blue-100 font-semibold'
                        : 'bg-slate-100'
                        } hover:bg-blue-100 transition`}
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Middle Panel: Patient Details */}
          <div className="bg-white p-5 rounded-xl shadow-md flex-[1.5] overflow-y-auto max-h-[calc(100vh-160px)]">
            {selectedPatient ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded shadow-sm">
                  <h2 className="text-xl font-bold text-blue-900 mb-2">🧑 {selectedPatient.name}</h2>
                  <p className="text-sm text-gray-700">
                    <strong>Age:</strong> {selectedPatient.age} &nbsp;|&nbsp;
                    <strong>Gender:</strong> {selectedPatient.gender} &nbsp;|&nbsp;
                    <strong>Blood Group:</strong> {selectedPatient.bloodGroup}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">📋 Contact Info</h3>
                  <p><strong>Phone:</strong> {selectedPatient.phone}</p>
                  <p><strong>Email:</strong> {selectedPatient.email}</p>
                  <p><strong>Address:</strong> {selectedPatient.address}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">🦠 Medical History</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedPatient.medicalHistory.length ? (
                      selectedPatient.medicalHistory.map((entry, idx) => (
                        <li key={idx}>{entry.notes} – {entry.year}</li>
                      ))
                    ) : (
                      <li>No history available</li>
                    )}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">🩺 Diagnosis / Symptoms</h3>
                  <p><strong>Primary:</strong> {selectedPatient.diagnosis?.primary || 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedPatient.diagnosis?.status || 'N/A'}</p>
                </div>

                <div className="bg-blue-50 p-4 rounded shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">💊 Medications</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {selectedPatient.medications.length ? (
                      selectedPatient.medications.map((med, idx) => (
                        <li key={idx}>
                          <strong>{med.name}</strong> – {med.dosage}, {med.instructions}
                        </li>
                      ))
                    ) : (
                      <li>No medications listed</li>
                    )}
                  </ul>
                </div>

                <div className="bg-blue-50 p-4 rounded shadow-sm">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">📌 Allergies</h3>
                  <p>{selectedPatient.allergies.length ? selectedPatient.allergies.join(', ') : 'None'}</p>
                </div>

                {/* Vital Signs Section */}
                <div className="bg-blue-100 p-4 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-blue-900 mb-4"> 💓 Latest Vital Signs</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <span className="font-semibold">BP:</span> {selectedPatient.vitalSigns?.bloodPressure || 'N/A'}
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <span className="font-semibold">Heart Rate:</span> {selectedPatient.vitalSigns?.pulse || 'N/A'} bpm
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <span className="font-semibold">Temperature:</span> {selectedPatient.vitalSigns?.temperature || 'N/A'}
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <span className="font-semibold">Weight:</span> {selectedPatient.vitalSigns?.weight || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-24">
                <h2 className="text-2xl font-bold text-blue-900 mb-4">
                  Select a patient to view details
                </h2>
                <p className="text-gray-600">Choose a patient from the left panel.</p>
              </div>
            )}
          </div>

          {/* Prescription Form Section */}
          <div className="bg-white p-5 rounded-xl shadow-md flex-1 overflow-y-auto max-h-[calc(100vh-160px)]">
            <h3 className="text-xl font-bold text-center mb-4 text-blue-900">📝 Generate Prescription</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="Diagnosis / Symptoms"
                className="col-span-2 p-2 border border-gray-300 rounded"
              />
              <input
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="Medication (e.g. Metoprolol)"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                value={strength}
                onChange={(e) => setStrength(e.target.value)}
                placeholder="Strength (e.g. 25mg)"
                className="p-2 border border-gray-300 rounded"
              />
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="p-2 border border-gray-300 rounded"
              >
                <option value="">Frequency</option>
                <option value="Once a day">Once a day</option>
                <option value="Twice a day">Twice a day</option>
                <option value="Thrice a day">Thrice a day</option>
              </select>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Duration (e.g. 7 days)"
                className="p-2 border border-gray-300 rounded"
              />
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity (e.g. 14 tablets)"
                className="p-2 border border-gray-300 rounded"
              />
              <div className="col-span-2 flex gap-6 items-center">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="meal"
                    value="Before Meal"
                    checked={meal === 'Before Meal'}
                    onChange={() => setMeal('Before Meal')}
                  />
                  Before Meal
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="meal"
                    value="After Meal"
                    checked={meal === 'After Meal'}
                    onChange={() => setMeal('After Meal')}
                  />
                  After Meal
                </label>
              </div>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Additional Instructions..."
                className="col-span-2 p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={handlePrescriptionSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                ✅ Send to Patient
              </button>

              <button
                onClick={handleGenerateSuggestion}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
              >
                {loadingSuggestion ? 'Generating...' : '💡 Generate AI Suggestion'}
              </button>

              {aiSuggestion && (
                <div className="mt-6 p-4 bg-slate-100 rounded border border-slate-200">
                  <h2 className="text-lg font-bold mb-2">💊 AI Suggested Prescription:</h2>

                  <div className="mb-2">
                    <strong>Symptoms:</strong> {aiSuggestion.symptoms}
                  </div>
                  <div className="mb-2">
                    <strong>Diagnosis:</strong> {aiSuggestion.diagnosis}
                  </div>
                  <div>
                    <strong>Medications:</strong>
                    <ul className="list-disc ml-6 mt-1">
{aiSuggestion.medications.map((med, index) => (
                        <li key={index}>
                          {med.name} - {med.dosage} ({med.instructions})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}


            </div>
          </div>

        </section>
      </main>
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-[90%] max-w-3xl p-6 rounded-xl relative shadow-lg overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowProfileModal(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>

            {/* Doctor Info */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center text-3xl font-bold text-blue-800 uppercase">
                {doctor?.firstName?.charAt(0)}{doctor?.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-blue-900">
                  Dr. {doctor?.firstName} {doctor?.lastName}
                </h2>
                <p className="text-gray-600">{doctor?.specializations?.join(', ')}</p>
                <p className="text-sm text-blue-800 mt-1">{doctor?.bio}</p>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <p><strong>Email:</strong> {doctor?.email}</p>
              <p><strong>Phone:</strong> {doctor?.phone}</p>
              <p><strong>Gender:</strong> {doctor?.gender}</p>
              <p><strong>Date of Birth:</strong> {doctor?.dateOfBirth?.substring(0, 10)}</p>
              <p><strong>Experience:</strong> {doctor?.experience} years</p>
              <p><strong>License No:</strong> {doctor?.licenseNumber}</p>
              <p><strong>Graduation:</strong> {doctor?.medicalSchool} ({doctor?.graduationYear})</p>
              <p><strong>Clinic:</strong> {doctor?.clinicName}</p>
              <p><strong>Address:</strong> {doctor?.practiceAddress}, {doctor?.city}, {doctor?.state} - {doctor?.zipCode}</p>
              <p><strong>Consultation Fee:</strong> ₹{doctor?.consultationFee}</p>
              <p><strong>License Document:</strong>{' '}
                <a href={doctor?.medicalLicenseDocument} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  View PDF
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
