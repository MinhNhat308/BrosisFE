import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Star,
  Heart,
  Share2,
  ArrowLeft,
  CheckCircle,
  Award,
  Target,
  Sparkles,
  User,
  Phone,
  Mail,
  BookOpen,
  Trophy,
  Zap,
  Loader2,
  Camera
} from "lucide-react";

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [registering, setRegistering] = useState(false);
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

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const eventData = await EventService.getEventById(Number(id));
        setEvent(eventData);
      } catch (err) {
        setError('Không thể tải thông tin sự kiện');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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
    if (!event) return;

    if (!formData.name || !formData.email || !formData.confirmAttendance) {
      toast({
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng điền đầy đủ thông tin và xác nhận tham dự",
        variant: "destructive"
      });
      return;
    }

    try {
      setRegistering(true);
      
      const registrationData = {
        student_name: formData.name,
        student_email: formData.email,
        student_phone: formData.phone,
        student_avatar: formData.checkinImage || undefined,
      };

      const result = await EventService.registerForEvent(event.id, registrationData);
      
      if (result.success) {
        toast({
          title: "Đăng ký thành công!",
          description: "Chúng tôi đã gửi email xác nhận cho bạn",
        });
        
        setIsRegistered(true);
        setEvent(prev => prev ? { ...prev, current_participants: prev.current_participants + 1 } : null);
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
      setRegistering(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-unicorn-pink" />
          <span>Đang tải thông tin sự kiện...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {error || "Sự kiện không tồn tại"}
          </h1>
          <Link to="/events">
            <Button className="bg-unicorn-pink hover:bg-unicorn-pink-dark text-white">
              Quay lại danh sách sự kiện
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const registrationPercentage = event.max_participants 
    ? (event.current_participants / event.max_participants) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/events">
            <Button variant="ghost" className="text-unicorn-pink hover:bg-unicorn-pink/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách sự kiện
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card className="border-unicorn-pink/20">
              <div className="h-64 bg-gradient-to-br from-unicorn-pink/20 to-unicorn-purple/20 flex items-center justify-center relative">
                <div className="text-center">
                  {event.event_type === "workshop" && <BookOpen className="w-20 h-20 text-unicorn-pink mb-4" />}
                  {event.event_type === "competition" && <Trophy className="w-20 h-20 text-unicorn-purple mb-4" />}
                  {event.event_type === "seminar" && <Users className="w-20 h-20 text-unicorn-pink mb-4" />}
                  {event.event_type === "hackathon" && <Zap className="w-20 h-20 text-unicorn-purple mb-4" />}
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className={`${event.status === "upcoming" ? "bg-green-500" : "bg-gray-500"} text-white`}>
                    {event.status === "upcoming" ? "Sắp diễn ra" : "Đã kết thúc"}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className="bg-white/80 hover:bg-white"
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "text-red-500 fill-current" : "text-gray-600"}`} />
                  </Button>
                  <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                    <Share2 className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-unicorn-pink text-white capitalize">{event.event_type}</Badge>
                  <Badge variant="outline" className="border-unicorn-purple text-unicorn-purple">
                    {event.priority}
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    Miễn phí
                  </Badge>
                </div>
                <CardTitle className="text-3xl text-foreground">{event.title}</CardTitle>
                <CardDescription className="text-lg">{event.description}</CardDescription>
              </CardHeader>
            </Card>

            {/* Event Details */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-unicorn-pink" />
                  Thông tin chi tiết
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                    {event.full_description || event.description}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Tags */}
            {event.tags && event.tags.length > 0 && (
              <Card className="border-unicorn-pink/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-unicorn-pink" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-unicorn-pink/10 text-unicorn-pink">
                        {tag.tag_name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-unicorn-pink" />
                  Thông tin sự kiện
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-unicorn-pink" />
                  <div>
                    <p className="font-medium">Ngày diễn ra</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.start_date).toLocaleDateString('vi-VN')}
                      {event.end_date && ` - ${new Date(event.end_date).toLocaleDateString('vi-VN')}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-unicorn-pink" />
                  <div>
                    <p className="font-medium">Thời gian</p>
                    <p className="text-sm text-muted-foreground">
                      {event.start_time || "TBA"}
                      {event.end_time && ` - ${event.end_time}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-unicorn-pink" />
                  <div>
                    <p className="font-medium">Địa điểm</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-unicorn-pink" />
                  <div>
                    <p className="font-medium">Số lượng</p>
                    <p className="text-sm text-muted-foreground">
                      {event.current_participants}/{event.max_participants || "∞"} người
                    </p>
                  </div>
                </div>
                
                {event.max_participants && (
                  <div className="pt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Tỷ lệ đăng ký</span>
                      <span className="font-medium text-unicorn-pink">{Math.round(registrationPercentage)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple h-3 rounded-full transition-all duration-300"
                        style={{ width: `${registrationPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Registration */}
            <Card className="border-unicorn-pink/20 bg-gradient-to-r from-unicorn-pink/10 to-unicorn-purple/10">
              <CardContent className="p-6">
                {!isRegistered ? (
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-unicorn-pink mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Đăng ký tham gia ngay!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {event.max_participants 
                        ? `Còn ${event.max_participants - event.current_participants} chỗ trống`
                        : "Không giới hạn số lượng"
                      }
                    </p>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-unicorn-pink hover:bg-unicorn-pink-dark text-white mb-2"
                          disabled={event.status !== "upcoming"}
                        >
                          Đăng ký ngay
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-unicorn-pink">Đăng ký tham gia sự kiện</DialogTitle>
                          <DialogDescription>
                            {event.title}
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
                            disabled={registering}
                            className="w-full bg-unicorn-pink hover:bg-unicorn-pink-dark text-white"
                          >
                            {registering ? (
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
                    
                    <p className="text-xs text-muted-foreground">
                      Miễn phí hủy trong vòng 24h
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      Đã đăng ký thành công!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Chúng tôi sẽ gửi thông tin chi tiết qua email
                    </p>
                    <Button 
                      variant="outline"
                      className="w-full border-red-500 text-red-500 hover:bg-red-50"
                      onClick={() => setIsRegistered(false)}
                    >
                      Hủy đăng ký
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-unicorn-pink" />
                  Liên hệ hỗ trợ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-unicorn-pink" />
                  <span className="text-sm">events@unicornteam.vn</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-unicorn-pink" />
                  <span className="text-sm">+84 123 456 789</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
