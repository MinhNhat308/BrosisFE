import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Calendar,
  Clock,
  User,
  Save,
  Eye,
  X,
  Loader2,
  Edit
} from "lucide-react";
import BlogService, { BlogPost } from "@/services/blogService";

interface EditBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  blog: BlogPost;
}

export default function EditBlogModal({ isOpen, onClose, onSuccess, blog }: EditBlogModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with blog data when modal opens
  useEffect(() => {
    if (isOpen && blog) {
      setTitle(blog.title);
      setContent(blog.content);
      setImageUrl(blog.image_url || "");
    }
  }, [isOpen, blog]);

  const readingTime = Math.max(1, Math.ceil(content.length / 1000));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);
    try {
      await BlogService.updateBlog(blog.id, {
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl.trim() || null,
        author: blog.author || "Anonymous"
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      setTitle("");
      setContent("");
      setImageUrl("");
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Có lỗi xảy ra khi cập nhật bài viết!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      // Reset form
      setTitle("");
      setContent("");
      setImageUrl("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-4 py-2 border-b border-unicorn-pink/10 space-y-1">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Edit className="w-5 h-5 text-unicorn-purple" />
            Chỉnh sửa bài viết
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Cập nhật nội dung và thông tin của bài viết
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex">
          {/* Left Panel - Editor */}
          <div className="flex-1 flex flex-col border-r border-unicorn-pink/10">
            <div className="p-2 space-y-2">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Tiêu đề bài viết *
                </label>
                <Input
                  placeholder="Nhập tiêu đề bài viết..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border-unicorn-pink/20 focus:border-unicorn-pink h-9"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">
                  Hình ảnh bài viết
                </label>
                <Input
                  placeholder="URL hình ảnh (tùy chọn)..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="border-unicorn-pink/20 focus:border-unicorn-pink h-9"
                />
              </div>
            </div>

            <div className="flex-1 p-2 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-foreground">
                  Nội dung bài viết *
                </label>
                <div className="text-xs text-muted-foreground">
                  Hỗ trợ Markdown: **đậm**, *nghiêng*, {"> ghi chú"}, ```code```
                </div>
              </div>
              <Textarea
                placeholder="# Tiêu đề chính&#10;&#10;**Văn bản in đậm** và *văn bản in nghiêng*&#10;&#10;> Đây là ghi chú quan trọng&#10;&#10;- Danh sách item 1&#10;- Danh sách item 2&#10;&#10;```&#10;Code block&#10;```"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 resize-none border-unicorn-pink/20 focus:border-unicorn-pink leading-relaxed font-mono"
              />
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-unicorn-pink/10">
                <div className="text-xs text-muted-foreground">
                  {content.length} ký tự • {readingTime} phút đọc
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                    className="bg-unicorn-purple hover:bg-unicorn-purple/90 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Cập nhật bài viết
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 flex flex-col">
            <div className="px-3 py-1.5 border-b border-unicorn-pink/10">
              <div className="flex items-center gap-2 text-unicorn-purple">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Live Preview</span>
              </div>
            </div>

            <div className="flex-1 p-2 overflow-y-auto">
              {title || content || imageUrl ? (
                <div>
                  {/* Preview Header */}
                  {imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-3">
                    {title || "Tiêu đề bài viết"}
                  </h1>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">
                          {blog.author?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{blog.author || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date().toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {readingTime} phút đọc
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="border-t border-unicorn-pink/10 pt-3">
                    {content ? (
                      <MarkdownRenderer 
                        content={content}
                        className="prose-gray prose-sm"
                      />
                    ) : (
                      <div className="text-muted-foreground text-center py-4">
                        Nội dung bài viết sẽ hiển thị ở đây...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="text-base font-medium text-foreground mb-2">
                      Preview sẽ xuất hiện ở đây
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Bắt đầu chỉnh sửa để xem preview real-time
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
