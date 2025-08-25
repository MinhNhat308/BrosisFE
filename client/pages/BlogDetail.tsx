import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import EditBlogModal from "@/components/EditBlogModal";
import BlogService, { BlogPost } from "@/services/blogService";
import BlogStatsService from "@/services/blogStatsService";
import { 
  Calendar, 
  Clock, 
  User, 
  Star,
  Heart,
  Share2,
  ArrowLeft,
  BookOpen,
  Eye,
  Bookmark,
  Edit,
  Trash2,
  Loader2,
  Target,
  Award,
  Sparkles,
  Phone,
  Mail,
  ThumbsUp,
  Tag
} from "lucide-react";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBlog(parseInt(id));
    }
  }, [id]);

  const fetchBlog = async (blogId: number) => {
    try {
      setLoading(true);
      setError(null);
      const blogData = await BlogService.getBlogById(blogId);
      setBlog(blogData);
      
      // Get current stats from API/localStorage
      const stats = await BlogStatsService.getBlogStats(blogId);
      setViewCount(stats.views);
      setLikeCount(stats.likes);
      setIsLiked(stats.isLiked);
      
      // Increment view count via API
      const newViewCount = await BlogStatsService.incrementViewCount(blogId);
      setViewCount(newViewCount);
    } catch (err: any) {
      setError('Không thể tải blog. Vui lòng thử lại sau.');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!blog) return;
    
    try {
      const result = await BlogStatsService.toggleLike(blog.id, isLiked);
      setIsLiked(result.liked);
      setLikeCount(result.count);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Fallback to localStorage behavior
      BlogStatsService.initializeBlogStats(blog.id);
      const currentLikes = BlogStatsService.getLikeCount(blog.id);
      const newLikedState = !isLiked;
      const newLikeCount = newLikedState ? currentLikes + 1 : Math.max(0, currentLikes - 1);
      
      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);
      
      localStorage.setItem(`blog_${blog.id}_likes`, newLikeCount.toString());
      localStorage.setItem(`blog_${blog.id}_user_liked`, newLikedState.toString());
    }
  };

  const handleDelete = async () => {
    if (!blog || !window.confirm('Bạn có chắc muốn xóa blog này?')) return;
    
    try {
      await BlogService.deleteBlog(blog.id);
      // Redirect to blog list after delete
      window.location.href = '/blog';
    } catch (err) {
      alert('Không thể xóa blog. Vui lòng thử lại.');
    }
  };

  const handleEditSuccess = async () => {
    // Reload blog data after successful edit
    if (id) {
      try {
        const updatedBlog = await BlogService.getBlogById(parseInt(id));
        setBlog(updatedBlog);
      } catch (err) {
        console.error('Error reloading blog after edit:', err);
      }
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

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

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-red-500 mb-4">{error || 'Blog không tồn tại'}</p>
          <Link to="/blog">
            <Button className="bg-unicorn-pink hover:bg-unicorn-pink-dark">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-unicorn-pink/5 to-unicorn-purple/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="ghost" className="text-unicorn-pink hover:bg-unicorn-pink/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách blog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Blog Header */}
            <Card className="border-unicorn-pink/20">
              <div className="h-64 bg-gradient-to-br from-unicorn-pink/20 to-unicorn-purple/20 flex items-center justify-center relative overflow-hidden">
                {blog.image_url ? (
                  <img 
                    src={blog.image_url} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <BookOpen className="w-20 h-20 text-unicorn-pink mb-4" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-unicorn-pink text-white">
                    Blog
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
                  <Badge className="bg-unicorn-pink text-white">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Blog Post
                  </Badge>
                  <Badge variant="outline" className="border-green-500 text-green-600">
                    {Math.ceil(blog.content.length / 200)} phút đọc
                  </Badge>
                </div>
                <CardTitle className="text-3xl text-foreground">{blog.title}</CardTitle>
                <CardDescription className="text-lg">
                  Khám phá kiến thức và chia sẻ từ cộng đồng Unicorn Team
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Blog Content */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-unicorn-pink" />
                  Nội dung bài viết
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MarkdownRenderer 
                  content={blog.content}
                  className="prose-gray"
                />
              </CardContent>
            </Card>

            {/* Interaction Section */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-unicorn-pink" />
                  Tương tác với bài viết
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLike}
                      className={`flex items-center gap-2 ${
                        isLiked 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-muted-foreground hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      {isLiked ? `Đã thích (${likeCount})` : `Thích bài viết (${likeCount})`}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`flex items-center gap-2 ${
                        isBookmarked 
                          ? 'text-unicorn-pink' 
                          : 'text-muted-foreground hover:text-unicorn-pink'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      {isBookmarked ? 'Đã lưu' : 'Lưu bài viết'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-muted-foreground hover:text-unicorn-purple"
                    >
                      <Share2 className="w-4 h-4" />
                      Chia sẻ
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                      className="flex items-center gap-2 border-unicorn-purple text-unicorn-purple hover:bg-unicorn-purple hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDelete}
                      className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blog Info */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-unicorn-pink" />
                  Thông tin bài viết
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-unicorn-pink" />
                  <div>
                    <p className="font-medium">Ngày đăng</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(blog.created_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-unicorn-pink" />
                  <div>
                    <p className="font-medium">Thời gian đọc</p>
                    <p className="text-sm text-muted-foreground">{Math.ceil(blog.content.length / 200)} phút</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-unicorn-pink" />
                  <div>
                    <p className="font-medium">Tác giả</p>
                    <p className="text-sm text-muted-foreground">{blog.author || 'Anonymous'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-unicorn-pink" />
                  <div>
                    <p className="font-medium">Lượt xem</p>
                    <p className="text-sm text-muted-foreground">
                      {viewCount} lượt
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-unicorn-pink" />
                  Tác giả
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-br from-unicorn-pink to-unicorn-purple text-white">
                      {(blog.author || 'A').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-foreground">{blog.author || 'Anonymous'}</h3>
                    <p className="text-sm text-unicorn-pink">Content Creator</p>
                    <p className="text-sm text-muted-foreground">Unicorn Team</p>
                    <p className="text-xs text-muted-foreground mt-1">Passionate writer</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-unicorn-pink" />
                  Thống kê
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-unicorn-pink/5 to-unicorn-purple/5">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-unicorn-pink" />
                      <span className="text-sm">Lượt xem</span>
                    </div>
                    <Badge variant="outline" className="border-unicorn-pink text-unicorn-pink">
                      {viewCount}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-unicorn-pink/5 to-unicorn-purple/5">
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-unicorn-pink" />
                      <span className="text-sm">Lượt thích</span>
                    </div>
                    <Badge variant="outline" className="border-unicorn-pink text-unicorn-pink">
                      {likeCount}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-unicorn-pink/5 to-unicorn-purple/5">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-unicorn-pink" />
                      <span className="text-sm">Đã lưu</span>
                    </div>
                    <Badge variant="outline" className="border-unicorn-pink text-unicorn-pink">
                      {isBookmarked ? '1' : '0'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card className="border-unicorn-pink/20 bg-gradient-to-r from-unicorn-pink/10 to-unicorn-purple/10">
              <CardContent className="p-6">
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-unicorn-pink mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {isLiked ? 'Cảm ơn bạn đã thích!' : 'Thích bài viết này?'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {likeCount > 0 ? `${likeCount} người đã thích bài viết này` : 'Hãy là người đầu tiên thích bài viết'}
                  </p>
                  <Button 
                    className={`w-full mb-2 ${
                      isLiked 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-unicorn-pink hover:bg-unicorn-pink-dark'
                    } text-white`}
                    onClick={toggleLike}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? `Đã thích (${likeCount})` : `Thích bài viết (${likeCount})`}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Tham gia cộng đồng Unicorn Team
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Related Posts */}
            <Card className="border-unicorn-pink/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-unicorn-pink" />
                  Bài viết liên quan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex gap-3 p-3 rounded-lg hover:bg-unicorn-pink/5 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-br from-unicorn-pink to-unicorn-purple rounded-lg flex-shrink-0 flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground line-clamp-2 mb-1">
                        Bài viết thú vị về công nghệ số {item}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item} ngày trước • 5 phút đọc
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-unicorn-pink" />
                        <span className="text-xs text-muted-foreground">Nổi bật</span>
                      </div>
                    </div>
                  </div>
                ))}
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
                  <span className="text-sm">blog@unicornteam.vn</span>
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

      {/* Edit Blog Modal */}
      {blog && (
        <EditBlogModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          blog={blog}
        />
      )}
    </div>
  );
}
