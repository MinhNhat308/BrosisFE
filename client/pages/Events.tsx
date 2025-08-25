import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Plus,
  Filter,
  Star,
  Sparkles,
  Loader2,
  Heart,
  AlertCircle,
  Upload,
  UserPlus,
  Camera,
  Check,
  X
} from "lucide-react";
import { eventService, EventAPI } from "@/services/eventService";
import EventServiceProduction, { EventServiceProduction as EventServiceClass } from "@/services/eventServiceProduction";

// EmailJS integration for production
declare global {
  interface Window {
    emailjs: any;
  }
}

export default function EventsProduction() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [events, setEvents] = useState<EventAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Registration modal state
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventAPI | null>(null);
  const [registering, setRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    student_name: '',
    student_id: '',
    student_email: '',
    student_phone: '',
    student_image: null as File | null,
    notes: '',
    confirmed: false
  });

  // Student validation state
  const [studentValidation, setStudentValidation] = useState<{
    isValidating: boolean;
    isValid: boolean | null;
    error: string;
    autoFilledData?: any;
  }>({
    isValidating: false,
    isValid: null,
    error: '',
    autoFilledData: null
  });

  // Image preview and additional states
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successData, setSuccessData] = useState<{
    eventTitle: string;
    studentName: string;
    studentEmail: string;
    imageUrl?: string;
    registrationDate: string;
    registrationId?: number;
    emailSent?: boolean;
  } | null>(null);
  const { toast } = useToast();
  const validateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        console.log('Loading events from API...');
        const eventsData = await eventService.getAllEvents();
        console.log('Events loaded:', eventsData);
        setEvents(eventsData);
      } catch (err) {
        setError('Không thể tải danh sách sự kiện');
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
        console.log('Loading complete');
      }
    };

    loadEvents();
  }, []);

  // Student ID validation and auto-fill
  const validateStudentId = async (studentId: string) => {
    if (!studentId.trim()) {
      setStudentValidation({
        isValidating: false,
        isValid: null,
        error: '',
        autoFilledData: null
      });
      return;
    }

    setStudentValidation(prev => ({
      ...prev,
      isValidating: true,
      error: ''
    }));

    try {
      const response = await EventServiceProduction.validateStudent(studentId);
      if (response.success && response.data) {
        setStudentValidation({
          isValidating: false,
          isValid: true,
          error: '',
          autoFilledData: response.data
        });
        
        // Auto-fill student data
        setRegistrationData(prev => ({
          ...prev,
          student_name: response.data.name || '',
          student_email: response.data.email || '',
          student_phone: response.data.phone || ''
        }));
        
        toast({
          title: "MSSV hợp lệ",
          description: "Thông tin sinh viên đã được tự động điền",
        });
      } else {
        setStudentValidation({
          isValidating: false,
          isValid: false,
          error: response.message || 'MSSV không tồn tại trong hệ thống',
          autoFilledData: null
        });
        
        toast({
          title: "MSSV không hợp lệ",
          description: response.message || 'MSSV không tồn tại trong hệ thống',
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Handle both network errors and 404 responses
      const errorMessage = error.message || 'Lỗi kết nối đến server';
      setStudentValidation({
        isValidating: false,
        isValid: false,
        error: errorMessage,
        autoFilledData: null
      });
      
      toast({
        title: "Lỗi",
        description: errorMessage.includes('MSSV:') ? errorMessage : "Không thể kiểm tra MSSV, vui lòng thử lại",
        variant: "destructive",
      });
    }
  };

  // Handle student ID change with debounced validation
  const handleStudentIdChange = (value: string) => {
    setRegistrationData(prev => ({ ...prev, student_id: value }));
    
    // Clear auto-filled data if ID changes
    if (value !== studentValidation.autoFilledData?.student_id) {
      setStudentValidation(prev => ({
        ...prev,
        isValid: null,
        autoFilledData: null
      }));
    }
    
    // Debounced validation
    if (validateTimeoutRef.current) {
      clearTimeout(validateTimeoutRef.current);
    }
    
    validateTimeoutRef.current = setTimeout(() => {
      validateStudentId(value);
    }, 1000);
  };

  // Cloudinary upload function
  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'windsnguyen');
      formData.append('folder', 'Brothers2025/events');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/diohwqeow/image/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result.secure_url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return null;
    }
  };

  // EmailJS integration
  const sendEmailNotification = async (registrationData: any, eventData: any, imageUrl?: string) => {
    try {
      if (!window.emailjs) {
        console.error('EmailJS not loaded');
        return false;
      }

      const templateParams = {
        to_name: 'Admin',
        from_name: registrationData.student_name,
        student_id: registrationData.student_id,
        student_email: registrationData.student_email,
        student_phone: registrationData.student_phone,
        event_title: eventData.title,
        event_date: new Date(eventData.start_date).toLocaleDateString('vi-VN'),
        event_location: eventData.location,
        registration_date: new Date().toLocaleString('vi-VN'),
        notes: registrationData.notes || 'Không có ghi chú',
        image_url: imageUrl || 'Không có ảnh',
        reply_to: registrationData.student_email
      };

      const result = await window.emailjs.send(
        'service_mgmcelk',
        'template_npima9o',
        templateParams,
        'VXMCL985bTWO8kVZq'
      );

      return result.status === 200;
    } catch (error) {
      console.error('EmailJS error:', error);
      return false;
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Lỗi",
          description: "Kích thước ảnh không được vượt quá 5MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn file ảnh hợp lệ",
          variant: "destructive",
        });
        return;
      }

      setRegistrationData(prev => ({ ...prev, student_image: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle registration for production
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !registrationData.confirmed) {
      toast({
        title: "Lỗi",
        description: "Vui lòng xác nhận đăng ký",
        variant: "destructive",
      });
      return;
    }

    // Validate required fields
    if (!registrationData.student_name || !registrationData.student_id) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Check if MSSV is validated
    if (!studentValidation.isValid) {
      toast({
        title: "Lỗi",
        description: "MSSV chưa được xác thực hoặc không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    try {
      setRegistering(true);
      
      let imageUrl: string | null = null;
      
      // Upload image to Cloudinary if provided
      if (registrationData.student_image) {
        toast({
          title: "Đang xử lý",
          description: "Đang tải ảnh lên...",
        });
        
        imageUrl = await uploadImageToCloudinary(registrationData.student_image);
        if (!imageUrl) {
          toast({
            title: "Cảnh báo",
            description: "Không thể tải ảnh lên, nhưng đăng ký vẫn tiếp tục",
            variant: "destructive",
          });
        }
      }

      // Send email notification
      const emailSent = await sendEmailNotification(registrationData, selectedEvent, imageUrl || undefined);
      
      // Register for event via API
      const registrationPayload = {
        event_id: selectedEvent.id,
        student_name: registrationData.student_name,
        student_id: registrationData.student_id,
        student_email: registrationData.student_email,
        student_phone: registrationData.student_phone,
        student_image: registrationData.student_image,
        notes: registrationData.notes
      };

      const registrationResult = await EventServiceClass.createEventRegistration(registrationPayload);
      
      if (!registrationResult.success) {
        throw new Error(registrationResult.message || 'Đăng ký thất bại');
      }
      
      // Set success data
      setSuccessData({
        eventTitle: selectedEvent.title,
        studentName: registrationData.student_name,
        studentEmail: registrationData.student_email,
        imageUrl: imageUrl || undefined,
        registrationDate: new Date().toLocaleString('vi-VN'),
        registrationId: registrationResult.data?.id,
        emailSent
      });
      
      // Show success message
      toast({
        title: "Đăng ký thành công!",
        description: `Bạn đã đăng ký thành công sự kiện "${selectedEvent.title}"${emailSent ? ' và email thông báo đã được gửi' : ''}`,
      });

      // Reset form and close modal
      resetRegistrationForm();
      setShowRegistrationModal(false);
      setShowSuccessDialog(true);

      // Reload events to update registration count
      // Trigger reload by setting loading state
      setLoading(true);
      try {
        const eventsData = await eventService.getAllEvents();
        setEvents(eventsData);
      } catch (err) {
        console.error('Error reloading events:', err);
      } finally {
        setLoading(false);
      }
      setShowSuccessDialog(true);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Lỗi đăng ký",
        description: error.message || "Có lỗi xảy ra khi đăng ký sự kiện",
        variant: "destructive",
      });
    } finally {
      setRegistering(false);
    }
  };

  // Create Google Form URL as fallback
  const createGoogleFormUrl = (event: EventAPI, data: any, imageUrl: string) => {
    const baseUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse'; // Replace YOUR_FORM_ID
    const params = new URLSearchParams({
      'entry.123456789': event.title,           // Replace with actual entry ID
      'entry.987654321': data.student_name,     // Replace with actual entry ID  
      'entry.456789123': data.student_id,       // Replace with actual entry ID
      'entry.789123456': imageUrl,              // Replace with actual entry ID
      'entry.321654987': new Date().toLocaleDateString('vi-VN') // Replace with actual entry ID
    });
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh hợp lệ');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File ảnh không được vượt quá 5MB');
        return;
      }
      setRegistrationData(prev => ({ ...prev, student_image: file }));
    }
  };

  const openRegistrationModal = (event: EventAPI) => {
    setSelectedEvent(event);
    setShowRegistrationModal(true);
  };

  const resetRegistrationForm = () => {
    setRegistrationData({
      student_name: '',
      student_id: '',
      student_email: '',
      student_phone: '',
      student_image: null,
      notes: '',
      confirmed: false
    });
    setStudentValidation({
      isValidating: false,
      isValid: null,
      error: '',
      autoFilledData: null
    });
    setImagePreview(null);
  };

  // ... rest of the component logic (same as before)
  // getStatusColor, formatDate, formatTime, filteredEvents logic...

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (startTime?: string, endTime?: string) => {
    if (!startTime && !endTime) return 'Cả ngày';
    return `${startTime || ''} - ${endTime || ''}`.trim();
  };

  const getCategoryIcon = (eventType: string) => {
    switch (eventType) {
      case 'academic': return '📚';
      case 'orientation': return '🎓';
      case 'career': return '💼';
      case 'health': return '🏥';
      case 'ceremony': return '🎉';
      case 'exam': return '📝';
      case 'workshop': return '🔧';
      case 'seminar': return '🎙️';
      case 'competition': return '🏆';
      case 'social': return '🤝';
      case 'sports': return '⚽';
      case 'cultural': return '🎭';
      default: return '📅';
    }
  };

  const getCategoryGradient = (eventType: string) => {
    switch (eventType) {
      case 'academic': return 'from-blue-400 to-indigo-600';
      case 'orientation': return 'from-purple-400 to-pink-600';
      case 'career': return 'from-green-400 to-teal-600';
      case 'health': return 'from-red-400 to-pink-600';
      case 'ceremony': return 'from-yellow-400 to-orange-600';
      case 'exam': return 'from-gray-400 to-slate-600';
      case 'workshop': return 'from-amber-400 to-orange-600';
      case 'seminar': return 'from-cyan-400 to-blue-600';
      case 'competition': return 'from-rose-400 to-red-600';
      case 'social': return 'from-emerald-400 to-green-600';
      case 'sports': return 'from-lime-400 to-green-600';
      case 'cultural': return 'from-violet-400 to-purple-600';
      default: return 'from-unicorn-pink to-unicorn-purple';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.tag_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === "all" || event.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-unicorn-purple" />
          <p className="text-muted-foreground">Đang tải danh sách sự kiện...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Thử lại</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-unicorn-pink to-unicorn-purple rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4">
            Sự kiện FPT University
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá và tham gia các sự kiện học thuật, hướng nghiệp và hoạt động sinh viên tại FPT University
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedFilter("all")}
              className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple text-white hover:opacity-90"
            >
              <Filter className="w-4 h-4 mr-2" />
              Tất cả
            </Button>
            <Button
              variant={selectedFilter === "upcoming" ? "default" : "outline"}
              onClick={() => setSelectedFilter("upcoming")}
            >
              Sắp diễn ra
            </Button>
            <Button
              variant={selectedFilter === "completed" ? "default" : "outline"}
              onClick={() => setSelectedFilter("completed")}
            >
              Đã kết thúc
            </Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden hover:scale-[1.02]">
              {/* Event Image - Always show */}
              <div className="aspect-video bg-gradient-to-br from-unicorn-pink/20 to-unicorn-purple/20 overflow-hidden relative">
                {event.image_url ? (
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement!;
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = `absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getCategoryGradient(event.event_type)} opacity-90`;
                      fallbackDiv.innerHTML = `
                        <div class="text-center text-white">
                          <div class="text-6xl mb-4">${getCategoryIcon(event.event_type)}</div>
                          <p class="text-xl font-bold mb-2">${event.event_type.toUpperCase()}</p>
                          <p class="text-sm opacity-90 px-4">${event.title.substring(0, 30)}${event.title.length > 30 ? '...' : ''}</p>
                        </div>
                      `;
                      parent.appendChild(fallbackDiv);
                    }}
                  />
                ) : (
                  <div className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${getCategoryGradient(event.event_type)} opacity-90`}>
                    <div className="text-center text-white">
                      <div className="text-6xl mb-4">{getCategoryIcon(event.event_type)}</div>
                      <p className="text-xl font-bold mb-2">{event.event_type.toUpperCase()}</p>
                      <p className="text-sm opacity-90 px-4">{event.title.substring(0, 30)}{event.title.length > 30 ? '...' : ''}</p>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={`${getStatusColor(event.status)} shadow-md`}>
                    {event.status === 'upcoming' ? 'Sắp diễn ra' : 
                     event.status === 'completed' ? 'Đã kết thúc' : 
                     event.status === 'cancelled' ? 'Đã hủy' : event.status}
                  </Badge>
                </div>
                
                {/* Mandatory Badge */}
                {event.is_mandatory && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="destructive" className="bg-red-500 text-white shadow-md">
                      Bắt buộc
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-2 group-hover:text-unicorn-purple transition-colors text-lg font-bold">
                  {event.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-gray-600">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Calendar className="w-4 h-4 text-unicorn-purple" />
                    <span className="font-medium">{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Clock className="w-4 h-4 text-unicorn-pink" />
                    <span>{formatTime(event.start_time, event.end_time)}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">
                      {event.current_participants}/{event.max_participants || 20} người tham gia
                    </span>
                  </div>
                </div>

                {/* Progress bar - Always show with max 20 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">Tình trạng đăng ký</span>
                    <span className="text-unicorn-purple">
                      {Math.round(((event.current_participants || 0) / (event.max_participants || 20)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple h-2.5 rounded-full transition-all duration-500 shadow-sm"
                      style={{ 
                        width: `${Math.min(((event.current_participants || 0) / (event.max_participants || 20)) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    {(event.max_participants || 20) - (event.current_participants || 0) > 0 
                      ? `Còn ${(event.max_participants || 20) - (event.current_participants || 0)} chỗ` 
                      : 'Đã đầy'
                    }
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {event.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-unicorn-purple/10 text-unicorn-purple">
                      {tag.tag_name}
                    </Badge>
                  ))}
                  {event.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      +{event.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>{event._count?.likes || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>{event._count?.registrations || event.current_participants || 0}</span>
                      </div>
                    </div>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {event.event_type}
                    </span>
                  </div>
                  
                  {/* Action Buttons - Always show */}
                  <div className="flex space-x-2">
                    <Link to={`/events/${event.id}`} className="flex-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full border-unicorn-purple text-unicorn-purple hover:bg-unicorn-purple hover:text-white transition-all duration-200"
                      >
                        Chi tiết
                      </Button>
                    </Link>
                    
                    {/* Registration Button - Always show but with different states */}
                    {event.status === 'upcoming' && (
                      <div className="flex-1">
                        {(event.current_participants || 0) >= (event.max_participants || 20) ? (
                          <Button 
                            size="sm" 
                            disabled
                            className="w-full bg-gray-400 text-white cursor-not-allowed"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Đã đầy
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="w-full bg-gradient-to-r from-unicorn-pink to-unicorn-purple text-white hover:from-unicorn-pink/90 hover:to-unicorn-purple/90 transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={() => openRegistrationModal(event)}
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Đăng ký ngay
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {event.status === 'completed' && (
                      <div className="flex-1">
                        <Button 
                          size="sm" 
                          disabled
                          className="w-full bg-green-100 text-green-700 cursor-not-allowed"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Đã kết thúc
                        </Button>
                      </div>
                    )}
                    
                    {event.status === 'cancelled' && (
                      <div className="flex-1">
                        <Button 
                          size="sm" 
                          disabled
                          className="w-full bg-red-100 text-red-700 cursor-not-allowed"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Đã hủy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Không tìm thấy sự kiện nào</h3>
            <p className="text-muted-foreground">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem thêm sự kiện.
            </p>
          </div>
        )}

        {/* Registration Modal */}
        <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent">
                Đăng ký tham gia sự kiện
              </DialogTitle>
              {selectedEvent && (
                <p className="text-sm text-muted-foreground mt-2">
                  Sự kiện: <span className="font-medium">{selectedEvent.title}</span>
                </p>
              )}
            </DialogHeader>
            
            <form onSubmit={handleRegistration} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="student_name" className="text-sm font-medium">
                    Họ và tên sinh viên *
                  </Label>
                  <Input
                    id="student_name"
                    placeholder="Nhập họ và tên đầy đủ"
                    value={registrationData.student_name}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, student_name: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="student_id" className="text-sm font-medium">
                    Mã số sinh viên *
                  </Label>
                  <div className="relative">
                    <Input
                      id="student_id"
                      placeholder="Ví dụ: SE123456"
                      value={registrationData.student_id}
                      onChange={(e) => handleStudentIdChange(e.target.value)}
                      required
                      className={`mt-1 pr-10 ${
                        studentValidation.isValidating ? 'border-yellow-500' :
                        studentValidation.isValid === true ? 'border-green-500' :
                        studentValidation.isValid === false ? 'border-red-500' :
                        ''
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {studentValidation.isValidating && (
                        <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
                      )}
                      {studentValidation.isValid === true && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                      {studentValidation.isValid === false && (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {studentValidation.error && (
                    <p className="text-sm text-red-500 mt-1">{studentValidation.error}</p>
                  )}
                  {studentValidation.isValid && studentValidation.autoFilledData && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ MSSV hợp lệ - Thông tin đã được tự động điền
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="student_email" className="text-sm font-medium">
                    Email sinh viên *
                  </Label>
                  <Input
                    id="student_email"
                    type="email"
                    placeholder="example@fpt.edu.vn"
                    value={registrationData.student_email}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, student_email: e.target.value }))}
                    required
                    className="mt-1"
                    disabled={!!(studentValidation.autoFilledData && registrationData.student_email)}
                  />
                  {studentValidation.autoFilledData && registrationData.student_email && (
                    <p className="text-xs text-blue-600 mt-1">Email tự động điền từ hệ thống</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="student_phone" className="text-sm font-medium">
                    Số điện thoại
                  </Label>
                  <Input
                    id="student_phone"
                    type="tel"
                    placeholder="0123456789"
                    value={registrationData.student_phone}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, student_phone: e.target.value }))}
                    className="mt-1"
                    disabled={!!(studentValidation.autoFilledData && registrationData.student_phone)}
                  />
                  {studentValidation.autoFilledData && registrationData.student_phone && (
                    <p className="text-xs text-blue-600 mt-1">Số điện thoại tự động điền từ hệ thống</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="student_image" className="text-sm font-medium">
                    Ảnh sinh viên *
                  </Label>
                  <div className="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-unicorn-pink/50 transition-colors">
                    {registrationData.student_image && imagePreview ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <img 
                            src={imagePreview} 
                            alt="Preview ảnh sinh viên" 
                            className="max-w-full max-h-48 object-contain rounded-lg border-2 border-unicorn-pink shadow-sm"
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-green-600 font-medium">
                            {registrationData.student_image.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Kích thước: {(registrationData.student_image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRegistrationData(prev => ({ ...prev, student_image: null }));
                            setImagePreview(null);
                          }}
                          className="border-unicorn-purple text-unicorn-purple hover:bg-unicorn-purple hover:text-white"
                        >
                          Thay đổi ảnh
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <div>
                          <label htmlFor="student_image" className="cursor-pointer">
                            <span className="text-sm font-medium text-unicorn-purple hover:text-unicorn-pink">
                              Chọn ảnh sinh viên
                            </span>
                            <input
                              id="student_image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                              required
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">
                          Chấp nhận: JPG, PNG, GIF (tối đa 5MB)<br/>
                          Ảnh sẽ được hiển thị nguyên kích thước
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-sm font-medium">
                    Ghi chú thêm (không bắt buộc)
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Ví dụ: Có thức ăn chay, cần hỗ trợ đặc biệt..."
                    value={registrationData.notes}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, notes: e.target.value }))}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2 p-4 bg-unicorn-pink/5 rounded-lg border border-unicorn-pink/20">
                  <Checkbox
                    id="confirmed"
                    checked={registrationData.confirmed}
                    onCheckedChange={(checked) => 
                      setRegistrationData(prev => ({ ...prev, confirmed: checked as boolean }))
                    }
                    className="border-unicorn-purple data-[state=checked]:bg-unicorn-purple"
                  />
                  <Label htmlFor="confirmed" className="text-sm font-medium cursor-pointer">
                    Tôi xác nhận sẽ tham gia chương trình này và cung cấp thông tin chính xác
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRegistrationModal(false);
                    resetRegistrationForm();
                  }}
                  disabled={registering}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={registering || !registrationData.confirmed}
                  className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple hover:from-unicorn-pink/90 hover:to-unicorn-purple/90"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang đăng ký...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Đăng ký tham gia
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-xl font-bold text-green-600 mb-4">
                🎉 Đăng ký thành công!
              </DialogTitle>
            </DialogHeader>
            
            {successData && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">Thông tin đăng ký</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Sự kiện:</span> {successData.eventTitle}
                    </div>
                    <div>
                      <span className="font-medium">Họ tên:</span> {successData.studentName}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {successData.studentEmail}
                    </div>
                    <div>
                      <span className="font-medium">Thời gian đăng ký:</span> {successData.registrationDate}
                    </div>
                    {successData.imageUrl && (
                      <div>
                        <span className="font-medium">Ảnh sinh viên:</span> Đã tải lên thành công
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email thông báo:</span>
                      {successData.emailSent ? (
                        <span className="text-green-600">✓ Đã gửi</span>
                      ) : (
                        <span className="text-yellow-600">⚠ Chưa gửi</span>
                      )}
                    </div>
                  </div>
                </div>

                {successData.imageUrl && (
                  <div className="text-center">
                    <img 
                      src={successData.imageUrl} 
                      alt="Ảnh sinh viên đã tải lên" 
                      className="max-w-full max-h-32 object-contain rounded-lg border mx-auto"
                    />
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Lưu ý quan trọng</h4>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>Vui lòng kiểm tra email để xác nhận thông tin đăng ký</li>
                    <li>Đến đúng giờ và địa điểm được thông báo</li>
                    <li>Mang theo thẻ sinh viên và giấy tờ tùy thân</li>
                    <li>Liên hệ ban tổ chức nếu có thay đổi</li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => {
                      setShowSuccessDialog(false);
                      setSuccessData(null);
                    }}
                    className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple hover:from-unicorn-pink/90 hover:to-unicorn-purple/90"
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-green-600 flex items-center justify-center gap-2">
              <Check className="w-6 h-6" />
              Đăng ký thành công!
            </DialogTitle>
          </DialogHeader>
          
          {successData && (
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">
                  Thông tin đăng ký
                </h3>
                <div className="space-y-2 text-sm text-green-700">
                  <p><strong>Sự kiện:</strong> {successData.eventTitle}</p>
                  <p><strong>Họ tên:</strong> {successData.studentName}</p>
                  <p><strong>Email:</strong> {successData.studentEmail}</p>
                  <p><strong>Thời gian đăng ký:</strong> {successData.registrationDate}</p>
                  {successData.registrationId && (
                    <p><strong>Mã đăng ký:</strong> #{successData.registrationId}</p>
                  )}
                </div>
              </div>

              {successData.imageUrl && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Ảnh đã tải lên:</p>
                  <img 
                    src={successData.imageUrl} 
                    alt="Ảnh sinh viên" 
                    className="max-w-32 max-h-32 object-cover rounded-lg mx-auto border"
                  />
                </div>
              )}

              <div className="text-center space-y-2">
                {successData.emailSent ? (
                  <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    Email thông báo đã được gửi
                  </p>
                ) : (
                  <p className="text-sm text-yellow-600 flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Không thể gửi email thông báo
                  </p>
                )}
                
                <p className="text-xs text-gray-500">
                  Vui lòng lưu lại thông tin này để tiện theo dõi
                </p>
              </div>

              <Button 
                onClick={() => setShowSuccessDialog(false)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Đóng
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
