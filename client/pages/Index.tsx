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

  // Mock students data
  const mockStudents = [
    { id: 1, name: "Nguyễn Văn A", department: "Công nghệ thông tin", avatar_url: "/Unicorn1.jpg", status: "active" },
    { id: 2, name: "Trần Thị B", department: "Khoa học máy tính", avatar_url: "/Unicorn2.jpg", status: "active" },
    { id: 3, name: "Lê Văn C", department: "Kỹ thuật phần mềm", avatar_url: "/Unicorn3.jpg", status: "active" },
    { id: 4, name: "Phạm Thị D", department: "An toàn thông tin", avatar_url: "/Unicorn4.jpg", status: "active" },
    { id: 5, name: "Hoàng Văn E", department: "Trí tuệ nhân tạo", avatar_url: "/Unicorn5.jpg", status: "active" },
    { id: 6, name: "Vũ Thị F", department: "Công nghệ thông tin", avatar_url: "/Unicorn1.jpg", status: "active" },
    { id: 7, name: "Đỗ Văn G", department: "Khoa học máy tính", avatar_url: "/Unicorn2.jpg", status: "active" },
    { id: 8, name: "Bùi Thị H", department: "Kỹ thuật phần mềm", avatar_url: "/Unicorn3.jpg", status: "active" },
    { id: 9, name: "Ngô Văn I", department: "An toàn thông tin", avatar_url: "/Unicorn4.jpg", status: "active" },
    { id: 10, name: "Lương Thị K", department: "Trí tuệ nhân tạo", avatar_url: "/Unicorn5.jpg", status: "active" },
    { id: 11, name: "Đinh Văn L", department: "Công nghệ thông tin", avatar_url: "/Unicorn1.jpg", status: "active" },
    { id: 12, name: "Cao Thị M", department: "Khoa học máy tính", avatar_url: "/Unicorn2.jpg", status: "active" },
    { id: 13, name: "Tô Văn N", department: "Kỹ thuật phần mềm", avatar_url: "/Unicorn3.jpg", status: "active" },
    { id: 14, name: "Mai Thị O", department: "An toàn thông tin", avatar_url: "/Unicorn4.jpg", status: "active" },
    { id: 15, name: "Dương Văn P", department: "Trí tuệ nhân tạo", avatar_url: "/Unicorn5.jpg", status: "active" },
    { id: 16, name: "Chu Thị Q", department: "Công nghệ thông tin", avatar_url: "/Unicorn1.jpg", status: "active" },
    { id: 17, name: "Hà Văn R", department: "Khoa học máy tính", avatar_url: "/Unicorn2.jpg", status: "active" },
    { id: 18, name: "Từ Thị S", department: "Kỹ thuật phần mềm", avatar_url: "/Unicorn3.jpg", status: "active" },
    { id: 19, name: "Kiều Văn T", department: "An toàn thông tin", avatar_url: "/Unicorn4.jpg", status: "active" },
    { id: 20, name: "Lạc Thị U", department: "Trí tuệ nhân tạo", avatar_url: "/Unicorn5.jpg", status: "active" }
  ];

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
      author: "Event Team",
      date: "2025-01-15",
      image: "/Unicorn3.jpg",
      views: 1580,
      likes: 134,
      comments: 45
    },
    {
      id: 4,
      title: "Kinh nghiệm học lập trình từ sinh viên năm cuối",
      excerpt: "Chia sẻ những bài học quý báu và lời khuyên từ các sinh viên đã thành công...",
      author: "Senior Student",
      date: "2025-01-12",
      image: "/Unicorn4.jpg",
      views: 720,
      likes: 54,
      comments: 18
    },
    {
      id: 5,
      title: "Dự án thực tế - Xây dựng hệ thống quản lý sinh viên",
      excerpt: "Chi tiết về dự án thực tế mà team đã phát triển và những thách thức đã vượt qua...",
      author: "Project Lead",
      date: "2025-01-10",
      image: "/Unicorn5.jpg",
      views: 965,
      likes: 78,
      comments: 32
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10">
      
      {/* Slide Banner Section */}
      <section className="relative h-[80vh] min-h-[700px] overflow-hidden">
        {/* Animated Background Slider */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full">
            {/* Multiple background slides */}
            <div className="absolute inset-0 animate-[slideShow_12s_infinite]">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3)), url('/Unicorn1.jpg')`
                }}
              />
            </div>
            <div className="absolute inset-0 animate-[slideShow_12s_infinite] opacity-0" style={{animationDelay: '4s'}}>
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                style={{
                  backgroundImage: `linear-gradient(rgba(147, 51, 234, 0.4), rgba(236, 72, 153, 0.4)), url('/Unicorn2.jpg')`
                }}
              />
            </div>
            <div className="absolute inset-0 animate-[slideShow_12s_infinite] opacity-0" style={{animationDelay: '8s'}}>
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                style={{
                  backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.4), rgba(147, 51, 234, 0.4)), url('/Unicorn3.jpg')`
                }}
              />
            </div>
          </div>
        </div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-[float_6s_ease-in-out_infinite]"></div>
          <div className="absolute top-32 right-20 w-3 h-3 bg-unicorn-pink/40 rounded-full animate-[float_8s_ease-in-out_infinite] delay-1000"></div>
          <div className="absolute bottom-40 left-32 w-4 h-4 bg-unicorn-purple/40 rounded-full animate-[float_10s_ease-in-out_infinite] delay-2000"></div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-[float_7s_ease-in-out_infinite] delay-3000"></div>
          <div className="absolute bottom-20 right-40 w-3 h-3 bg-unicorn-pink/30 rounded-full animate-[float_9s_ease-in-out_infinite] delay-4000"></div>
        </div>
        
        {/* Main Content with Enhanced Animations */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-5xl mx-auto px-4">
            {/* Animated Icon */}
            <div className="mb-8 animate-[bounceIn_1.5s_ease-out]">
              <div className="relative inline-block">
                <Sparkles className="w-20 h-20 mx-auto text-white animate-[sparkle_2s_ease-in-out_infinite]" />
                <div className="absolute inset-0 animate-ping">
                  <Sparkles className="w-20 h-20 mx-auto text-unicorn-pink/50" />
                </div>
              </div>
            </div>

            {/* Animated Title */}
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight animate-[slideInUp_1s_ease-out_0.3s_both]">
              <span className="inline-block animate-[glow_3s_ease-in-out_infinite]">Unicorn</span>{' '}
              <span className="text-unicorn-pink inline-block animate-[glow_3s_ease-in-out_infinite] delay-500">Team</span>
            </h1>

            {/* Animated Subtitle */}
            <p className="text-xl md:text-3xl mb-10 text-gray-100 leading-relaxed animate-[slideInUp_1s_ease-out_0.6s_both] max-w-4xl mx-auto">
              Nơi ươm mầm tài năng công nghệ - Cùng nhau xây dựng thế hệ{' '}
              <span className="text-unicorn-pink font-semibold animate-[pulse_2s_infinite]">developer tài năng</span>
            </p>

            {/* Animated Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-[slideInUp_1s_ease-out_0.9s_both]">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple hover:from-unicorn-purple hover:to-unicorn-pink text-white px-10 py-5 text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-[pulse_3s_infinite]"
                asChild
              >
                <Link to="/events">
                  <Rocket className="mr-3 w-6 h-6" />
                  Tham gia sự kiện
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-3 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 text-lg font-semibold backdrop-blur-sm bg-white/10 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                asChild
              >
                <Link to="/students">
                  <Users className="mr-3 w-6 h-6" />
                  Xem sinh viên
                </Link>
              </Button>
            </div>

            {/* Animated Stats Bar */}
            <div className="mt-12 animate-[slideInUp_1s_ease-out_1.2s_both]">
              <div className="flex flex-wrap justify-center gap-8 text-white/90">
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl font-bold text-unicorn-pink animate-[countUp_2s_ease-out_1.5s_both]">20+</div>
                  <div className="text-sm uppercase tracking-wider">Sinh viên</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl font-bold text-unicorn-purple animate-[countUp_2s_ease-out_1.7s_both]">12+</div>
                  <div className="text-sm uppercase tracking-wider">Sự kiện</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl font-bold text-white animate-[countUp_2s_ease-out_1.9s_both]">15+</div>
                  <div className="text-sm uppercase tracking-wider">Giải thưởng</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-20 left-20 animate-[float_6s_ease-in-out_infinite]">
          <Code className="w-10 h-10 text-white/30 transform hover:text-unicorn-pink transition-colors duration-300" />
        </div>
        <div className="absolute bottom-32 right-20 animate-[float_8s_ease-in-out_infinite] delay-1000">
          <Rocket className="w-12 h-12 text-white/30 transform hover:text-unicorn-purple transition-colors duration-300" />
        </div>
        <div className="absolute top-1/3 right-32 animate-[float_7s_ease-in-out_infinite] delay-2000">
          <Lightbulb className="w-8 h-8 text-white/30 transform hover:text-yellow-400 transition-colors duration-300" />
        </div>
        <div className="absolute top-1/4 left-1/4 animate-[float_9s_ease-in-out_infinite] delay-3000">
          <Target className="w-9 h-9 text-white/25 transform hover:text-unicorn-pink transition-colors duration-300" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-[float_10s_ease-in-out_infinite] delay-4000">
          <Zap className="w-7 h-7 text-white/25 transform hover:text-yellow-300 transition-colors duration-300" />
        </div>
        <div className="absolute top-16 right-1/3 animate-[float_11s_ease-in-out_infinite] delay-5000">
          <Heart className="w-6 h-6 text-white/25 transform hover:text-red-400 transition-colors duration-300" />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          {/* Left Column - About & Features */}
          <div className="space-y-8 animate-[slideInUp_1s_ease-out_0.2s_both]">
            {/* About Section */}
            <Card className="border-unicorn-pink/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent group-hover:animate-pulse">
                  Về Unicorn Team
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Unicorn Team là một cộng đồng sinh viên đam mê công nghệ, nơi chúng tôi nuôi dưỡng tài năng 
                  và tạo ra những giá trị đột phá trong lĩnh vực phát triển phần mềm.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Với tinh thần "kỳ lân", chúng tôi luôn hướng tới sự xuất sắc, sáng tạo và làm việc nhóm hiệu quả.
                </p>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="border-unicorn-pink/20 hover:shadow-lg transition-all duration-500 hover:scale-105 group animate-[slideInUp_0.8s_ease-out_0.4s_both]">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-unicorn-pink mx-auto mb-4 group-hover:animate-bounce" />
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-unicorn-pink transition-colors">Cộng đồng mạnh mẽ</h3>
                  <p className="text-gray-600 text-sm">20+ sinh viên tài năng cùng học hỏi và phát triển</p>
                </CardContent>
              </Card>

              <Card className="border-unicorn-pink/20 hover:shadow-lg transition-all duration-500 hover:scale-105 group animate-[slideInUp_0.8s_ease-out_0.6s_both]">
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-unicorn-purple mx-auto mb-4 group-hover:animate-bounce" />
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-unicorn-purple transition-colors">Sự kiện thường xuyên</h3>
                  <p className="text-gray-600 text-sm">Workshop, hackathon và hoạt động giao lưu</p>
                </CardContent>
              </Card>

              <Card className="border-unicorn-pink/20 hover:shadow-lg transition-all duration-500 hover:scale-105 group animate-[slideInUp_0.8s_ease-out_0.8s_both]">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-12 h-12 text-unicorn-pink mx-auto mb-4 group-hover:animate-bounce" />
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-unicorn-pink transition-colors">Thành tựu cao</h3>
                  <p className="text-gray-600 text-sm">Nhiều giải thưởng và dự án xuất sắc</p>
                </CardContent>
              </Card>

              <Card className="border-unicorn-pink/20 hover:shadow-lg transition-all duration-500 hover:scale-105 group animate-[slideInUp_0.8s_ease-out_1s_both]">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-unicorn-purple mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Mục tiêu rõ ràng</h3>
                  <p className="text-gray-600 text-sm">Phát triển kỹ năng và sự nghiệp bền vững</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="flex items-center justify-center animate-[slideInUp_1s_ease-out_0.4s_both]">
            <Card className="border-unicorn-pink/20 shadow-xl overflow-hidden w-full hover:shadow-2xl transition-all duration-700 hover:scale-105 group relative">
              {/* Animated Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-unicorn-pink to-unicorn-purple p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="bg-white rounded-lg h-full w-full"></div>
              </div>
              
              <div className="aspect-[4/3] relative overflow-hidden rounded-lg">
                <img 
                  src="/Unicorn1.jpg" 
                  alt="Unicorn Team" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-unicorn-pink/20 group-hover:to-unicorn-purple/10 transition-all duration-500 z-20" />
                
                {/* Floating Animation Elements */}
                <div className="absolute top-4 right-4 z-30">
                  <div className="w-3 h-3 bg-unicorn-pink rounded-full animate-[float_3s_ease-in-out_infinite] opacity-70"></div>
                </div>
                <div className="absolute bottom-4 right-8 z-30">
                  <div className="w-2 h-2 bg-unicorn-purple rounded-full animate-[float_4s_ease-in-out_infinite] opacity-60"></div>
                </div>
                
                <div className="absolute bottom-6 left-6 text-white z-30 group-hover:translate-y-0 translate-y-2 transition-transform duration-500">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-unicorn-pink transition-colors duration-300">Unicorn Team 2025</h3>
                  <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">Đại gia đình công nghệ tài năng</p>
                </div>
                
                {/* Overlay Sparkle Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-25">
                  <div className="absolute top-1/4 left-1/3 w-1 h-1 bg-white rounded-full animate-[sparkle_2s_ease-in-out_infinite]"></div>
                  <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-unicorn-pink rounded-full animate-[sparkle_2s_ease-in-out_infinite] delay-500"></div>
                  <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-unicorn-purple rounded-full animate-[sparkle_2s_ease-in-out_infinite] delay-1000"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gradient-to-br from-unicorn-pink/15 via-unicorn-purple/8 to-unicorn-pink/15 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4 animate-[slideInUp_1s_ease-out]">
              Thành tựu nổi bật
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-[slideInUp_1s_ease-out_0.2s_both]">
              Những con số ấn tượng của Unicorn Team trong hành trình phát triển
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-unicorn-pink/20 hover:shadow-lg hover:scale-105 transition-all duration-500 text-center animate-[slideInUp_0.8s_ease-out_0.4s_both]">
              <CardContent className="p-8">
                <Users className="w-12 h-12 text-unicorn-pink mx-auto mb-4 animate-[bounce_2s_infinite]" />
                <div className="text-3xl font-bold text-gray-900 mb-2 animate-[countUp_1.5s_ease-out_0.6s_both]">20</div>
                <div className="text-gray-600">Sinh viên tài năng</div>
              </CardContent>
            </Card>

            <Card className="border-unicorn-pink/20 hover:shadow-lg hover:scale-105 transition-all duration-500 text-center animate-[slideInUp_0.8s_ease-out_0.6s_both]">
              <CardContent className="p-8">
                <Calendar className="w-12 h-12 text-unicorn-purple mx-auto mb-4 animate-[bounce_2s_infinite_0.2s]" />
                <div className="text-3xl font-bold text-gray-900 mb-2 animate-[countUp_1.5s_ease-out_0.8s_both]">12</div>
                <div className="text-gray-600">Sự kiện đã tổ chức</div>
              </CardContent>
            </Card>

            <Card className="border-unicorn-pink/20 hover:shadow-lg hover:scale-105 transition-all duration-500 text-center animate-[slideInUp_0.8s_ease-out_0.8s_both]">
              <CardContent className="p-8">
                <Code className="w-12 h-12 text-unicorn-pink mx-auto mb-4 animate-[bounce_2s_infinite_0.4s]" />
                <div className="text-3xl font-bold text-gray-900 mb-2 animate-[countUp_1.5s_ease-out_1s_both]">8</div>
                <div className="text-gray-600">Dự án hoàn thành</div>
              </CardContent>
            </Card>

            <Card className="border-unicorn-pink/20 hover:shadow-lg hover:scale-105 transition-all duration-500 text-center animate-[slideInUp_0.8s_ease-out_1s_both]">
              <CardContent className="p-8">
                <Trophy className="w-12 h-12 text-unicorn-purple mx-auto mb-4 animate-[bounce_2s_infinite_0.6s]" />
                <div className="text-3xl font-bold text-gray-900 mb-2 animate-[countUp_1.5s_ease-out_1.2s_both]">15</div>
                <div className="text-gray-600">Giải thưởng đạt được</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-unicorn-pink/20 rounded-full animate-[float_6s_ease-in-out_infinite]"></div>
          <div className="absolute -top-5 -right-5 w-24 h-24 bg-unicorn-purple/20 rounded-full animate-[float_8s_ease-in-out_infinite_reverse]"></div>
          <div className="absolute -bottom-10 -left-5 w-28 h-28 bg-unicorn-pink/15 rounded-full animate-[float_7s_ease-in-out_infinite_1s]"></div>
          <div className="absolute -bottom-5 -right-10 w-20 h-20 bg-unicorn-purple/15 rounded-full animate-[float_9s_ease-in-out_infinite_2s]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <Card className="border-unicorn-pink/20 shadow-xl bg-gradient-to-r from-unicorn-pink/10 to-unicorn-purple/10 hover:shadow-2xl transition-all duration-700 hover:scale-105 animate-[slideInUp_1s_ease-out] relative overflow-hidden">
            {/* Card Background Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-unicorn-pink/5 to-unicorn-purple/5 animate-[glow_3s_ease-in-out_infinite_alternate]"></div>
            
            <CardContent className="p-12 relative z-10">
              <Sparkles className="w-16 h-16 text-unicorn-pink mx-auto mb-6 animate-[bounce_2s_infinite] hover:animate-[sparkle_1s_ease-in-out_infinite]" />
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-6 animate-[slideInUp_1s_ease-out_0.2s_both] hover:animate-pulse">
                Sẵn sàng tham gia Unicorn Team?
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed animate-[slideInUp_1s_ease-out_0.4s_both]">
                Hãy cùng chúng tôi tạo nên những điều kỳ diệu trong thế giới công nghệ. 
                Tham gia ngay để trở thành một phần của gia đình Unicorn Team!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-[slideInUp_1s_ease-out_0.6s_both]">
                <Button 
                  size="lg" 
                  className="bg-unicorn-pink hover:bg-unicorn-pink/90 text-white px-8 py-4 hover:scale-110 transition-all duration-300 animate-[glow_2s_ease-in-out_infinite_alternate] shadow-lg hover:shadow-unicorn-pink/50"
                  asChild
                >
                  <Link to="/events">
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
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4 animate-[slideInUp_1s_ease-out]">
              Sinh viên nổi bật
            </h2>
            <p className="text-lg text-muted-foreground animate-[slideInUp_1s_ease-out_0.2s_both]">
              Những gương mặt tài năng của Unicorn Team
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Previous Button - Outside container */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStudentSlide(Math.max(0, currentStudentSlide - 4))}
              disabled={currentStudentSlide === 0}
              className="bg-white/90 backdrop-blur-sm border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 shadow-lg flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Students Container */}
            <div className="flex-1 overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${(currentStudentSlide / 4) * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(mockStudents.length / 4) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {mockStudents.slice(slideIndex * 4, slideIndex * 4 + 4).map((student, index) => (
                        <Card 
                          key={student.id}
                          className={`border-unicorn-pink/20 hover:shadow-xl transition-all duration-500 hover:scale-105 group cursor-pointer animate-[slideInUp_0.6s_ease-out_${index * 0.1}s_both]`}
                        >
                          <CardHeader className="text-center pb-4">
                            <div className="relative">
                              <Avatar className="w-20 h-20 mx-auto mb-3 ring-2 ring-unicorn-pink/20 group-hover:ring-unicorn-pink/50 transition-all duration-300 hover:animate-pulse">
                                <AvatarImage src={student.avatar_url} />
                                <AvatarFallback className="bg-gradient-to-br from-unicorn-pink to-unicorn-purple text-white text-xl">
                                  {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -top-2 -right-2">
                                <div className="w-6 h-6 bg-gradient-to-r from-unicorn-pink to-unicorn-purple rounded-full flex items-center justify-center animate-[glow_2s_ease-in-out_infinite_alternate]">
                                  <Star className="w-3 h-3 text-white animate-[sparkle_1.5s_ease-in-out_infinite]" />
                                </div>
                              </div>
                            </div>
                            <CardTitle className="text-lg group-hover:text-unicorn-pink transition-colors">
                              {student.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {student.department}
                            </CardDescription>
                            <Badge className="bg-gradient-to-r from-unicorn-pink to-unicorn-purple text-white hover:animate-pulse">
                              {student.status === "active" ? "Đang học" : "Tạm dừng"}
                            </Badge>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button - Outside container */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentStudentSlide(Math.min(mockStudents.length - 4, currentStudentSlide + 4))}
              disabled={currentStudentSlide >= mockStudents.length - 4}
              className="bg-white/90 backdrop-blur-sm border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 shadow-lg flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(mockStudents.length / 4) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStudentSlide(index * 4)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    Math.floor(currentStudentSlide / 4) === index
                      ? 'bg-unicorn-pink'
                      : 'bg-gray-300 hover:bg-unicorn-pink/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Slide Section - 1:2:2 Layout */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent mb-4 animate-[slideInUp_1s_ease-out]">
              Bài viết nổi bật
            </h2>
            <p className="text-lg text-muted-foreground animate-[slideInUp_1s_ease-out_0.2s_both]">
              Chia sẻ kiến thức và kinh nghiệm từ cộng đồng
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Previous Button - Outside container */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentBlogSlide(Math.max(0, currentBlogSlide - 1))}
              disabled={currentBlogSlide === 0}
              className="bg-white/90 backdrop-blur-sm border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 shadow-lg flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Blog Container */}
            <div className="flex-1 overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentBlogSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(blogPosts.length / 5) }).map((_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    {/* 1 bài to + 4 bài nhỏ (2:2) Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
                      {/* Bài to (1 column) */}
                      {blogPosts.slice(slideIndex * 5, slideIndex * 5 + 1).map((post) => (
                        <Card 
                          key={post.id}
                          className="lg:col-span-1 border-unicorn-pink/20 hover:shadow-xl transition-all duration-500 hover:scale-105 group cursor-pointer animate-[slideInUp_0.6s_ease-out_0s_both] h-full"
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <Badge className="absolute top-4 left-4 bg-unicorn-pink text-white">
                              Nổi bật
                            </Badge>
                          </div>
                          <CardHeader className="flex-1">
                            <CardTitle className="text-lg group-hover:text-unicorn-pink transition-colors line-clamp-2">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="text-sm line-clamp-3">
                              {post.excerpt}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                              <span className="font-medium">{post.author}</span>
                              <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {post.likes}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {post.comments}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {/* 4 bài nhỏ (2:2) - 2 columns */}
                      <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {blogPosts.slice(slideIndex * 5 + 1, slideIndex * 5 + 5).map((post, index) => (
                          <Card 
                            key={post.id}
                            className="border-unicorn-pink/20 hover:shadow-xl transition-all duration-500 hover:scale-105 group cursor-pointer animate-[slideInUp_0.6s_ease-out_0.1s_both]"
                          >
                            <div className="relative h-24 overflow-hidden">
                              <img 
                                src={post.image} 
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            </div>
                            <CardHeader className="p-3">
                              <CardTitle className="text-sm group-hover:text-unicorn-pink transition-colors line-clamp-2">
                                {post.title}
                              </CardTitle>
                              <CardDescription className="text-xs line-clamp-2">
                                {post.excerpt}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                                <span>{post.author}</span>
                                <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {post.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3" />
                                  {post.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {post.comments}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button - Outside container */}
            <Button
              variant="outline"
              size="lg"
              onClick={() => setCurrentBlogSlide(Math.min(Math.ceil(blogPosts.length / 5) - 1, currentBlogSlide + 1))}
              disabled={currentBlogSlide >= Math.ceil(blogPosts.length / 5) - 1}
              className="bg-white/90 backdrop-blur-sm border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10 shadow-lg flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Pagination dots */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {Array.from({ length: Math.ceil(blogPosts.length / 5) }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBlogSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentBlogSlide === index
                      ? 'bg-unicorn-pink'
                      : 'bg-gray-300 hover:bg-unicorn-pink/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-unicorn-pink rounded-full animate-[float_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-unicorn-purple rounded-full animate-[float_10s_ease-in-out_infinite] delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-unicorn-pink rounded-full animate-[float_6s_ease-in-out_infinite] delay-4000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About */}
            <div className="animate-[slideInUp_1s_ease-out_0.2s_both]">
              <div className="flex items-center mb-4 group">
                <Sparkles className="w-8 h-8 text-unicorn-pink mr-2 group-hover:animate-spin transition-all duration-300" />
                <span className="text-xl font-bold group-hover:text-unicorn-pink transition-colors duration-300">Unicorn Team</span>
              </div>
              <p className="text-gray-300 leading-relaxed hover:text-gray-200 transition-colors duration-300">
                Cộng đồng sinh viên đam mê công nghệ, nơi ươm mầm tài năng và tạo ra những giá trị đột phá.
              </p>
            </div>

            {/* Quick Links */}
            <div className="animate-[slideInUp_1s_ease-out_0.4s_both]">
              <h3 className="text-lg font-semibold mb-4 hover:text-unicorn-pink transition-colors duration-300">Liên kết nhanh</h3>
              <div className="space-y-2">
                <Link to="/events" className="block text-gray-300 hover:text-unicorn-pink transition-all duration-300 hover:translate-x-2 hover:scale-105">
                  Sự kiện
                </Link>
                <Link to="/students" className="block text-gray-300 hover:text-unicorn-pink transition-all duration-300 hover:translate-x-2 hover:scale-105">
                  Sinh viên
                </Link>
                <Link to="/blog" className="block text-gray-300 hover:text-unicorn-pink transition-all duration-300 hover:translate-x-2 hover:scale-105">
                  Blog
                </Link>
                <Link to="/contact" className="block text-gray-300 hover:text-unicorn-pink transition-all duration-300 hover:translate-x-2 hover:scale-105">
                  Liên hệ
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="animate-[slideInUp_1s_ease-out_0.6s_both]">
              <h3 className="text-lg font-semibold mb-4 hover:text-unicorn-purple transition-colors duration-300">Liên hệ</h3>
              <div className="space-y-3">
                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-unicorn-pink mr-3 group-hover:animate-bounce" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">contact@unicornteam.dev</span>
                </div>
                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-unicorn-pink mr-3 group-hover:animate-bounce" />
                  <span className="text-gray-300 group-hover:text-white transition-colors duration-300">+84 123 456 789</span>
                </div>
                <div className="flex items-center group hover:translate-x-2 transition-transform duration-300">
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

