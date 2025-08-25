import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, User } from "lucide-react";
import BlogService, { BlogPost } from "@/services/blogService";

export default function RecentBlogs() {
  const [recentBlogs, setRecentBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        setLoading(true);
        const blogs = await BlogService.getAllBlogs();
        // Lấy 5 bài mới nhất, sắp xếp theo thời gian tạo
        const sortedBlogs = blogs
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5);
        setRecentBlogs(sortedBlogs);
      } catch (error) {
        console.error("Error fetching recent blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  if (loading) {
    return (
      <Card className="border-unicorn-pink/20">
        <CardHeader>
          <CardTitle className="text-lg text-unicorn-pink flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Bài viết gần đây
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-unicorn-pink/20 sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg text-unicorn-pink flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Bài viết gần đây
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentBlogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Chưa có bài viết nào
          </p>
        ) : (
          <div className="space-y-4">
            {recentBlogs.map((blog) => (
              <div
                key={blog.id}
                className="group cursor-pointer p-3 rounded-lg border border-transparent hover:border-unicorn-pink/30 hover:bg-unicorn-pink/5 transition-all duration-200"
              >
                <h4 className="font-medium text-sm line-clamp-2 group-hover:text-unicorn-pink transition-colors mb-2">
                  {blog.title}
                </h4>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {truncateContent(blog.content)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{blog.author || "Admin"}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(blog.created_at)}</span>
                  </div>
                </div>
                
                <Badge variant="secondary" className="mt-2 text-xs">
                  {blog.content.length.toLocaleString()} ký tự
                </Badge>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-unicorn-pink/20">
          <button className="text-xs text-unicorn-pink hover:text-unicorn-purple transition-colors w-full text-center">
            Xem tất cả bài viết →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
