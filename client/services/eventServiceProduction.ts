// Production Event Service with Cloudinary and EmailJS integration
import { API_BASE_URL } from './config';

const EVENT_API_URL = `${API_BASE_URL}/api/events`;

export interface EventAPI {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  location?: string;
  max_participants?: number;
  current_participants: number;
  status: 'draft' | 'published' | 'upcoming' | 'cancelled' | 'completed';
  category?: string;
  priority: 'low' | 'medium' | 'high';
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

// Cloudinary configuration from environment variables - BROTHERS2025
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'diohwqeow';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'windsnguyen';

// EmailJS configuration from environment variables - BROTHERS2025 (CORRECT IDs)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_mgmcelk';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_npima9o';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'VXMCL985bTWO8kVZq';

class EventServiceProduction {
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

  // Upload image to Cloudinary
  private async uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'event-registrations');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Cloudinary upload failed');
      }

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  }

  // Send email via EmailJS
  private async sendEmailNotification(
    eventData: EventAPI,
    registrationData: EventRegistration,
    imageUrl?: string
  ): Promise<void> {
    if (!window.emailjs) {
      throw new Error('EmailJS not loaded');
    }

    console.log('EmailJS Configuration:', {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY
    });

    const emailData = {
      event_title: eventData.title,
      event_date: new Date(eventData.start_date).toLocaleDateString('vi-VN'),
      event_location: eventData.location || 'Chưa xác định',
      student_name: registrationData.student_name,
      student_id: registrationData.student_id || 'Chưa có',
      student_email: registrationData.student_email,
      student_phone: registrationData.student_phone || 'Chưa có',
      image_url: imageUrl || 'Không có ảnh',
      confirmed: 'Đã xác nhận',
      current_time: new Date().toLocaleString('vi-VN'),
      notes: registrationData.notes || 'Không có ghi chú'
    };

    console.log('Email data to send:', emailData);

    try {
      await window.emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        emailData,
        EMAILJS_PUBLIC_KEY
      );
      console.log('Email sent successfully');
    } catch (error) {
      console.error('EmailJS error:', error);
      throw error;
    }
  }

  // Register for event with Cloudinary and EmailJS integration
  async registerForEvent(id: number, registrationData: EventRegistration): Promise<any> {
    try {
      // Get event details first
      const event = await this.getEventById(id);

      let imageUrl: string | undefined;

      // Upload image to Cloudinary if provided
      if (registrationData.student_avatar) {
        try {
          imageUrl = await this.uploadImageToCloudinary(registrationData.student_avatar);
        } catch (uploadError) {
          console.warn('Image upload failed, continuing without image:', uploadError);
        }
      }

      // Send data to backend API
      const formData = new FormData();
      formData.append('student_name', registrationData.student_name);
      formData.append('student_email', registrationData.student_email);
      formData.append('event_id', id.toString());

      if (registrationData.student_phone) {
        formData.append('student_phone', registrationData.student_phone);
      }
      if (registrationData.student_id) {
        formData.append('student_id', registrationData.student_id);
      }
      if (registrationData.notes) {
        formData.append('notes', registrationData.notes);
      }
      if (imageUrl) {
        formData.append('image_url', imageUrl);
      }

      const response = await fetch(`${EVENT_API_URL}/${id}/register`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        
        console.log('API Error Response:', errorData);
        
        // Handle specific error cases
        if (response.status === 409) {
          const message = errorData.error || errorData.message || 'Bạn đã đăng ký sự kiện này rồi!';
          throw new Error(message);
        } else if (response.status === 404) {
          throw new Error('Không tìm thấy sự kiện này!');
        } else if (response.status === 400) {
          throw new Error(errorData.error || errorData.message || 'Thông tin đăng ký không hợp lệ!');
        }
        
        throw new Error(errorData.error || errorData.message || `Lỗi đăng ký: ${response.status}`);
      }

      const result = await response.json();

      // Send email notification
      let emailSent = false;
      try {
        await this.sendEmailNotification(event, registrationData, imageUrl);
        console.log('Email notification sent successfully');
        emailSent = true;
      } catch (emailError) {
        console.warn('Email notification failed, but registration was successful:', emailError);
        emailSent = false;
      }

      return {
        ...result,
        imageUrl,
        emailSent
      };

    } catch (error) {
      console.error('Error registering for event:', error);
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

  // Validate student by MSSV
  async validateStudent(studentId: string): Promise<{
    success: boolean;
    data?: {
      id: number;
      student_id: string;
      name: string;
      email: string;
      phone?: string;
      department?: string;
      registered_events: Array<{
        id: number;
        event: {
          id: number;
          title: string;
          start_date: string;
          status: string;
          location?: string;
        };
        registered_at: string;
      }>;
    };
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        // Return error response instead of throwing
        return {
          success: false,
          message: result.message || 'Validation failed'
        };
      }
      
      return result;
    } catch (error: any) {
      console.error('Error validating student:', error);
      // Return error response instead of throwing
      return {
        success: false,
        message: error.message || 'Network error'
      };
    }
  }

  // Register for event via API
  static async createEventRegistration(registrationData: {
    event_id: number;
    student_name: string;
    student_id: string;
    student_email: string;
    student_phone?: string;
    student_image?: File | null;
    notes?: string;
  }) {
    try {
      const formData = new FormData();
      
      // Add text fields
      formData.append('event_id', registrationData.event_id.toString());
      formData.append('student_name', registrationData.student_name);
      formData.append('student_id', registrationData.student_id);
      formData.append('student_email', registrationData.student_email);
      
      if (registrationData.student_phone) {
        formData.append('student_phone', registrationData.student_phone);
      }
      
      if (registrationData.notes) {
        formData.append('notes', registrationData.notes);
      }
      
      // Add image file if provided
      if (registrationData.student_image) {
        formData.append('student_image', registrationData.student_image);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/registrations/register`, {
        method: 'POST',
        body: formData, // Don't set Content-Type, let browser set it with boundary
      });

      const result = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: result.error || result.message || 'Registration failed'
        };
      }
      
      return {
        success: true,
        message: 'Đăng ký thành công',
        data: result
      };
    } catch (error: any) {
      console.error('Error registering for event:', error);
      return {
        success: false,
        message: error.message || 'Network error'
      };
    }
  }
}

// Extend window object to include emailjs
declare global {
  interface Window {
    emailjs: any;
  }
}

export { EventServiceProduction };
export default new EventServiceProduction();
