import axios from 'axios';
import {
  Therapist,
  Patient,
  Session,
  AttendanceRecord,
  CreateSessionRequest,
  CreateAttendanceRequest
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  health: (): Promise<{ status: string; message: string }> =>
    api.get('/health').then(response => response.data),

  // Therapists
  getTherapists: (): Promise<Therapist[]> =>
    api.get('/therapists').then(response => response.data),
  
  getTherapist: (id: string): Promise<Therapist> =>
    api.get(`/therapists/${id}`).then(response => response.data),
  
  createTherapist: (data: Omit<Therapist, 'id' | 'createdAt'>): Promise<Therapist> =>
    api.post('/therapists', data).then(response => response.data),

  // Patients
  getPatients: (): Promise<Patient[]> =>
    api.get('/patients').then(response => response.data),
  
  getPatient: (id: string): Promise<Patient> =>
    api.get(`/patients/${id}`).then(response => response.data),
  
  createPatient: (data: Omit<Patient, 'id' | 'createdAt'>): Promise<Patient> =>
    api.post('/patients', data).then(response => response.data),

  // Sessions
  getSessions: (): Promise<Session[]> =>
    api.get('/sessions').then(response => response.data),
  
  getSession: (id: string): Promise<Session> =>
    api.get(`/sessions/${id}`).then(response => response.data),
  
  createSession: (data: CreateSessionRequest): Promise<Session> =>
    api.post('/sessions', data).then(response => response.data),
  
  updateSession: (id: string, data: Partial<CreateSessionRequest>): Promise<Session> =>
    api.put(`/sessions/${id}`, data).then(response => response.data),

  // Attendance
  getAttendance: (): Promise<AttendanceRecord[]> =>
    api.get('/attendance').then(response => response.data),
  
  createAttendance: (data: CreateAttendanceRequest): Promise<AttendanceRecord> =>
    api.post('/attendance', data).then(response => response.data),
};

export default apiService;