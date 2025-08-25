// Student API Service cho frontend
import { API_BASE_URL } from './config';

const STUDENT_API_URL = `${API_BASE_URL}/api/students`;

export interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  student_id: string;
  class: string;
  contact_guardian: boolean;
  insurance_status: boolean;
  created_at: string;
  department?: string;
  registered_events?: RegisteredEvent[];
  event_participations?: RegisteredEvent[];
  document_submissions?: any[];
  submitted_documents_count?: number;
  total_documents_count?: number;
  attended_events_count?: number;
}

export interface RegisteredEvent {
  id: number;
  student_id: string;
  event_id: number;
  registered_at: string;
  participation_status?: string;
  event: {
    id: number;
    title: string;
    start_date: string;
    status: string;
    location?: string;
  };
}

export interface StudentEvent {
  id: number;
  name: string;
  date: string;
  type: string;
  required: boolean;
  participants: number;
}

export interface DocumentType {
  id: number;
  name: string;
  required: boolean;
  deadline: string;
}

export interface StudentStats {
  totalStudents: number;
  contactedGuardians: number;
  insuranceCompleted: number;
  totalEvents: number;
  upcomingEvents: number;
}

class StudentService {
  // Get all students from API
  static async getAllStudents(): Promise<Student[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  // Get student statistics
  static async getStudentStats(): Promise<StudentStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/stats`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error fetching student stats:', error);
      throw error;
    }
  }

  // Get all events
  static async getAllEvents(): Promise<StudentEvent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get all document types
  static async getAllDocumentTypes(): Promise<DocumentType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }
  }

  // Get student by ID with registered events
  static async getStudentById(id: number): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  }

  // Get student details with registered events by student_id (MSSV)
  static async getStudentByStudentId(student_id: string): Promise<Student> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch student data');
      }
      
      // Transform registered_events to event_participations for compatibility with modal
      const studentData = result.data;
      if (studentData.registered_events) {
        studentData.event_participations = studentData.registered_events.map((reg: any) => ({
          ...reg,
          participation_status: 'attended' // Default status for registered events
        }));
      }
      
      return studentData;
    } catch (error) {
      console.error('Error fetching student by student_id:', error);
      throw error;
    }
  }
}

export default StudentService;
