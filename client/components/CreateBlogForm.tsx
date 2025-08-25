import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlogService, { Tag } from "@/services/blogService";

interface CreateBlogFormProps {
  onBlogCreated?: () => void;
}

export default function CreateBlogForm({ onBlogCreated }: CreateBlogFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const MAX_CONTENT_LENGTH = 10000;
  const charCount = content.length;

  // Load available tags when component mounts
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tags = await BlogService.getAllTags();
        setAvailableTags(tags);
      } catch (error) {
        console.error('Error loading tags:', error);
      }
    };
    loadTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError("Vui lòng nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    if (!selectedTagId) {
      setError("Vui lòng chọn một chủ đề cho bài viết");
      return;
    }

    if (charCount > MAX_CONTENT_LENGTH) {
      setError(`Nội dung quá dài! Tối đa ${MAX_CONTENT_LENGTH} ký tự (hiện tại: ${charCount} ký tự)`);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await BlogService.createBlog({
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || undefined,
        tagIds: [selectedTagId]
      });

      setSuccess(true);
      setTitle("");
      setContent("");
      setAuthor("");
      setSelectedTagId(null);

      if (onBlogCreated) {
        onBlogCreated();
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error: any) {
      console.error("Error creating blog:", error);
      setError(error.message || "Có lỗi xảy ra khi tạo blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-unicorn-pink/20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-unicorn-pink to-unicorn-purple bg-clip-text text-transparent">
          Tạo Blog Mới
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title" className="text-unicorn-pink font-medium">
              Tiêu đề *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề blog..."
              className="border-unicorn-pink/20 focus:border-unicorn-pink"
              required
            />
          </div>

          <div>
            <Label htmlFor="author" className="text-unicorn-pink font-medium">
              Tác giả (tùy chọn)
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Nhập tên tác giả..."
              className="border-unicorn-pink/20 focus:border-unicorn-pink"
            />
          </div>

          {/* Tag Selection */}
          <div>
            <Label htmlFor="tags" className="text-unicorn-pink font-medium">
              Chủ đề * (chọn 1 trong 5 chủ đề chính)
            </Label>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {availableTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setSelectedTagId(selectedTagId === tag.id ? null : tag.id)}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    selectedTagId === tag.id
                      ? 'bg-unicorn-pink text-white border-unicorn-pink shadow-lg transform scale-105'
                      : 'bg-white text-unicorn-pink border-unicorn-pink/30 hover:bg-unicorn-pink/10 hover:border-unicorn-pink/50'
                  }`}
                >
                  <div className="font-semibold text-lg">{tag.name}</div>
                  <div className="text-sm opacity-80 mt-1">
                    {tag.name === 'Nhập Học' && 'Hướng dẫn và thông tin cho tân sinh viên'}
                    {tag.name === 'Quân Sự' && 'Đào tạo quân sự và giáo dục quốc phòng'}
                    {tag.name === 'Sinh Viên' && 'Hoạt động và đời sống sinh viên'}
                    {tag.name === 'Kỹ Năng Sống' && 'Phát triển kỹ năng cá nhân và xã hội'}
                    {tag.name === 'Học Tập' && 'Kiến thức và phương pháp học tập'}
                  </div>
                </button>
              ))}
            </div>
            {!selectedTagId && (
              <p className="text-sm text-red-500 mt-2">* Vui lòng chọn một chủ đề cho bài viết</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="content" className="text-unicorn-pink font-medium">
                Nội dung *
              </Label>
              <div className="text-sm">
                <span className={`${charCount > MAX_CONTENT_LENGTH ? "text-red-600 font-bold" : "text-gray-500"}`}>
                  {charCount.toLocaleString()}
                </span>
                <span className="text-gray-400">/{MAX_CONTENT_LENGTH.toLocaleString()}</span>
              </div>
            </div>
            
            {charCount > MAX_CONTENT_LENGTH && (
              <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm font-medium">
                  ⚠️ VƯỢT QUÁ GIỚI HẠN: Nội dung vượt quá {(charCount - MAX_CONTENT_LENGTH).toLocaleString()} ký tự. 
                  Vui lòng rút ngắn để có thể đăng bài.
                </p>
              </div>
            )}
            
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung blog của bạn... (tối đa 10.000 ký tự)"
              rows={10}
              className={`border-unicorn-pink/20 focus:border-unicorn-pink ${
                charCount > MAX_CONTENT_LENGTH ? "border-red-500 focus:border-red-500 bg-red-50" : ""
              }`}
              required
            />
            
            {charCount > MAX_CONTENT_LENGTH && (
              <p className="text-xs text-red-600 mt-1 font-medium">
                ❌ Không thể đăng bài khi vượt quá giới hạn ký tự
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm">✅ Blog đã được tạo thành công!</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || charCount > MAX_CONTENT_LENGTH || !selectedTagId}
            className="w-full bg-unicorn-pink hover:bg-unicorn-pink-dark text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang tạo..." : 
             charCount > MAX_CONTENT_LENGTH ? "Nội dung quá dài" : 
             !selectedTagId ? "Vui lòng chọn chủ đề" : "Tạo Blog"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
