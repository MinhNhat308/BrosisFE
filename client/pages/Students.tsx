import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Search,
  Plus,
  Star,
  Calendar,
  CheckCircle,
  Clock,
  Trophy,
  BookOpen,
  Code,
  Sparkles,
  GraduationCap,
  Mail,
  Phone,
  Target,
  Zap,
  Heart,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import StudentService from "@/services/studentService";
import StudentDetailModal from "@/components/StudentDetailModal";
import "../animations.css";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<any>({});

  // Manual refresh function
  const refreshData = async () => {
    try {
      setLoading(true);
      const [studentsData, statsData] = await Promise.all([
        StudentService.getAllStudents(),
        StudentService.getStudentStats()
      ]);

      setStudents(studentsData);
      setStatistics(statsData);
      console.log('Students data sample:', studentsData[0]); // Debug log to see what fields are available
      if (studentsData[0]?.event_participations) {
        console.log('Event participations:', studentsData[0].event_participations);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [studentsData, statsData] = await Promise.all([
          StudentService.getAllStudents(),
          StudentService.getStudentStats()
        ]);

        setStudents(studentsData);
        setStatistics(statsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto refresh data every 30 seconds to keep event participation counts updated
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [studentsData, statsData] = await Promise.all([
          StudentService.getAllStudents(),
          StudentService.getStudentStats()
        ]);

        setStudents(studentsData);
        setStatistics(statsData);
      } catch (error) {
        console.error("Error refreshing data:", error);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || student.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-unicorn-pink hover:bg-unicorn-purple text-white transition-colors duration-200";
      case "inactive":
        return "bg-gray-500 text-white";
      default:
        return "bg-unicorn-pink text-white";
    }
  };

  const getContactStatusColor = (status: string) => {
    switch (status) {
      case "contacted":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "no_response":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleStudentClick = async (student: any) => {
    try {
      // Fetch detailed student data with registered events
      const detailedStudent = await StudentService.getStudentByStudentId(student.student_id);
      
      // Merge the basic student data with detailed event data
      const enrichedStudent = {
        ...student,
        ...detailedStudent,
        event_participations: detailedStudent.event_participations || []
      };
      
      setSelectedStudent(enrichedStudent);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching student details:', error);
      // Fall back to basic student data if detailed fetch fails
      setSelectedStudent(student);
      setIsModalOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-unicorn-pink border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Đang tải dữ liệu sinh viên...</p>
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
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4">
            Danh sách Sinh viên
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Theo dõi tiến độ và quản lý thông tin của {students.length} sinh viên Unicorn Team
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-unicorn-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tổng sinh viên</p>
                  <p className="text-3xl font-bold text-foreground">{statistics.total_students || students.length}</p>
                </div>
                <Users className="w-8 h-8 text-unicorn-pink" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-unicorn-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Đã liên hệ</p>
                  <p className="text-3xl font-bold text-foreground">{statistics.contacted_students || students.filter(s => s.contact_status === 'contacted').length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-unicorn-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Có bảo hiểm</p>
                  <p className="text-3xl font-bold text-foreground">{statistics.insured_students || students.filter(s => s.insurance_status === 'active').length}</p>
                </div>
                <Trophy className="w-8 h-8 text-unicorn-purple" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-unicorn-pink/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sự kiện tham gia</p>
                  <p className="text-3xl font-bold text-foreground">{statistics.total_events || 0}</p>
                </div>
                <Star className="w-8 h-8 text-unicorn-pink" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sinh viên..."
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
              variant={selectedFilter === "active" ? "default" : "outline"}
              onClick={() => setSelectedFilter("active")}
              className={selectedFilter === "active" ? "bg-unicorn-pink hover:bg-unicorn-pink-dark" : "border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"}
            >
              Đang học
            </Button>
          </div>
          <Button className="bg-unicorn-purple hover:bg-unicorn-purple-light text-white">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sinh viên
          </Button>
          <Button 
            onClick={refreshData}
            variant="outline"
            className="border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"
            disabled={loading}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-unicorn-pink border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            Cập nhật
          </Button>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <Card 
              key={student.id} 
              className="border-unicorn-pink/20 hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
              onClick={() => handleStudentClick(student)}
            >
              <CardHeader className="text-center">
                <Avatar className="w-16 h-16 mx-auto mb-3">
                  <AvatarImage src={student.avatar_url || "/Unicorn1.jpg"} />
                  <AvatarFallback className="bg-gradient-to-br from-unicorn-pink to-unicorn-purple text-white text-lg">
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg group-hover:text-unicorn-pink transition-colors">
                  {student.name}
                </CardTitle>
                <CardDescription>
                  {student.department}
                </CardDescription>
                <Badge className={getStatusColor(student.status)}>
                  {student.status === "active" ? "Đang học" : "Tạm dừng"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mã SV:</span>
                    <span className="font-bold text-unicorn-purple">
                      {student.student_id}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Liên hệ:</span>
                    <span className={`font-medium ${getContactStatusColor(student.contact_status)}`}>
                      {student.contact_status === 'contacted' ? 'Đã liên hệ' : 
                       student.contact_status === 'pending' ? 'Chờ liên hệ' : 
                       'Chưa phản hồi'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bảo hiểm:</span>
                    <span className={`font-medium ${student.insurance_status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                      {student.insurance_status === 'active' ? 'Có' : 'Chưa có'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sự kiện:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {(student.event_participations?.length || 0) + (student.event_registrations?.length || 0)}
                      </span>
                      {((student.event_participations?.length || 0) + (student.event_registrations?.length || 0) > 0) && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                          Đã đăng ký
                        </Badge>
                      )}
                      {(student.attended_events_count || 0) > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-2 py-1">
                          Đã tham gia
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hồ sơ:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {student.submitted_documents_count || 0}/{student.total_documents_count || 0}
                      </span>
                      {(student.submitted_documents_count || 0) === (student.total_documents_count || 0) && (student.total_documents_count || 0) > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-2 py-1">
                          Hoàn thành
                        </Badge>
                      )}
                      {(student.submitted_documents_count || 0) < (student.total_documents_count || 0) && (student.total_documents_count || 0) > 0 && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1">
                          Chưa đủ
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Tham gia:</span>
                      <span>{new Date(student.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Mail className="w-4 h-4 text-unicorn-pink" />
                      </Button>
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Phone className="w-4 h-4 text-unicorn-pink" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-unicorn-pink hover:bg-unicorn-pink/10">
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-unicorn-pink/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Không tìm thấy sinh viên nào
            </h3>
            <p className="text-muted-foreground">
              Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
