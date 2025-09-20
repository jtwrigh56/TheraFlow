import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Session, Therapist, Patient } from '../types';
import './Sessions.css';

const Sessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    therapistId: '',
    patientId: '',
    dateTime: '',
    duration: 60,
    sessionType: 'Regular',
    notes: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsData, therapistsData, patientsData] = await Promise.all([
        apiService.getSessions(),
        apiService.getTherapists(),
        apiService.getPatients()
      ]);
      
      setSessions(sessionsData);
      setTherapists(therapistsData);
      setPatients(patientsData);
    } catch (err) {
      setError('Failed to load sessions data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createSession({
        therapistId: formData.therapistId,
        patientId: formData.patientId,
        dateTime: formData.dateTime,
        duration: formData.duration,
        sessionType: formData.sessionType,
        notes: formData.notes
      });
      
      setFormData({
        therapistId: '',
        patientId: '',
        dateTime: '',
        duration: 60,
        sessionType: 'Regular',
        notes: ''
      });
      setShowForm(false);
      fetchData(); // Refresh the list
    } catch (err) {
      setError('Failed to create session');
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value
    }));
  };

  if (loading) return <div className="loading">Loading sessions...</div>;
  if (error) return <div className="error">{error}</div>;

  // Sort sessions by date/time
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );

  return (
    <div className="sessions">
      <div className="sessions-header">
        <h1>Therapy Sessions</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Schedule Session'}
        </button>
      </div>

      {showForm && (
        <div className="session-form">
          <h2>Schedule New Session</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="therapistId">Therapist:</label>
              <select
                id="therapistId"
                name="therapistId"
                value={formData.therapistId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a therapist</option>
                {therapists.map(therapist => (
                  <option key={therapist.id} value={therapist.id}>
                    {therapist.name} - {therapist.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="patientId">Patient:</label>
              <select
                id="patientId"
                name="patientId"
                value={formData.patientId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a patient</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dateTime">Date & Time:</label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration (minutes):</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="15"
                max="180"
                step="15"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="sessionType">Session Type:</label>
              <select
                id="sessionType"
                name="sessionType"
                value={formData.sessionType}
                onChange={handleInputChange}
              >
                <option value="Regular">Regular</option>
                <option value="Initial Assessment">Initial Assessment</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Group Session">Group Session</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes:</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Additional notes for the session..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Schedule Session
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="sessions-list">
        {sortedSessions.length === 0 ? (
          <p>No sessions scheduled yet.</p>
        ) : (
          <div className="sessions-grid">
            {sortedSessions.map(session => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <div className="session-date">
                    {new Date(session.dateTime).toLocaleDateString()}
                  </div>
                  <div className="session-time">
                    {new Date(session.dateTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className={`session-status ${session.status.toLowerCase()}`}>
                    {session.status}
                  </div>
                </div>
                
                <div className="session-body">
                  <div className="session-participants">
                    <div className="participant">
                      <strong>Patient:</strong> {session.patientName}
                    </div>
                    <div className="participant">
                      <strong>Therapist:</strong> {session.therapistName}
                    </div>
                  </div>
                  
                  <div className="session-details">
                    <div className="detail">
                      <strong>Duration:</strong> {session.duration} minutes
                    </div>
                    <div className="detail">
                      <strong>Type:</strong> {session.sessionType}
                    </div>
                  </div>
                  
                  {session.notes && (
                    <div className="session-notes">
                      <strong>Notes:</strong> {session.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;