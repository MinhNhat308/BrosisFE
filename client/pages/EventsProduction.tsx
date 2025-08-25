import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  UserPlus
} from "lucide-react";
import { eventService, EventAPI } from "@/services/eventService";

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
    student_image: null as File | null,
    confirmed: false
  });

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

  // Handle registration for production
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !registrationData.confirmed) return;

    try {
      setRegistering(true);
      
      let imageUrl = 'Không có ảnh';
      
      // Upload image to Cloudinary (replace with your cloud name and preset)
      if (registrationData.student_image) {
        const cloudinaryFormData = new FormData();
        cloudinaryFormData.append('file', registrationData.student_image);
        cloudinaryFormData.append('upload_preset', 'fpt_events'); // Create this preset in Cloudinary
        
        try {
          const cloudinaryResponse = await fetch(
            'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', // Replace YOUR_CLOUD_NAME
            {
              method: 'POST',
              body: cloudinaryFormData,
            }
          );
          
          if (cloudinaryResponse.ok) {
            const cloudinaryResult = await cloudinaryResponse.json();
            imageUrl = cloudinaryResult.secure_url;
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
        }
      }

      // Prepare email data
      const emailData = {
        event_title: selectedEvent.title,
        event_date: new Date(selectedEvent.start_date).toLocaleDateString('vi-VN'),
        event_location: selectedEvent.location,
        student_name: registrationData.student_name,
        student_id: registrationData.student_id,
        registration_date: new Date().toLocaleString('vi-VN'),
        confirmed: registrationData.confirmed ? 'Có' : 'Không',
        image_url: imageUrl,
        to_email: 'admin@fptuniversity.edu.vn' // Replace with your admin email
      };

      // Send email using EmailJS
      if (window.emailjs) {
        try {
          await window.emailjs.send(
            'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
            'YOUR_TEMPLATE_ID',     // Replace with your EmailJS template ID
            emailData,
            'YOUR_PUBLIC_KEY'       // Replace with your EmailJS public key
          );
          
          alert('Đăng ký thành công! Thông tin đã được gửi đến ban tổ chức qua email.');
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          
          // Fallback: Create Google Form submission
          const googleFormUrl = createGoogleFormUrl(selectedEvent, registrationData, imageUrl);
          window.open(googleFormUrl, '_blank');
          alert('Đăng ký thành công! Vui lòng hoàn thành form Google để gửi thông tin.');
        }
      } else {
        // Fallback if EmailJS not loaded
        const googleFormUrl = createGoogleFormUrl(selectedEvent, registrationData, imageUrl);
        window.open(googleFormUrl, '_blank');
        alert('Vui lòng hoàn thành form Google để hoàn tất đăng ký.');
      }

      setShowRegistrationModal(false);
      resetRegistrationForm();
      
    } catch (err) {
      console.error('Error registering:', err);
      alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
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
      student_image: null,
      confirmed: false
    });
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
      default: return '📅';
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
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/70 backdrop-blur-sm overflow-hidden">
              {/* Event Image */}
              {event.image_url && (
                <div className="aspect-video bg-gradient-to-br from-unicorn-pink/20 to-unicorn-purple/20 overflow-hidden">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement!;
                      parent.innerHTML = `
                        <div class="flex items-center justify-center w-full h-full bg-gradient-to-br from-unicorn-pink/20 to-unicorn-purple/20">
                          <div class="text-center">
                            <div class="text-4xl mb-2">${getCategoryIcon(event.event_type)}</div>
                            <p class="text-sm text-muted-foreground">Sự kiện ${event.event_type}</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {!event.image_url && (
                      <span className="text-2xl">{getCategoryIcon(event.event_type)}</span>
                    )}
                    <Badge className={getStatusColor(event.status)}>
                      {event.status === 'upcoming' ? 'Sắp diễn ra' : 
                       event.status === 'completed' ? 'Đã kết thúc' : 
                       event.status === 'cancelled' ? 'Đã hủy' : event.status}
                    </Badge>
                  </div>
                  {event.is_mandatory && (
                    <Badge variant="destructive" className="bg-red-100 text-red-800">
                      Bắt buộc
                    </Badge>
                  )}
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-unicorn-purple transition-colors">
                  {event.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {event.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(event.start_date)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(event.start_time, event.end_time)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  {event.max_participants && (
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{event.current_participants}/{event.max_participants} người tham gia</span>
                    </div>
                  )}
                </div>

                {/* Progress bar for registration */}
                {event.max_participants && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Đăng ký</span>
                      <span>
                        {Math.round((event.current_participants / event.max_participants) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(event.current_participants / event.max_participants) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

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
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{event._count.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{event._count.registrations}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link to={`/events/${event.id}`}>
                      <Button size="sm" variant="outline" className="border-unicorn-purple text-unicorn-purple hover:bg-unicorn-purple hover:text-white">
                        Chi tiết
                      </Button>
                    </Link>
                    {event.registration_required && event.status === 'upcoming' && (
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple text-white"
                        onClick={() => openRegistrationModal(event)}
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Đăng ký
                      </Button>
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
          <DialogContent className="sm:max-w-[500px]">
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
                  <Input
                    id="student_id"
                    placeholder="Ví dụ: SE123456"
                    value={registrationData.student_id}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, student_id: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="student_image" className="text-sm font-medium">
                    Ảnh sinh viên *
                  </Label>
                  <div className="mt-1 border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-unicorn-pink/50 transition-colors">
                    {registrationData.student_image ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <img 
                            src={URL.createObjectURL(registrationData.student_image)} 
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
                          onClick={() => setRegistrationData(prev => ({ ...prev, student_image: null }))}
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
                              onChange={handleImageUpload}
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
      </div>
    </div>
  );
}
