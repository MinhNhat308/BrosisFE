import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft,
  Heart,
  Share2,
  BookmarkPlus,
  AlertCircle,
  GraduationCap,
  FileText,
  Loader2
} from "lucide-react";
import { eventService, EventAPI, EventRegistration } from "@/services/eventService";

export default function EventDetailTemp() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState<EventAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    student_name: '',
    student_email: '',
    student_id: '',
    phone_number: '',
    note: ''
  });

  // Load event data
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError('ID sự kiện không hợp lệ');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const eventData = await eventService.getEventById(parseInt(id));
        setEvent(eventData);
        setLikeCount(eventData._count?.likes || 0);
      } catch (err) {
        setError('Không thể tải thông tin sự kiện');
        console.error('Error loading event:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleLike = async () => {
    if (!event) return;
    
    try {
      const result = await eventService.toggleLike(event.id);
      setLiked(result.liked);
      setLikeCount(result.likes);
    } catch (err) {
      console.error('Error liking event:', err);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    try {
      setRegistering(true);
      await eventService.registerForEvent(event.id, registrationData);
      setShowRegistrationModal(false);
      alert('Đăng ký thành công!');
    } catch (err) {
      console.error('Error registering for event:', err);
      alert('Có lỗi xảy ra khi đăng ký');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return timeString;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Cao";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return priority;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-unicorn-purple" />
          <p className="text-muted-foreground">Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error || 'Không tìm thấy sự kiện'}</p>
          <Button onClick={() => navigate('/events')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className="mb-6 hover:bg-unicorn-pink/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách sự kiện
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={`${getStatusColor(event.status)} border`}>
                    {getStatusText(event.status)}
                  </Badge>
                  <Badge className={`${getPriorityColor(event.priority)} border`}>
                    Ưu tiên: {getPriorityText(event.priority)}
                  </Badge>
                  {event.is_mandatory && (
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 border">
                      Bắt buộc
                    </Badge>
                  )}
                  {event.is_online && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 border">
                      Trực tuyến
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {event.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Event Image */}
            {event.image_url && (
              <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-unicorn-pink/20 to-unicorn-purple/20 flex items-center justify-center">
                  <img 
                    src={event.image_url} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const parent = target.parentElement!;
                      parent.innerHTML = `
                        <div class="flex items-center justify-center w-full h-full">
                          <div class="text-center">
                            <div class="w-12 h-12 mx-auto mb-2 text-unicorn-purple/50">
                              <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M5,5V19H19V5H5Z" />
                              </svg>
                            </div>
                            <p class="text-sm text-muted-foreground">Hình ảnh sự kiện</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>
              </Card>
            )}

            {/* Event Details */}
            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-unicorn-purple" />
                  Chi tiết sự kiện
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.full_description && (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {event.full_description}
                    </p>
                  </div>
                )}

                {/* Requirements */}
                {event.requirements && (
                  <div>
                    <h4 className="font-semibold mb-2 text-unicorn-purple">Yêu cầu tham gia:</h4>
                    <p className="text-sm text-muted-foreground">{event.requirements}</p>
                  </div>
                )}

                {/* What to bring */}
                {event.what_to_bring && (
                  <div>
                    <h4 className="font-semibold mb-2 text-unicorn-purple">Cần chuẩn bị:</h4>
                    <p className="text-sm text-muted-foreground">{event.what_to_bring}</p>
                  </div>
                )}

                {/* Note */}
                {event.note && (
                  <div>
                    <h4 className="font-semibold mb-2 text-unicorn-purple">Ghi chú:</h4>
                    <p className="text-sm text-muted-foreground">{event.note}</p>
                  </div>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-unicorn-purple">Thẻ:</h4>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag.tag_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info */}
            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Thông tin sự kiện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-unicorn-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Ngày bắt đầu</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(event.start_date)}
                    </p>
                  </div>
                </div>

                {event.end_date && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-unicorn-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Ngày kết thúc</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(event.end_date)}
                      </p>
                    </div>
                  </div>
                )}

                {(event.start_time || event.end_time) && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-unicorn-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Thời gian</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-unicorn-purple mt-0.5" />
                  <div>
                    <p className="font-medium">Địa điểm</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                {event.target_audience && (
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-unicorn-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Đối tượng tham gia</p>
                      <p className="text-sm text-muted-foreground">{event.target_audience}</p>
                    </div>
                  </div>
                )}

                {event.organizer && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-unicorn-purple mt-0.5" />
                    <div>
                      <p className="font-medium">Ban tổ chức</p>
                      <p className="text-sm text-muted-foreground">{event.organizer}</p>
                    </div>
                  </div>
                )}

                {event.contact_info && (
                  <div>
                    <p className="font-medium mb-1">Thông tin liên hệ</p>
                    <p className="text-sm text-muted-foreground">{event.contact_info}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
              <CardContent className="pt-6 space-y-3">
                {event.registration_required && event.status === 'upcoming' && (
                  <Button 
                    className="w-full bg-gradient-to-r from-unicorn-pink to-unicorn-purple hover:from-unicorn-pink/90 hover:to-unicorn-purple/90"
                    onClick={() => setShowRegistrationModal(true)}
                  >
                    <BookmarkPlus className="w-4 h-4 mr-2" />
                    Đăng ký tham gia
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={handleLike}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                    {likeCount}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Registration Stats */}
            {event.max_participants && (
              <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-unicorn-purple">
                      {event.current_participants}/{event.max_participants}
                    </p>
                    <p className="text-sm text-muted-foreground">Đã đăng ký</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((event.current_participants / event.max_participants) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Registration Modal */}
        <Dialog open={showRegistrationModal} onOpenChange={setShowRegistrationModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Đăng ký tham gia sự kiện</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRegistration} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="student_name">Họ và tên *</Label>
                  <Input
                    id="student_name"
                    value={registrationData.student_name}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, student_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="student_id">Mã sinh viên *</Label>
                  <Input
                    id="student_id"
                    value={registrationData.student_id}
                    onChange={(e) => setRegistrationData(prev => ({ ...prev, student_id: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="student_email">Email *</Label>
                <Input
                  id="student_email"
                  type="email"
                  value={registrationData.student_email}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, student_email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Số điện thoại</Label>
                <Input
                  id="phone_number"
                  value={registrationData.phone_number}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, phone_number: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="note">Ghi chú</Label>
                <Textarea
                  id="note"
                  value={registrationData.note}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRegistrationModal(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={registering}
                  className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple hover:from-unicorn-pink/90 hover:to-unicorn-purple/90"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang đăng ký...
                    </>
                  ) : (
                    'Đăng ký'
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
