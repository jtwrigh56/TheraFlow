import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Patient } from '../types';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await apiService.getPatients();
        setPatients(data);
      } catch (err) {
        setError('Failed to load patients');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) return <div className="loading">Loading patients...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <h1>Patients</h1>
      
      <div className="cards-grid">
        {patients.map(patient => (
          <div key={patient.id} className="card">
            <h3>{patient.name}</h3>
            <p><strong>Email:</strong> {patient.email}</p>
            {patient.phone && <p><strong>Phone:</strong> {patient.phone}</p>}
            {patient.dateOfBirth && (
              <p><strong>Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
            )}
            <p><strong>Registered:</strong> {new Date(patient.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Patients;