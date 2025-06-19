'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { IPatient } from '@/models/Patient';

export default function Dashboard() {
  const [doctor, setDoctor] = useState<any>(null);
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load doctor from localStorage
  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      const parsedDoctor = JSON.parse(storedDoctor);
      console.log("Loaded doctor:", parsedDoctor);
      setDoctor(parsedDoctor);
    }
  }, []);

  // Fetch patients based on doctor ID
  useEffect(() => {
  const fetchPatients = async () => {
    if (doctor?._id) {
      console.log("🔍 Fetching patients for doctor:", doctor._id);
      const res = await fetch(`/api/patients?doctorId=${doctor._id}`);
      const data = await res.json();
      console.log("📋 Patients fetched:", data);
      setPatients(data);
    }
  };

  fetchPatients();
}, [doctor?._id]);


  console.log("👨‍⚕️ Doctor ID:", doctor?._id);
  useEffect(() => {
  console.log("🧑‍⚕️ Doctor loaded:", doctor);
  console.log("🧾 Patients:", patients);
}, [doctor, patients]);

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
              {doctor?.specializations?.join(', ') || 'Your Speciality'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        <section className="flex flex-col lg:flex-row gap-5">
          {/* Patient List Panel */}
          <div className="bg-white p-5 rounded-xl shadow-md w-full lg:w-64 h-fit max-h-[calc(100vh-160px)] overflow-y-auto">
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
                    <Link
                      href={`/dashboard/patients/${patient._id as string}`}
                      className="block p-3 rounded-lg mb-2 bg-slate-100 hover:bg-blue-100 transition"
                    >
                      {patient.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Right Panel */}
          <div className="bg-white p-6 rounded-xl shadow-md flex-1 text-center">
            <h2 className="text-2xl font-bold text-blue-900 mb-6 tracking-wide">
              Select a patient to view details
            </h2>
            <p className="text-slate-600">Choose a patient from the left panel.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
