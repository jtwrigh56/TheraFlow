export interface Therapist {
  id: string;
  name: string;
  specialization: string;
  email: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  createdAt: string;
}

export interface Session {
  id: string;
  therapistId: string;
  patientId: string;
  dateTime: string;
  duration: number;
  sessionType: string;
  notes: string;
  status: string;
  createdAt: string;
  therapistName?: string;
  patientName?: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  attended: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  notes: string;
  recordedAt: string;
  sessionDateTime?: string;
  therapistName?: string;
  patientName?: string;
}

export interface CreateSessionRequest {
  therapistId: string;
  patientId: string;
  dateTime: string;
  duration: number;
  sessionType?: string;
  notes?: string;
}

export interface CreateAttendanceRequest {
  sessionId: string;
  attended: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  notes?: string;
}