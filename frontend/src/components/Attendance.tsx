import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { AttendanceRecord, Session } from '../types';

const Attendance: React.FC = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attendanceData, sessionsData] = await Promise.all([
          apiService.getAttendance(),
          apiService.getSessions()
        ]);
        
        setAttendance(attendanceData);
        setSessions(sessionsData);
      } catch (err) {
        setError('Failed to load attendance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMarkAttendance = async (sessionId: string, attended: boolean) => {
    try {
      await apiService.createAttendance({
        sessionId,
        attended,
        checkInTime: attended ? new Date().toISOString() : undefined
      });
      
      // Refresh attendance data
      const attendanceData = await apiService.getAttendance();
      setAttendance(attendanceData);
      setShowForm(false);
      setSelectedSession('');
    } catch (err) {
      setError('Failed to record attendance');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading attendance...</div>;
  if (error) return <div className="error">{error}</div>;

  // Get sessions that haven't had attendance recorded
  const recordedSessionIds = attendance.map(a => a.sessionId);
  const unrecordedSessions = sessions.filter(s => !recordedSessionIds.includes(s.id));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Attendance Records</h1>
        {unrecordedSessions.length > 0 && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Record Attendance'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="attendance-form">
          <h2>Record Session Attendance</h2>
          <div className="form-group">
            <label>Select Session:</label>
            <select 
              value={selectedSession} 
              onChange={(e) => setSelectedSession(e.target.value)}
            >
              <option value="">Choose a session...</option>
              {unrecordedSessions.map(session => (
                <option key={session.id} value={session.id}>
                  {new Date(session.dateTime).toLocaleDateString()} - {session.patientName} with {session.therapistName}
                </option>
              ))}
            </select>
          </div>
          
          {selectedSession && (
            <div className="attendance-actions">
              <button 
                className="btn btn-success"
                onClick={() => handleMarkAttendance(selectedSession, true)}
              >
                Mark as Attended
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleMarkAttendance(selectedSession, false)}
              >
                Mark as Absent
              </button>
            </div>
          )}
        </div>
      )}

      <div className="attendance-list">
        {attendance.length === 0 ? (
          <p>No attendance records yet.</p>
        ) : (
          <div className="cards-grid">
            {attendance.map(record => (
              <div key={record.id} className={`card attendance-card ${record.attended ? 'attended' : 'absent'}`}>
                <div className="attendance-status">
                  {record.attended ? '✓ Attended' : '✗ Absent'}
                </div>
                <h3>{record.patientName}</h3>
                <p><strong>Therapist:</strong> {record.therapistName}</p>
                <p><strong>Session Date:</strong> {new Date(record.sessionDateTime!).toLocaleDateString()}</p>
                <p><strong>Session Time:</strong> {new Date(record.sessionDateTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                {record.checkInTime && (
                  <p><strong>Check-in:</strong> {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                )}
                {record.notes && (
                  <p><strong>Notes:</strong> {record.notes}</p>
                )}
                <p><strong>Recorded:</strong> {new Date(record.recordedAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;