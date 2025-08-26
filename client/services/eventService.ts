// Event API Service cho frontend
import { API_BASE_URL } from './config';

const EVENT_API_URL = `${API_BASE_URL}/api/events`;

export interface EventAPI {
  id: number;
  title: string;
  description: string;
  full_description?: string;
  start_date: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  location: string;
  target_audience?: string;
  max_participants?: number;
  current_participants: number;
  status: string;
  event_type: string;
  priority: string;
  is_mandatory: boolean;
  is_online: boolean;
  organizer?: string;
  contact_info?: string;
  requirements?: string;
  what_to_bring?: string;
  note?: string;
  image_url?: string;
  registration_required: boolean;
  registration_deadline?: string;
  created_at: string;
  updated_at: string;
  tags: Array<{
    id: number;
    event_id: number;
    tag_name: string;
  }>;
  registrations: Array<{
    id: number;
    student_name: string;
    status: string;
  }>;
  _count: {
    likes: number;
    registrations: number;
  };
}

export interface EventRegistration {
  student_name: string;
  student_email: string;
  student_phone?: string;
  student_id?: string; // MSSV
  student_avatar?: File; // Ảnh upload
  major?: string;
  semester?: string;
  class_code?: string;
  notes?: string;
}

export interface EventCategory {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface AcademicCalendar {
  id: number;
  semester: string;
  event_name: string;
  start_date: string;
  end_date?: string;
  description?: string;
  is_holiday: boolean;
  created_at: string;
}

class EventService {
  // Get all events
  async getAllEvents(): Promise<EventAPI[]> {
    try {
      const response = await fetch(EVENT_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Get event by ID
  async getEventById(id: number): Promise<EventAPI> {
    try {
      const response = await fetch(`${EVENT_API_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  // Create new event
  async createEvent(eventData: Partial<EventAPI>): Promise<EventAPI> {
    try {
      const response = await fetch(EVENT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update event
  async updateEvent(id: number, eventData: Partial<EventAPI>): Promise<EventAPI> {
    try {
      const response = await fetch(`${EVENT_API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete event
  async deleteEvent(id: number): Promise<void> {
    try {
      const response = await fetch(`${EVENT_API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Register for event with file upload support
  async registerForEvent(id: number, registrationData: EventRegistration): Promise<any> {
    try {
      const formData = new FormData();
      
      // Add form fields
      formData.append('student_name', registrationData.student_name);
      formData.append('student_email', registrationData.student_email);
      
      if (registrationData.student_phone) {
        formData.append('student_phone', registrationData.student_phone);
      }
      
      if (registrationData.student_id) {
        formData.append('student_id', registrationData.student_id);
      }
      
      if (registrationData.notes) {
        formData.append('notes', registrationData.notes);
      }
      
      // Add image file if provided
      if (registrationData.student_avatar) {
        formData.append('student_image', registrationData.student_avatar);
      }
      
      // Add event ID for backend processing
      formData.append('event_id', id.toString());

      const response = await fetch(`${EVENT_API_URL}/${id}/register`, {
        method: 'POST',
        body: formData, // Send as FormData for file upload
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  }

  // Toggle like for event
  async toggleLike(id: number): Promise<{ liked: boolean; likes: number }> {
    try {
      const response = await fetch(`${EVENT_API_URL}/${id}/like`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Get event categories
  async getCategories(): Promise<EventCategory[]> {
    try {
      const response = await fetch(`${EVENT_API_URL}/categories/all`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Get academic calendar
  async getAcademicCalendar(semester?: string): Promise<AcademicCalendar[]> {
    try {
      const url = semester ? `${EVENT_API_URL}/academic/calendar?semester=${semester}` : `${EVENT_API_URL}/academic/calendar`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching academic calendar:', error);
      throw error;
    }
  }

  // Convert API event to UI format (for compatibility with existing components)
  convertToUIFormat(event: EventAPI) {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      date: new Date(event.start_date).toLocaleDateString('vi-VN'),
      time: event.start_time || 'Cả ngày',
      location: event.location,
      status: event.status,
      category: event.event_type,
      participants: event._count.registrations,
      maxParticipants: event.max_participants,
      isOnline: event.is_online,
      isMandatory: event.is_mandatory,
      tags: event.tags.map(tag => tag.tag_name),
      likes: event._count.likes,
      registrationRequired: event.registration_required,
      organizer: event.organizer || 'FPT University',
      priority: event.priority,
      image: event.image_url || `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(event.title)}`
    };
  }
}

export const eventService = new EventService();
export default eventService;
