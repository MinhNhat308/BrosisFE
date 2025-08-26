import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  BookOpen,
  Trophy,
  Heart,
  Award,
  Target,
  Zap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight,
  Code,
  Lightbulb,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageCircle,
  ThumbsUp
} from "lucide-react";
import "../animations.css";

export default function Index() {
  const [stats, setStats] = useState({
    totalStudents: 20,
    totalEvents: 12,
    totalProjects: 8,
    totalAwards: 15
  });
  
  const [currentStudentSlide, setCurrentStudentSlide] = useState(0);
  const [currentBlogSlide, setCurrentBlogSlide] = useState(0);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students from database
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await fetch('/api/students?featured=true&limit=12');
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          // Fallback mock data if API fails
          setStudents([
            {
              id: 1,
              name: "Nguyễn Minh Khang",
              email: "khang.nguyen@fpt.edu.vn",
              phone: "0123456789",
              major: "Công nghệ thông tin",
              avatar_url: "/Unicorn1.jpg"
            },
            {
              id: 2,
              name: "Trần Thùy Linh",
              email: "linh.tran@fpt.edu.vn", 
              phone: "0987654321",
              major: "Khoa học máy tính",
              avatar_url: "/Unicorn2.jpg"
            },
            {
              id: 3,
              name: "Lê Hoàng Nam",
              email: "nam.le@fpt.edu.vn",
              phone: "0912345678",
              major: "Kỹ thuật phần mềm",
              avatar_url: "/Unicorn3.jpg"
            },
            {
              id: 4,
              name: "Phạm Ngọc Ánh",
              email: "anh.pham@fpt.edu.vn",
              phone: "0934567890",
              major: "An toàn thông tin",
              avatar_url: "/Unicorn4.jpg"
            },
            {
              id: 5,
              name: "Hoàng Quốc Bảo",
              email: "bao.hoang@fpt.edu.vn",
              phone: "0945678901",
              major: "Trí tuệ nhân tạo",
              avatar_url: "/Unicorn5.jpg"
            },
            {
              id: 6,
              name: "Vũ Thu Hương",
              email: "huong.vu@fpt.edu.vn",
              phone: "0956789012",
              major: "Công nghệ thông tin",
              avatar_url: "/Unicorn1.jpg"
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        // Use fallback data on error
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Mock blog data
  const blogPosts = [
    {
      id: 1,
      title: "Hành trình phát triển kỹ năng lập trình của Unicorn Team",
      excerpt: "Khám phá cách các sinh viên Unicorn Team đã vượt qua thử thách và phát triển kỹ năng lập trình...",
      author: "Admin",
      date: "2025-01-20",
      image: "/Unicorn1.jpg",
      views: 1250,
      likes: 89,
      comments: 23
    },
    {
      id: 2,
      title: "Workshop React.js - Xây dựng ứng dụng web hiện đại",
      excerpt: "Tổng quan về workshop React.js và những kiến thức thực tế mà sinh viên đã học được...",
      author: "Mentor Tech",
      date: "2025-01-18",
      image: "/Unicorn2.jpg",
      views: 890,
      likes: 67,
      comments: 15
    },
    {
      id: 3,
      title: "Hackathon 2025 - Cuộc thi sáng tạo công nghệ",
      excerpt: "Những dự án xuất sắc và sáng tạo từ cuộc thi Hackathon thường niên của Unicorn Team...",
      author: "Tech Lead",
      date: "2025-01-15",
      image: "/Unicorn3.jpg",
      views: 1456,
      likes: 112,
      comments: 34
    },
    {
      id: 4,
      title: "AI và Machine Learning - Tương lai của công nghệ",
      excerpt: "Khám phá xu hướng AI và Machine Learning trong ngành công nghệ thông tin...",
      author: "AI Researcher",
      date: "2025-01-12",
      image: "/Unicorn4.jpg",
      views: 2134,
      likes: 189,
      comments: 56
    },
    {
      id: 5,
      title: "Cybersecurity - Bảo mật trong kỷ nguyên số",
      excerpt: "Tầm quan trọng của an ninh mạng và cách bảo vệ thông tin trong thời đại số...",
      author: "Security Expert",
      date: "2025-01-10",
      image: "/Unicorn5.jpg",
      views: 987,
      likes: 78,
      comments: 29
    },
    {
      id: 6,
      title: "UI/UX Design - Nghệ thuật thiết kế trải nghiệm người dùng",
      excerpt: "Khám phá quy trình thiết kế UI/UX hiện đại và xu hướng thiết kế 2025...",
      author: "UX Designer",
      date: "2025-01-08",
      image: "/Unicorn1.jpg",
      views: 1345,
      likes: 95,
      comments: 41
    }
  ];

  const nextStudentSlide = () => {
    setCurrentStudentSlide((prev) => 
      prev + 3 >= students.length ? 0 : prev + 3
    );
  };

  const prevStudentSlide = () => {
    setCurrentStudentSlide((prev) => 
      prev === 0 ? Math.max(0, students.length - 3) : prev - 3
    );
  };

  const nextBlogSlide = () => {
    setCurrentBlogSlide((prev) => 
      prev + 1 >= blogPosts.length ? 0 : prev + 1
    );
  };

  const prevBlogSlide = () => {
    setCurrentBlogSlide((prev) => 
      prev === 0 ? blogPosts.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-unicorn-pink/20 rounded-full mix-blend-multiply filter blur-xl animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-unicorn-purple/20 rounded-full mix-blend-multiply filter blur-xl animate-[float_8s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl animate-[float_6s_ease-in-out_infinite]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-unicorn-pink via-unicorn-purple to-unicorn-pink bg-clip-text text-transparent animate-[slideInUp_1s_ease-out] leading-tight">
                Unicorn Team
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto animate-[slideInUp_1s_ease-out_0.2s_both]">
                Nơi khơi nguồn đam mê công nghệ, kết nối tài năng trẻ và tạo ra những giải pháp sáng tạo cho tương lai
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[slideInUp_1s_ease-out_0.4s_both]">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple hover:from-unicorn-pink/90 hover:to-unicorn-purple/90 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
                asChild
              >
                <Link to="/blog" className="group">
                  Khám phá ngay
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 px-8 py-4 hover:scale-110 transition-all duration-300 hover:shadow-lg"
                asChild
              >
                <Link to="/events">
                  Tham gia sự kiện
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-[slideInUp_1s_ease-out_0.6s_both]">
              <div className="text-center group cursor-pointer">
                <div className="text-3xl font-bold text-unicorn-pink group-hover:scale-110 transition-transform duration-300">
                  {stats.totalStudents}+
                </div>
                <div className="text-sm text-muted-foreground">Sinh viên</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl font-bold text-unicorn-purple group-hover:scale-110 transition-transform duration-300">
                  {stats.totalEvents}+
                </div>
                <div className="text-sm text-muted-foreground">Sự kiện</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl font-bold text-unicorn-pink group-hover:scale-110 transition-transform duration-300">
                  {stats.totalProjects}+
                </div>
                <div className="text-sm text-muted-foreground">Dự án</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-3xl font-bold text-unicorn-purple group-hover:scale-110 transition-transform duration-300">
                  {stats.totalAwards}+
                </div>
                <div className="text-sm text-muted-foreground">Giải thưởng</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-unicorn-pink rounded-full flex justify-center">
            <div className="w-1 h-3 bg-unicorn-pink rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4 animate-[slideInUp_1s_ease-out]">
              Tại sao chọn Unicorn Team?
            </h2>
            <p className="text-lg text-muted-foreground animate-[slideInUp_1s_ease-out_0.2s_both]">
              Chúng tôi mang đến những giá trị độc đáo cho sự phát triển của bạn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Code,
                title: "Công nghệ tiên tiến",
                description: "Luôn cập nhật những công nghệ mới nhất và xu hướng phát triển trong ngành IT"
              },
              {
                icon: Users,
                title: "Cộng đồng mạnh mẽ",
                description: "Kết nối với những người bạn cùng chí hướng và mentor giàu kinh nghiệm"
              },
              {
                icon: Trophy,
                title: "Thành tựu xuất sắc",
                description: "Đạt được nhiều giải thưởng trong các cuộc thi lập trình và startup"
              }
            ].map((feature, index) => (
              <Card 
                key={index}
                className={`border-unicorn-pink/20 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-[slideInUp_0.6s_ease-out_${index * 0.2}s_both] group cursor-pointer`}
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-unicorn-pink to-unicorn-purple rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-pulse">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl group-hover:text-unicorn-pink transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick CTA Section */}
      <section className="py-16 bg-gradient-to-r from-unicorn-pink/10 to-unicorn-purple/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-unicorn-pink/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-unicorn-pink/5">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Rocket className="w-16 h-16 text-unicorn-pink mx-auto mb-4 animate-[float_3s_ease-in-out_infinite]" />
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Sẵn sàng bắt đầu hành trình?
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Tham gia cùng Unicorn Team để phát triển kỹ năng và xây dựng tương lai công nghệ
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple hover:from-unicorn-pink/90 hover:to-unicorn-purple/90 text-white px-8 py-4 hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  asChild
                >
                  <Link to="/events" className="group">
                    Tham gia ngay
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 px-8 py-4 hover:scale-110 transition-all duration-300 hover:shadow-lg"
                  asChild
                >
                  <Link to="/blog">
                    Tìm hiểu thêm
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Students Slide Section */}
      <section className="py-16 bg-gradient-to-br from-unicorn-pink/15 via-unicorn-purple/8 to-unicorn-pink/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4 animate-[slideInUp_1s_ease-out]">
              🌟 Sinh viên nổi bật
            </h2>
            <p className="text-lg text-muted-foreground animate-[slideInUp_1s_ease-out_0.2s_both]">
              Những gương mặt tài năng của Unicorn Team
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : students.length > 0 ? (
            <>
              <div className="flex items-center gap-6">
                {/* Previous Button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={prevStudentSlide}
                  disabled={currentStudentSlide === 0}
                  className="bg-white/90 backdrop-blur-sm border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 shadow-lg flex-shrink-0 hover:scale-110 transition-all duration-300 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>

                {/* Students Container */}
                <div className="flex-1 overflow-hidden">
                  <div 
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${(currentStudentSlide / 3) * 100}%)` }}
                  >
                    {Array.from({ length: Math.ceil(students.length / 3) }).map((_, slideIndex) => (
                      <div key={slideIndex} className="w-full flex-shrink-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {students.slice(slideIndex * 3, slideIndex * 3 + 3).map((student, index) => (
                            <Card 
                              key={student.id}
                              className={`group relative bg-gradient-to-br from-white via-white to-unicorn-pink/5 border-2 border-transparent hover:border-unicorn-pink/60 hover:shadow-2xl hover:shadow-unicorn-pink/20 transition-all duration-500 hover:scale-[1.02] cursor-pointer overflow-hidden animate-[slideInUp_0.6s_ease-out_${index * 0.15}s_both]`}
                            >
                              {/* Animated Background */}
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-unicorn-pink/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              
                              {/* Floating Particles Effect */}
                              <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-unicorn-pink/20 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{animationDelay: '0.5s'}} />
                                <div className="absolute top-1/3 -left-1 w-2 h-2 bg-unicorn-purple/30 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{animationDelay: '1s'}} />
                                <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-pink-400/20 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{animationDelay: '1.5s'}} />
                              </div>
                              
                              <CardHeader className="relative z-10 text-center pb-6">
                                {/* Avatar Section */}
                                <div className="relative mb-6">
                                  <div className="relative mx-auto w-24 h-24">
                                    <Avatar className="w-full h-full ring-4 ring-unicorn-pink/20 group-hover:ring-unicorn-pink/60 transition-all duration-500 group-hover:scale-110 shadow-lg">
                                      <AvatarImage src={student.avatar_url} className="object-cover" />
                                      <AvatarFallback className="bg-gradient-to-br from-unicorn-pink to-unicorn-purple text-white text-xl font-bold">
                                        {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                      </AvatarFallback>
                                    </Avatar>
                                    
                                    {/* Glowing Ring Effect */}
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-unicorn-pink/30 to-unicorn-purple/30 animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-500" />
                                    
                                    {/* Star Badge */}
                                    <div className="absolute -top-2 -right-2 z-20">
                                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500">
                                        <Star className="w-4 h-4 text-white animate-pulse" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Student Info */}
                                <div className="space-y-3">
                                  <CardTitle className="text-xl font-bold group-hover:text-unicorn-pink transition-colors duration-300">
                                    {student.name}
                                  </CardTitle>
                                  
                                  <Badge 
                                    variant="outline" 
                                    className="bg-gradient-to-r from-unicorn-pink/10 to-unicorn-purple/10 border-unicorn-pink/30 text-unicorn-pink font-medium px-3 py-1 group-hover:shadow-md transition-shadow duration-300"
                                  >
                                    {student.major}
                                  </Badge>
                                </div>
                              </CardHeader>

                              <CardContent className="relative z-10 pt-0 space-y-4">
                                {/* Contact Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group/btn"
                                    onClick={() => window.open(`tel:${student.phone}`)}
                                  >
                                    <Phone className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                                    Gọi
                                  </Button>
                                  
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-700 hover:from-emerald-100 hover:to-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:scale-[1.02] hover:shadow-md group/btn"
                                    onClick={() => window.open(`mailto:${student.email}`)}
                                  >
                                    <Mail className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                                    Email
                                  </Button>
                                </div>

                                {/* Contact Info Display */}
                                <div className="space-y-2">
                                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200 group-hover:border-unicorn-pink/30 transition-colors duration-300">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                      <span className="text-slate-700 font-medium">{student.phone}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 border border-slate-200 group-hover:border-unicorn-pink/30 transition-colors duration-300">
                                    <div className="flex items-center gap-2 text-sm">
                                      <Mail className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                      <span className="text-slate-700 font-medium truncate">{student.email}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Action Button */}
                                <Button 
                                  size="sm" 
                                  className="w-full bg-gradient-to-r from-unicorn-pink to-unicorn-purple hover:from-unicorn-pink/90 hover:to-unicorn-purple/90 text-white font-medium shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] transform group-hover:animate-pulse"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem Profile
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="lg"
                  onClick={nextStudentSlide}
                  disabled={currentStudentSlide >= students.length - 3}
                  className="bg-white/90 backdrop-blur-sm border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 shadow-lg flex-shrink-0 hover:scale-110 transition-all duration-300 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center mt-8 gap-3">
                {Array.from({ length: Math.ceil(students.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStudentSlide(index * 3)}
                    className={`transition-all duration-300 ${
                      Math.floor(currentStudentSlide / 3) === index
                        ? 'w-8 h-3 bg-gradient-to-r from-unicorn-pink to-unicorn-purple rounded-full shadow-lg'
                        : 'w-3 h-3 bg-gray-300 hover:bg-unicorn-pink/50 rounded-full hover:scale-125'
                    }`}
                  />
                ))}
              </div>
              
              {/* Statistics */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl p-6 group-hover:from-blue-500/20 group-hover:to-blue-600/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{students.length}</div>
                    <div className="text-sm text-blue-500 font-medium">Sinh viên xuất sắc</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 rounded-xl p-6 group-hover:from-emerald-500/20 group-hover:to-emerald-600/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                    <div className="text-sm text-emerald-500 font-medium">Tỷ lệ có việc làm</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl p-6 group-hover:from-purple-500/20 group-hover:to-purple-600/20 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">4.0</div>
                    <div className="text-sm text-purple-500 font-medium">GPA trung bình</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">Đang tải thông tin sinh viên...</p>
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts Slide Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4 animate-[slideInUp_1s_ease-out]">
              📝 Bài viết nổi bật
            </h2>
            <p className="text-lg text-muted-foreground animate-[slideInUp_1s_ease-out_0.2s_both]">
              Chia sẻ kiến thức và kinh nghiệm từ cộng đồng
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Featured Blog Post (2/5 width) */}
            <div className="lg:col-span-2">
              <Card className="h-full group cursor-pointer overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border-unicorn-pink/20">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={blogPosts[currentBlogSlide]?.image} 
                    alt={blogPosts[currentBlogSlide]?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-unicorn-pink text-white">
                    Nổi bật
                  </Badge>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-unicorn-pink transition-colors">
                      {blogPosts[currentBlogSlide]?.title}
                    </h3>
                    <p className="text-sm opacity-90 line-clamp-2">
                      {blogPosts[currentBlogSlide]?.excerpt}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{blogPosts[currentBlogSlide]?.author}</span>
                    <span>{blogPosts[currentBlogSlide]?.date}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {blogPosts[currentBlogSlide]?.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      {blogPosts[currentBlogSlide]?.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {blogPosts[currentBlogSlide]?.comments}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Blog List (3/5 width) */}
            <div className="lg:col-span-3 space-y-4">
              {blogPosts.slice(1, 5).map((post, index) => (
                <Card key={post.id} className={`group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border-unicorn-pink/20 animate-[slideInUp_0.4s_ease-out_${index * 0.1}s_both]`}>
                  <div className="flex">
                    <div className="relative w-32 h-24 overflow-hidden flex-shrink-0">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="flex-1 p-4">
                      <h4 className="font-semibold text-gray-900 group-hover:text-unicorn-pink transition-colors duration-300 line-clamp-2 mb-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{post.author}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {post.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {post.likes}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={prevBlogSlide}
              className="border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex gap-2">
              {blogPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBlogSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentBlogSlide === index
                      ? 'bg-unicorn-pink w-6'
                      : 'bg-gray-300 hover:bg-unicorn-pink/50'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextBlogSlide}
              className="border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="text-center mt-8">
            <Button 
              size="lg" 
              variant="outline" 
              className="border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 px-8 py-4 hover:scale-110 transition-all duration-300 hover:shadow-lg"
              asChild
            >
              <Link to="/blog">
                Xem tất cả bài viết
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-unicorn-pink rounded-full animate-[float_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-unicorn-purple rounded-full animate-[float_6s_ease-in-out_infinite_reverse]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="animate-[slideInUp_1s_ease-out_0.2s_both]">
              <h3 className="text-xl font-bold text-unicorn-pink mb-4">Unicorn Team</h3>
              <p className="text-gray-300 mb-4">
                Nơi khơi nguồn đam mê công nghệ và kết nối tài năng trẻ, 
                tạo ra những giải pháp sáng tạo cho tương lai.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-unicorn-pink transition-colors duration-300">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-unicorn-pink transition-colors duration-300">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-unicorn-pink transition-colors duration-300">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="animate-[slideInUp_1s_ease-out_0.4s_both]">
              <h3 className="text-xl font-bold text-unicorn-pink mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-300 hover:text-unicorn-pink transition-colors duration-300">Blog</Link></li>
                <li><Link to="/events" className="text-gray-300 hover:text-unicorn-pink transition-colors duration-300">Sự kiện</Link></li>
                <li><Link to="/students" className="text-gray-300 hover:text-unicorn-pink transition-colors duration-300">Sinh viên</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-unicorn-pink transition-colors duration-300">Liên hệ</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="animate-[slideInUp_1s_ease-out_0.6s_both]">
              <h3 className="text-xl font-bold text-unicorn-pink mb-4">Liên hệ</h3>
              <div className="space-y-2">
                <div className="flex items-center group">
                  <Mail className="w-5 h-5 text-unicorn-pink mr-3 group-hover:animate-bounce" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">contact@unicornteam.vn</span>
                </div>
                <div className="flex items-center group">
                  <Phone className="w-5 h-5 text-unicorn-pink mr-3 group-hover:animate-bounce" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">+84 123 456 789</span>
                </div>
                <div className="flex items-center group">
                  <MapPin className="w-5 h-5 text-unicorn-pink mr-3 group-hover:animate-bounce" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">FPT University, Hà Nội</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center animate-[slideInUp_1s_ease-out_0.8s_both]">
            <p className="text-gray-300 hover:text-unicorn-pink transition-colors duration-300 cursor-default">
              © 2025 Unicorn Team. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
