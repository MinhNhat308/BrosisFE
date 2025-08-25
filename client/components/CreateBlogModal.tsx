import { useState } from "react";
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
  Edit,
  Image,
  Link,
} from "lucide-react";

interface CreateBlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (blogData: { title: string; content: string; author?: string; image_url?: string }) => Promise<void>;
}

export default function CreateBlogModal({ isOpen, onClose, onSubmit }: CreateBlogModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || undefined,
        image_url: imageUrl.trim() || undefined,
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setAuthor("");
      setImageUrl("");
      onClose();
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Có lỗi xảy ra khi tạo bài viết!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const readingTime = Math.ceil(content.length / 200);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl w-[95vw] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b border-unicorn-pink/20">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Edit className="w-6 h-6 text-unicorn-pink" />
            Tạo bài viết mới
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1">
            Viết và xem trước bài viết của bạn
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Editor */}
          <div className="w-1/2 flex flex-col border-r border-unicorn-pink/20">
            <div className="p-4 border-b border-unicorn-pink/10 bg-unicorn-pink/5">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Edit className="w-4 h-4 text-unicorn-pink" />
                Viết bài
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tác giả
                  </label>
                  <Input
                    placeholder="Nhập tên tác giả..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="border-unicorn-pink/20 focus:border-unicorn-pink"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Tiêu đề bài viết *
                  </label>
                  <Input
                    placeholder="Nhập tiêu đề bài viết..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-unicorn-pink/20 focus:border-unicorn-pink"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Hình ảnh bài viết
                  </label>
                  <Input
                    placeholder="Nhập URL hình ảnh..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="border-unicorn-pink/20 focus:border-unicorn-pink"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Dán link hình ảnh từ internet (jpg, png, gif...)
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
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
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-unicorn-pink/10">
                <div className="text-sm text-muted-foreground">
                  {content.length} ký tự • {readingTime} phút đọc
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                    className="bg-unicorn-pink hover:bg-unicorn-pink-dark text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 flex flex-col bg-gray-50/50">
            <div className="p-4 border-b border-unicorn-pink/10 bg-unicorn-purple/5">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Eye className="w-4 h-4 text-unicorn-purple" />
                Xem trước
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {title || content || imageUrl ? (
                <div className="max-w-none">
                  {/* Preview Header */}
                  <div className="mb-6">
                    {/* Image Preview */}
                    {imageUrl && (
                      <div className="mb-6">
                        <img 
                          src={imageUrl} 
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-unicorn-pink/20"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-unicorn-pink text-white">
                        <BookOpen className="w-3 h-3 mr-1" />
                        Blog Post
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        {readingTime} phút đọc
                      </Badge>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-foreground mb-4">
                      {title || "Tiêu đề bài viết"}
                    </h1>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-unicorn-pink text-white">
                            {(author || 'A').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>{author || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date().toLocaleDateString('vi-VN')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {readingTime} phút đọc
                      </div>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="border-t border-unicorn-pink/10 pt-6">
                    {content ? (
                      <MarkdownRenderer 
                        content={content}
                        className="prose-gray"
                      />
                    ) : (
                      <div className="text-muted-foreground text-center py-8">
                        Nội dung bài viết sẽ hiển thị ở đây...
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Image className="w-12 h-12 text-muted-foreground/50" />
                      <BookOpen className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Bắt đầu viết bài
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Nhập tác giả, tiêu đề, hình ảnh và nội dung bên trái để xem trước bài viết
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
