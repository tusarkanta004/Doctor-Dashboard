'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const initialPatients = [
    { name: 'James Wilson', age: 28, gender: 'Male', id: 'P002-2024', bloodType: 'O-' },
    { name: 'Sarah Johnson', age: 34, gender: 'Female', id: 'P003-2024', bloodType: 'A+' },
    { name: 'Michael Lee', age: 41, gender: 'Male', id: 'P004-2024', bloodType: 'B+' },
    { name: 'Riya Sharma', age: 25, gender: 'Female', id: 'P005-2024', bloodType: 'AB-' },
  ];

  const [patients, setPatients] = useState(initialPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(initialPatients[0]);
  const [medications, setMedications] = useState([{ name: '', strength: '' }]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const addMedication = () => {
    setMedications([...medications, { name: '', strength: '' }]);
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
          <h1 className="text-xl font-bold text-blue-900">N6T TECHNOLOGY Doctor Dashboard</h1>
        </div>
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div>
              <p className="font-semibold text-slate-900">Dr. Sarah Wilson</p>
              <p className="text-sm text-slate-500">Internal Medicine</p>
            </div>
            <div className="bg-blue-500 text-white font-semibold h-10 w-10 rounded-full flex items-center justify-center">
              SW
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
              <ul className="py-2 text-sm text-slate-700">
                <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">View Profile</li>
                <li className="px-4 py-2 hover:bg-blue-50 cursor-pointer">Change Password</li>
                <li
                  className="px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer"
                  onClick={() => router.push('/login')}
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
        <section className="flex gap-5 h-[calc(100vh-160px)] overflow-hidden">          {/* Patient List Panel */}
          <div className="bg-white p-5 rounded-xl shadow-md w-64 h-full overflow-y-auto">            <h3 className="text-lg font-bold text-blue-900 mb-4 text-center">Patients</h3>
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full p-2 mb-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <ul className="list-none p-0 m-0">
              {patients
                .filter((p) =>
                  p.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((patient) => (
                  <li
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-all ${patient.name === selectedPatient.name
                      ? 'bg-blue-500 text-white font-semibold'
                      : 'bg-slate-100 hover:bg-blue-100'
                      }`}
                  >
                    {patient.name}
                  </li>
                ))}
            </ul>
          </div>

          {/* Left Panel */}
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 h-full overflow-y-auto">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center tracking-wide">
              Patient Details
            </h2>

            <div className="bg-gradient-to-tr from-blue-50 to-blue-100 p-4 rounded-xl mb-5 shadow-sm">
              <div className="flex items-center gap-4 my-5 bg-blue-50 p-3 rounded-lg shadow-sm">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedPatient.name
                  )}&background=3b82f6&color=fff&rounded=true&size=70`}
                  alt="Patient Avatar"
                  className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedPatient.name}</h3>
                  <div className="flex justify-between gap-5 text-sm mb-1">
                    <p><strong>Age:</strong> {selectedPatient.age}</p>
                    <p><strong>Gender:</strong> {selectedPatient.gender}</p>
                  </div>
                  <div className="flex justify-between gap-5 text-sm">
                    <p><strong>ID:</strong> {selectedPatient.id}</p>
                    <p><strong>Blood Type:</strong> {selectedPatient.bloodType}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-tr from-blue-50 to-blue-100 p-4 rounded-xl mb-5 shadow-sm">
              <h4 className="text-lg font-bold text-blue-900 mb-3">Contact Info</h4>
              <p className="mb-1">📞 +1 (555) 234-5678</p>
              <p className="mb-1">📧 james.wilson@email.com</p>
              <p>📍 456 Pine St, Los Angeles, CA 90210</p>
            </div>

            <div className="bg-gradient-to-tr from-blue-50 to-blue-100 p-4 rounded-xl mb-5 shadow-sm">
              <h4 className="text-lg font-bold text-blue-900 mb-3">Medical History</h4>
              <p>🟢 Asthma (Controlled) – 2019</p>
            </div>

            <div className="bg-gradient-to-tr from-blue-50 to-blue-100 p-4 rounded-xl mb-5 shadow-sm">
              <h4 className="text-lg font-bold text-blue-900 mb-3">Current Medications</h4>
              <p>Albuterol inhaler <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">Active</span></p>
            </div>

            <div className="bg-gradient-to-tr from-blue-50 to-blue-100 p-4 rounded-xl mb-5 shadow-sm">
              <h4 className="text-lg font-bold text-blue-900 mb-3">Allergies</h4>
              <span className="bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full inline-block">
                Pollen
              </span>
            </div>

            <div className="bg-gradient-to-tr from-blue-50 to-blue-100 p-4 rounded-xl mb-5 shadow-sm">
              <h4 className="text-lg font-bold text-blue-900 mb-3">Latest Vital Signs</h4>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white p-3 rounded-lg shadow-xs">
                  <strong>BP:</strong> 118/75
                </div>
                <div className="bg-white p-3 rounded-lg shadow-xs">
                  <strong>Heart Rate:</strong> 68 bpm
                </div>
                <div className="bg-white p-3 rounded-lg shadow-xs">
                  <strong>Temperature:</strong> 98.4°F
                </div>
                <div className="bg-white p-3 rounded-lg shadow-xs">
                  <strong>Weight:</strong> 175 lbs
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-white p-6 rounded-xl shadow-md w-96 h-full overflow-y-auto">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-5 text-center tracking-wide uppercase">
              Generate Prescription
            </h2>
            <textarea
              rows={2}
              defaultValue="Hypertension, vomiting"
              className="w-full mt-3 p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
            />

            <form id="prescriptionForm" className="mt-4">
              {medications.map((med, index) => (
                <div key={index} className="mb-4">
                  <div className="flex flex-col gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Medication (e.g. Metoprolol)"
                      className="flex-1 p-2 border border-slate-200 rounded-md bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Strength (e.g. 25mg)"
                      className="flex-1 p-2 border border-slate-200 rounded-md bg-slate-50"
                    />
                  </div>
                  <div className="flex flex-col gap-3 mb-3">
                    <select className="flex-1 p-2 border border-slate-200 rounded-md bg-slate-50">
                      <option>Frequency</option>
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Thrice daily</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Duration(e.g. 30days)"
                      className="flex-1 p-2 border border-slate-200 rounded-md bg-slate-50"
                    />
                    <input
                      type="text"
                      placeholder="Quantity(e.g. 60tabs)"
                      className="flex-1 p-2 border border-slate-200 rounded-md bg-slate-50"
                    />
                  </div>
                  <div className="flex gap-2 items-center p-1 border border-slate-200 rounded-md bg-slate-50 h-10">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name={`dosage-${index}`}
                        value="before"
                        className="accent-blue-500 cursor-pointer scale-95"
                      />
                      Before Meal
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name={`dosage-${index}`}
                        value="after"
                        className="accent-blue-500 cursor-pointer scale-95"
                      />
                      After Meal
                    </label>
                  </div>
                </div>
              ))}

              <textarea
                rows={2}
                placeholder="Additional instructions..."
                className="w-full mt-3 p-2 border border-slate-200 rounded-md bg-slate-50 text-slate-800 focus:outline-none focus:border-blue-500"
              ></textarea>
              <button
                type="button"
                onClick={addMedication}
                className="w-full mt-3 p-1 border border-dashed border-blue-500 text-blue-900 rounded-md hover:bg-blue-50 transition-colors"
              >
                + Add Another Medication
              </button>
              <div className="flex gap-3 mt-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white p-2 border-none rounded-md font-medium hover:bg-blue-600"
                >
                  Get AI Suggestion
                </button>
                <button
                  type="button"
                  className="flex-1 bg-green-600 text-white p-2 border-none rounded-md font-medium hover:bg-green-700"
                >
                  📤 Send to Patient
                </button>
              </div>
            </form>

            <div className="mt-5 italic text-slate-500">
              <h3 className="text-lg font-semibold mb-2 not-italic">Recent Prescriptions</h3>
              <p>No prescriptions found for this patient</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}