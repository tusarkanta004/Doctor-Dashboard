'use client';
import React, { useState } from 'react';
import styles from './dashboard.module.css';

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
  return (
    <div className={styles.container}>
      {/* Topbar */}
      <div className={styles.topbar}>
        <div className={styles.brand}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
            alt="Doctor Logo"
            className={styles.logo}
          />
          <h1>N6T TECHNOLOGY Doctor Dashboard</h1>
        </div>
        <div className={styles.profile}>
          <div>
            <p className={styles.name}>Dr. Sarah Wilson</p>
            <p className={styles.speciality}>Internal Medicine</p>
          </div>
          <div className={styles.avatar}>SW</div>
        </div>
      </div>

      {/* Main Content */}
      <main className={styles.main}>
        <section className={styles.content}>
          <div className={styles['section-left']}>
            {/* Patient List Panel */}
            <div className={styles['patient-list']}>
              <h3>Patients</h3>
              <input
                type="text"
                placeholder="Search patients..."
                className={styles['patient-search']}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <ul>
                {patients
                  .filter((p) =>
                    p.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((patient) => (
                    <li
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={patient.name === selectedPatient.name ? styles.active : ''}
                    >
                      {patient.name}
                    </li>
                  ))}
              </ul>

            </div>
            {/* Left Panel */}
            <div className={styles['left-panel']}>
              <h2>Patient Details</h2>

              <div className={styles['info-box']}>
                <div className={styles['patient-card']}>
                  <img
                    src="https://ui-avatars.com/api/?name=James+Wilson&background=3b82f6&color=fff&rounded=true&size=70"
                    alt="Patient Avatar"
                  />
                  <div className={styles['patient-card-details']}>
                    <h3>James Wilson</h3>
                    <div className={styles['patient-meta']}>
                      <p><strong>Age:</strong> 28</p>
                      <p><strong>Gender:</strong> Male</p>
                    </div>
                    <div className={styles['patient-meta']}>
                      <p><strong>ID:</strong> P002-2024</p>
                      <p><strong>Blood Type:</strong> O-</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className={styles['info-box']}>
                <h4>Contact Info</h4>
                <p>📞 +1 (555) 234-5678</p>
                <p>📧 james.wilson@email.com</p>
                <p>📍 456 Pine St, Los Angeles, CA 90210</p>
              </div>

              <div className={styles['info-box']}>
                <h4>Medical History</h4>
                <p>🟢 Asthma (Controlled) – 2019</p>
              </div>

              <div className={styles['info-box']}>
                <h4>Current Medications</h4>
                <p>Albuterol inhaler <span className={styles.status}>Active</span></p>
              </div>

              <div className={`${styles['info-box']} ${styles['allergy-box']}`}>
                <h4>Allergies</h4>
                <span className={styles.tag}>Pollen</span>
              </div>

              <div className={styles['info-box']}>
                <h4 className={styles['info-title']}>Latest Vital Signs</h4>
                <div className={styles['vital-grid']}>
                  <div><strong>BP:</strong> 118/75</div>
                  <div><strong>Heart Rate:</strong> 68 bpm</div>
                  <div><strong>Temperature:</strong> 98.4°F</div>
                  <div><strong>Weight:</strong> 175 lbs</div>
                </div>
              </div>



            </div>
          </div>
          {/* Right Panel */}
          <div className={styles['right-panel']}>
            <h2>AI Prescription Generator <span className={styles.badge}>MCP Enhanced</span></h2>
            <textarea rows={2} defaultValue="Hypertension, vomiting" />

            <form id="prescriptionForm">
              <div className={styles['med-row']}>
                <input type="text" placeholder="Medication (e.g. Metoprolol)" />
                <input type="text" placeholder="Strength (e.g. 25mg)" />
              </div>
              <div className={styles['med-row']}>
                <select>
                  <option>Frequency</option>
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Thrice daily</option>
                </select>
                <input type="text" placeholder="Duration(e.g. 30days)" />
                <input type="text" placeholder="Quantity(e.g. 60tabs)" />
                <div className={styles['dosage-group']}>
                  <label>
                    <input type="radio" name="dosage" value="before" />
                    Before Meal
                  </label>
                  <label>
                    <input type="radio" name="dosage" value="after" />
                    After Meal
                  </label>
                </div>
              </div>

              <textarea rows={2} placeholder="Additional instructions..."></textarea>
              <button type="button" className={styles.add}>+ Add Another Medication</button>
              <div className={styles['form-buttons']}>
                <button type="submit" className={styles.save}>💾 Save Prescription</button>
                <button type="button" className={styles.send}>📤 Send to Pharmacy</button>
              </div>
            </form>

            <div className={styles.recent}>
              <h3>Recent Prescriptions</h3>
              <p>No prescriptions found for this patient</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
