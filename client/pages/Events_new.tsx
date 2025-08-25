import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import EventService, { type EventAPI } from "@/services/eventService";
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
  Upload,
  Camera
} from "lucide-react";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [events, setEvents] = useState<EventAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registering, setRegistering] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventAPI | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    checkinImage: null as File | null,
    confirmAttendance: false,
    notes: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await EventService.getAllEvents();
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (err) {
        setError('Không thể tải danh sách sự kiện');
        setEvents([]);
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-unicorn-pink text-white";
      case "completed":
        return "bg-gray-500 text-white";
      case "cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-unicorn-purple text-white";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "workshop":
        return "🛠️";
      case "competition":
        return "🏆";
      case "seminar":
        return "📝";
      case "networking":
        return "🤝";
      case "hackathon":
        return "💻";
      default:
        return "📅";
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, checkinImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegister = async () => {
    if (!selectedEvent) return;

    if (!formData.name || !formData.email || !formData.confirmAttendance) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin và xác nhận tham dự",
        variant: "destructive"
      });
      return;
    }

    try {
      setRegistering(selectedEvent.id.toString());
      
      const registrationData = {
        participant_name: formData.name,
        participant_email: formData.email,
        participant_phone: formData.phone,
        participant_avatar: formData.checkinImage || undefined,
      };

      const result = await EventService.registerForEvent(selectedEvent.id, registrationData);
      
      if (result.success) {
        toast({
          title: "Đăng ký thành công!",
          description: "Chúng tôi đã gửi email xác nhận cho bạn",
        });
        
        // Update current participants count
        setEvents(prev => prev.map(event => 
          event.id === selectedEvent.id 
            ? { ...event, current_participants: event.current_participants + 1 }
            : event
        ));
        
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (err: any) {
      toast({
        title: "Đăng ký thất bại",
        description: err.message || "Có lỗi xảy ra khi đăng ký",
        variant: "destructive"
      });
    } finally {
      setRegistering(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      studentId: "",
      email: "",
      phone: "",
      checkinImage: null,
      confirmAttendance: false,
      notes: ""
    });
    setImagePreview(null);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || event.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-unicorn-pink" />
          <span>Đang tải sự kiện...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Có lỗi xảy ra</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-unicorn-pink hover:bg-unicorn-pink-dark text-white">
            Thử lại
          </Button>
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
            Quản lý Sự kiện
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Theo dõi và tham gia các sự kiện, workshop, và hoạt động của Unicorn Team
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-unicorn-pink/20 focus:border-unicorn-pink"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              onClick={() => setSelectedFilter("all")}
              className={selectedFilter === "all" ? "bg-unicorn-pink hover:bg-unicorn-pink-dark" : "border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"}
            >
              Tất cả
            </Button>
            <Button
              variant={selectedFilter === "upcoming" ? "default" : "outline"}
              onClick={() => setSelectedFilter("upcoming")}
              className={selectedFilter === "upcoming" ? "bg-unicorn-pink hover:bg-unicorn-pink-dark" : "border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"}
            >
              Sắp tới
            </Button>
            <Button
              variant={selectedFilter === "completed" ? "default" : "outline"}
              onClick={() => setSelectedFilter("completed")}
              className={selectedFilter === "completed" ? "bg-unicorn-pink hover:bg-unicorn-pink-dark" : "border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"}
            >
              Đã hoàn thành
            </Button>
          </div>
          <Button className="bg-unicorn-purple hover:bg-unicorn-purple-light text-white">
            <Plus className="w-4 h-4 mr-2" />
            Tạo sự kiện
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="border-unicorn-pink/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getCategoryIcon(event.event_type)}</span>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status === "upcoming" ? "Sắp tới" : 
                       event.status === "completed" ? "Đã hoàn thành" : "Đã hủy"}
                    </Badge>
                  </div>
                  <Star className="w-5 h-5 text-gray-300 hover:text-unicorn-pink cursor-pointer transition-colors" />
                </div>
                <CardTitle className="text-lg group-hover:text-unicorn-pink transition-colors">
                  <Link to={`/events/${event.id}`}>
                    {event.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(event.start_date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{event.start_time || "TBA"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.current_participants}/{event.max_participants || "∞"} người tham gia</span>
                  </div>
                  
                  {event.max_participants && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">Tỷ lệ tham gia</span>
                        <span className="text-xs font-medium text-unicorn-pink">
                          {Math.round((event.current_participants / event.max_participants) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(event.current_participants / event.max_participants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Loại:</span>
                      <span className="font-medium text-unicorn-pink capitalize">{event.event_type}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Độ ưu tiên:</span>
                      <span className="font-medium capitalize">{event.priority}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Dialog open={isDialogOpen && selectedEvent?.id === event.id} onOpenChange={(open) => {
                      setIsDialogOpen(open);
                      if (open) {
                        setSelectedEvent(event);
                      } else {
                        setSelectedEvent(null);
                        resetForm();
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-unicorn-pink hover:bg-unicorn-pink-dark text-white" 
                          disabled={event.status !== "upcoming"}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedEvent(event);
                          }}
                        >
                          {event.status === "upcoming" ? "Đăng ký tham gia" : "Đã kết thúc"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-unicorn-pink">Đăng ký tham gia sự kiện</DialogTitle>
                          <DialogDescription>
                            {selectedEvent?.title}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">Họ và tên *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Nhập họ và tên"
                            />
                          </div>
                          <div>
                            <Label htmlFor="studentId">Mã sinh viên</Label>
                            <Input
                              id="studentId"
                              value={formData.studentId}
                              onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                              placeholder="Nhập mã sinh viên"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="Nhập email"
                            />
                          </div>
                          <div>
                            <Label htmlFor="phone">Số điện thoại</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Nhập số điện thoại"
                            />
                          </div>
                          <div>
                            <Label htmlFor="checkinImage">Ảnh check-in (tùy chọn)</Label>
                            <div className="mt-2">
                              <input
                                id="checkinImage"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('checkinImage')?.click()}
                                className="w-full border-dashed border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"
                              >
                                <Camera className="w-4 h-4 mr-2" />
                                Tải ảnh lên
                              </Button>
                              {imagePreview && (
                                <div className="mt-2">
                                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="notes">Ghi chú</Label>
                            <Textarea
                              id="notes"
                              value={formData.notes}
                              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="Ghi chú thêm (nếu có)"
                              rows={3}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="confirmAttendance"
                              checked={formData.confirmAttendance}
                              onChange={(e) => setFormData(prev => ({ ...prev, confirmAttendance: e.target.checked }))}
                              className="w-4 h-4 text-unicorn-pink bg-gray-100 border-gray-300 rounded focus:ring-unicorn-pink focus:ring-2"
                            />
                            <Label htmlFor="confirmAttendance" className="text-sm">
                              Tôi xác nhận sẽ tham dự sự kiện này *
                            </Label>
                          </div>
                          <Button 
                            onClick={handleRegister}
                            disabled={registering === selectedEvent?.id.toString()}
                            className="w-full bg-unicorn-pink hover:bg-unicorn-pink-dark text-white"
                          >
                            {registering === selectedEvent?.id.toString() ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang đăng ký...
                              </>
                            ) : (
                              "Xác nhận đăng ký"
                            )}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-unicorn-pink/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Không tìm thấy sự kiện nào
            </h3>
            <p className="text-muted-foreground">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
