import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Therapist } from '../types';

const Therapists: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        const data = await apiService.getTherapists();
        setTherapists(data);
      } catch (err) {
        setError('Failed to load therapists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  if (loading) return <div className="loading">Loading therapists...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="page-container">
      <h1>Therapists</h1>
      
      <div className="cards-grid">
        {therapists.map(therapist => (
          <div key={therapist.id} className="card">
            <h3>{therapist.name}</h3>
            <p><strong>Specialization:</strong> {therapist.specialization}</p>
            <p><strong>Email:</strong> {therapist.email}</p>
            <p><strong>Joined:</strong> {new Date(therapist.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Therapists;