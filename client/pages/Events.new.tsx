import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  AlertCircle
} from "lucide-react";
import { eventService, EventAPI } from "@/services/eventService";

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [events, setEvents] = useState<EventAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await eventService.getAllEvents();
        setEvents(eventsData);
      } catch (err) {
        setError('Không thể tải danh sách sự kiện');
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

  const getCategoryIcon = (eventType: string) => {
    switch (eventType) {
      case "orientation":
        return "🎓";
      case "academic":
        return "📚";
      case "ceremony":
        return "🎉";
      case "exam":
        return "📝";
      case "health":
        return "🏥";
      case "career":
        return "💼";
      default:
        return "📅";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (startTime?: string, endTime?: string) => {
    if (startTime && endTime) {
      return `${startTime} - ${endTime}`;
    } else if (startTime) {
      return `Từ ${startTime}`;
    }
    return "Cả ngày";
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
              placeholder="Tìm kiếm sự kiện, từ khóa..."
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
            <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(event.event_type)}</span>
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
                      <Button size="sm" className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple text-white">
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

        {/* Add Event Button (for admin/organizer) */}
        <div className="fixed bottom-6 right-6">
          <Button className="rounded-full w-14 h-14 bg-gradient-to-r from-unicorn-pink to-unicorn-purple text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
