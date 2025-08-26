import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useAdmin } from "@/contexts/AdminContext";
import BlogService, { BlogPostUI } from "@/services/blogService";
import BlogStatsService from "@/services/blogStatsService";
import CreateBlogModal from "@/components/CreateBlogModal";
import RecentBlogs from "@/components/RecentBlogs";
import { getMarkdownPreview, getMarkdownReadingTime } from "@/lib/markdownUtils";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  Search,
  Plus,
  Heart,
  Share2,
  Calendar,
  Clock,
  Eye,
  Bookmark,
  TrendingUp,
  Sparkles,
  Loader2,
  Edit,
  Trash2
} from "lucide-react";

export default function Blog() {
  const { isAdminMode } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogPosts, setBlogPosts] = useState<BlogPostUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [blogStats, setBlogStats] = useState<Record<number, { views: number; likes: number }>>({});

  // Fetch blogs from API when component mounts
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiBlogs = await BlogService.getAllBlogs();
      const uiBlogs = apiBlogs.map(blog => BlogService.transformToUIFormat(blog));
      setBlogPosts(uiBlogs);
      
      // Fetch stats for all blogs
      const stats: Record<number, { views: number; likes: number }> = {};
      for (const blog of apiBlogs) {
        const blogStats = await BlogStatsService.getBlogStats(blog.id);
        stats[blog.id] = {
          views: blogStats.views,
          likes: blogStats.likes
        };
      }
      setBlogStats(stats);
    } catch (err) {
      setError('Không thể tải dữ liệu blog. Vui lòng thử lại sau.');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (blogData: { title: string; content: string; author?: string; image_url?: string }) => {
    try {
      const newBlog = await BlogService.createBlog(blogData);
      const uiBlog = BlogService.transformToUIFormat(newBlog);
      
      // Initialize stats for new blog
      BlogStatsService.initializeBlogStats(newBlog.id);
      
      setBlogPosts(prev => [uiBlog, ...prev]);
    } catch (err) {
      setError('Không thể tạo blog mới.');
      console.error('Error creating blog:', err);
    }
  };

  const handleDeleteBlog = async (id: number) => {
    try {
      await BlogService.deleteBlog(id);
      setBlogPosts(prev => prev.filter(blog => blog.id !== id));
    } catch (err) {
      setError('Không thể xóa blog.');
      console.error('Error deleting blog:', err);
    }
  };

  const categories = [
    { id: "all", name: "Tất cả", icon: "📚" },
    { id: "orientation", name: "Nhập học", icon: "🎓" },
    { id: "military", name: "Quân sự", icon: "🎖️" },
    { id: "student-life", name: "Sinh viên", icon: "🎉" },
    { id: "life-skills", name: "Kỹ năng sống", icon: "💡" },
    { id: "study", name: "Học tập", icon: "📖" }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-unicorn-pink" />
          <p className="text-muted-foreground">Đang tải blog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchBlogs} className="bg-unicorn-pink hover:bg-unicorn-pink-dark">
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
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent">
              Blog & Hoạt động
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chia sẻ kiến thức, kinh nghiệm và thông tin về các hoạt động sắp tới của Unicorn Team
            {isAdminMode && <span className="block text-orange-500 font-semibold mt-2">🔧 ADMIN MODE: Quản lý Blog</span>}
          </p>
        </div>

        {/* Search and Categories */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-unicorn-pink/20 focus:border-unicorn-pink"
              />
            </div>
            {isAdminMode && (
              <Button className="bg-unicorn-purple hover:bg-unicorn-purple-light text-white" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Viết bài mới
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2",
                  selectedCategory === category.id 
                    ? "bg-unicorn-pink hover:bg-unicorn-pink-dark text-white" 
                    : "border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"
                )}
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* No blogs message */}
        {blogPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Chưa có blog nào</h3>
            <p className="text-muted-foreground mb-4">
              {isAdminMode ? "Hãy tạo blog đầu tiên của bạn!" : "Hiện tại chưa có bài blog nào. Hãy quay lại sau!"}
            </p>
            {isAdminMode && (
              <Button className="bg-unicorn-pink hover:bg-unicorn-pink-dark" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Viết bài đầu tiên
              </Button>
            )}
          </div>
        )}

        {/* Main Content Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Featured Post */}
            {featuredPost && (
              <Card className="mb-8 overflow-hidden bg-gradient-to-r from-unicorn-pink/5 to-unicorn-purple/5 border-unicorn-pink/20">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={featuredPost.image_url || '/images/blog-default.jpg'} 
                      alt={featuredPost.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="bg-unicorn-pink text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Nổi bật
                      </Badge>
                      <Badge variant="outline" className="border-unicorn-purple text-unicorn-purple">
                        {categories.find(cat => cat.id === featuredPost.category)?.name || 'Chung'}
                      </Badge>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 line-clamp-2">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {getMarkdownPreview(featuredPost.excerpt, 200)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={featuredPost.authorInfo.avatar} />
                          <AvatarFallback className="bg-unicorn-pink text-white">
                            {featuredPost.authorInfo.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{featuredPost.authorInfo.name}</p>
                          <p className="text-xs text-muted-foreground">{featuredPost.authorInfo.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredPost.publishDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Blog Posts Grid */}
            {filteredPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 border-unicorn-pink/10 hover:border-unicorn-pink/30">
                <div className="relative">
                  <img 
                    src={post.image_url || '/images/blog-default.jpg'} 
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-unicorn-pink/90 text-white backdrop-blur-sm">
                      {categories.find(cat => cat.id === post.category)?.icon} {categories.find(cat => cat.id === post.category)?.name || 'Chung'}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        "w-8 h-8 p-0 backdrop-blur-sm",
                        post.isBookmarked 
                          ? "bg-unicorn-pink text-white hover:bg-unicorn-pink/80" 
                          : "bg-white/80 text-gray-600 hover:bg-white"
                      )}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <Link to={`/blog/${post.id}`}>
                    <CardTitle className="text-lg line-clamp-2 hover:text-unicorn-pink transition-colors cursor-pointer">
                      {post.title}
                    </CardTitle>
                  </Link>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={post.authorInfo.avatar} />
                      <AvatarFallback className="bg-unicorn-pink text-white text-xs">
                        {post.authorInfo.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{post.authorInfo.name}</p>
                      <p className="text-xs text-muted-foreground">{post.authorInfo.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {getMarkdownPreview(post.excerpt, 150)}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-unicorn-pink/30 text-unicorn-pink">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-unicorn-pink/30 text-unicorn-pink">
                        +{post.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-unicorn-pink/10">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {blogStats[post.id]?.likes || BlogStatsService.getLikeCount(post.id)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {blogStats[post.id]?.views || BlogStatsService.getViewCount(post.id)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Bookmark className="w-4 h-4" />
                        Lưu
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isAdminMode && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-unicorn-pink"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No results found */}
        {filteredPosts.length === 0 && !loading && blogPosts.length > 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">Không tìm thấy blog nào</h3>
            <p className="text-muted-foreground mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
              className="border-unicorn-pink text-unicorn-pink hover:bg-unicorn-pink/10"
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="lg:w-80 space-y-6">
        <RecentBlogs />
      </div>
    </div>

    {/* Create Blog Modal */}
    {isAdminMode && (
      <CreateBlogModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBlog}
      />
    )}
  </div>
</div>
  );
}
