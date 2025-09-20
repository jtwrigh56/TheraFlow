const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// In-memory data storage (replace with database in production)
const therapists = [];
const patients = [];
const sessions = [];
const attendance = [];

// Seed data
therapists.push(
  {
    id: uuidv4(),
    name: 'Dr. Sarah Johnson',
    specialization: 'Physical Therapy',
    email: 'sarah.johnson@theraflow.com',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Dr. Michael Chen',
    specialization: 'Occupational Therapy',
    email: 'michael.chen@theraflow.com',
    createdAt: new Date().toISOString()
  }
);

patients.push(
  {
    id: uuidv4(),
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-06-15',
    createdAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 987-6543',
    dateOfBirth: '1990-12-03',
    createdAt: new Date().toISOString()
  }
);

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TheraFlow API is running' });
});

// Therapists routes
app.get('/api/therapists', (req, res) => {
  res.json(therapists);
});

app.get('/api/therapists/:id', (req, res) => {
  const therapist = therapists.find(t => t.id === req.params.id);
  if (!therapist) {
    return res.status(404).json({ error: 'Therapist not found' });
  }
  res.json(therapist);
});

app.post('/api/therapists', (req, res) => {
  const { name, specialization, email } = req.body;
  
  if (!name || !specialization || !email) {
    return res.status(400).json({ error: 'Name, specialization, and email are required' });
  }

  const therapist = {
    id: uuidv4(),
    name,
    specialization,
    email,
    createdAt: new Date().toISOString()
  };

  therapists.push(therapist);
  res.status(201).json(therapist);
});

// Patients routes
app.get('/api/patients', (req, res) => {
  res.json(patients);
});

app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }
  res.json(patient);
});

app.post('/api/patients', (req, res) => {
  const { name, email, phone, dateOfBirth } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const patient = {
    id: uuidv4(),
    name,
    email,
    phone,
    dateOfBirth,
    createdAt: new Date().toISOString()
  };

  patients.push(patient);
  res.status(201).json(patient);
});

// Sessions routes
app.get('/api/sessions', (req, res) => {
  // Return sessions with populated therapist and patient names
  const populatedSessions = sessions.map(session => {
    const therapist = therapists.find(t => t.id === session.therapistId);
    const patient = patients.find(p => p.id === session.patientId);
    
    return {
      ...session,
      therapistName: therapist ? therapist.name : 'Unknown',
      patientName: patient ? patient.name : 'Unknown'
    };
  });
  
  res.json(populatedSessions);
});

app.get('/api/sessions/:id', (req, res) => {
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const therapist = therapists.find(t => t.id === session.therapistId);
  const patient = patients.find(p => p.id === session.patientId);
  
  res.json({
    ...session,
    therapistName: therapist ? therapist.name : 'Unknown',
    patientName: patient ? patient.name : 'Unknown'
  });
});

app.post('/api/sessions', (req, res) => {
  const { therapistId, patientId, dateTime, duration, sessionType, notes } = req.body;
  
  if (!therapistId || !patientId || !dateTime || !duration) {
    return res.status(400).json({ error: 'TherapistId, patientId, dateTime, and duration are required' });
  }

  // Validate therapist and patient exist
  const therapist = therapists.find(t => t.id === therapistId);
  const patient = patients.find(p => p.id === patientId);
  
  if (!therapist) {
    return res.status(400).json({ error: 'Invalid therapist ID' });
  }
  
  if (!patient) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  const session = {
    id: uuidv4(),
    therapistId,
    patientId,
    dateTime,
    duration,
    sessionType: sessionType || 'Regular',
    notes: notes || '',
    status: 'Scheduled',
    createdAt: new Date().toISOString()
  };

  sessions.push(session);
  res.status(201).json({
    ...session,
    therapistName: therapist.name,
    patientName: patient.name
  });
});

app.put('/api/sessions/:id', (req, res) => {
  const sessionIndex = sessions.findIndex(s => s.id === req.params.id);
  if (sessionIndex === -1) {
    return res.status(404).json({ error: 'Session not found' });
  }

  const { therapistId, patientId, dateTime, duration, sessionType, notes, status } = req.body;
  
  // Validate therapist and patient if provided
  if (therapistId && !therapists.find(t => t.id === therapistId)) {
    return res.status(400).json({ error: 'Invalid therapist ID' });
  }
  
  if (patientId && !patients.find(p => p.id === patientId)) {
    return res.status(400).json({ error: 'Invalid patient ID' });
  }

  // Update session
  sessions[sessionIndex] = {
    ...sessions[sessionIndex],
    ...(therapistId && { therapistId }),
    ...(patientId && { patientId }),
    ...(dateTime && { dateTime }),
    ...(duration && { duration }),
    ...(sessionType && { sessionType }),
    ...(notes !== undefined && { notes }),
    ...(status && { status }),
    updatedAt: new Date().toISOString()
  };

  const therapist = therapists.find(t => t.id === sessions[sessionIndex].therapistId);
  const patient = patients.find(p => p.id === sessions[sessionIndex].patientId);

  res.json({
    ...sessions[sessionIndex],
    therapistName: therapist ? therapist.name : 'Unknown',
    patientName: patient ? patient.name : 'Unknown'
  });
});

// Attendance routes
app.get('/api/attendance', (req, res) => {
  const populatedAttendance = attendance.map(record => {
    const session = sessions.find(s => s.id === record.sessionId);
    let sessionInfo = {};
    
    if (session) {
      const therapist = therapists.find(t => t.id === session.therapistId);
      const patient = patients.find(p => p.id === session.patientId);
      sessionInfo = {
        sessionDateTime: session.dateTime,
        therapistName: therapist ? therapist.name : 'Unknown',
        patientName: patient ? patient.name : 'Unknown'
      };
    }
    
    return {
      ...record,
      ...sessionInfo
    };
  });
  
  res.json(populatedAttendance);
});

app.post('/api/attendance', (req, res) => {
  const { sessionId, attended, checkInTime, checkOutTime, notes } = req.body;
  
  if (!sessionId || attended === undefined) {
    return res.status(400).json({ error: 'SessionId and attended status are required' });
  }

  // Validate session exists
  const session = sessions.find(s => s.id === sessionId);
  if (!session) {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  // Check if attendance already recorded for this session
  const existingRecord = attendance.find(a => a.sessionId === sessionId);
  if (existingRecord) {
    return res.status(400).json({ error: 'Attendance already recorded for this session' });
  }

  const attendanceRecord = {
    id: uuidv4(),
    sessionId,
    attended,
    checkInTime: checkInTime || null,
    checkOutTime: checkOutTime || null,
    notes: notes || '',
    recordedAt: new Date().toISOString()
  };

  attendance.push(attendanceRecord);
  
  const therapist = therapists.find(t => t.id === session.therapistId);
  const patient = patients.find(p => p.id === session.patientId);

  res.status(201).json({
    ...attendanceRecord,
    sessionDateTime: session.dateTime,
    therapistName: therapist ? therapist.name : 'Unknown',
    patientName: patient ? patient.name : 'Unknown'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`TheraFlow API server running on port ${PORT}`);
});