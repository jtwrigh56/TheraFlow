import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Session, Therapist, Patient } from '../types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (error) return <div className="error">{error}</div>;

  // Get today's sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter(session => 
    session.dateTime.startsWith(today)
  );

  // Get upcoming sessions (next 7 days)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingSessions = sessions.filter(session => {
    const sessionDate = new Date(session.dateTime);
    return sessionDate > new Date() && sessionDate <= nextWeek;
  });

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Therapists</h3>
          <p className="stat-number">{therapists.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Patients</h3>
          <p className="stat-number">{patients.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <p className="stat-number">{sessions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Today's Sessions</h3>
          <p className="stat-number">{todaySessions.length}</p>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h2>Today's Sessions</h2>
          {todaySessions.length === 0 ? (
            <p>No sessions scheduled for today.</p>
          ) : (
            <div className="sessions-list">
              {todaySessions.map(session => (
                <div key={session.id} className="session-card">
                  <div className="session-time">
                    {new Date(session.dateTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="session-details">
                    <strong>{session.patientName}</strong>
                    <br />
                    <small>with {session.therapistName}</small>
                    <br />
                    <small>{session.duration} minutes | {session.sessionType}</small>
                  </div>
                  <div className={`session-status ${session.status.toLowerCase()}`}>
                    {session.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <h2>Upcoming Sessions (Next 7 Days)</h2>
          {upcomingSessions.length === 0 ? (
            <p>No upcoming sessions in the next 7 days.</p>
          ) : (
            <div className="sessions-list">
              {upcomingSessions.slice(0, 5).map(session => (
                <div key={session.id} className="session-card">
                  <div className="session-time">
                    {new Date(session.dateTime).toLocaleDateString()} <br />
                    {new Date(session.dateTime).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                  <div className="session-details">
                    <strong>{session.patientName}</strong>
                    <br />
                    <small>with {session.therapistName}</small>
                    <br />
                    <small>{session.duration} minutes | {session.sessionType}</small>
                  </div>
                  <div className={`session-status ${session.status.toLowerCase()}`}>
                    {session.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;