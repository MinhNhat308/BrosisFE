// Blog API Service cho frontend
const API_BASE_URL = 'http://localhost:8081/api/blog';

export interface Tag {
  id: number;
  name: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author?: string;
  image_url?: string;
  tags?: string[];
  created_at: string;
}

export interface BlogPostUI extends BlogPost {
  excerpt: string;
  authorInfo: {
    name: string;
    avatar: string;
    role: string;
  };
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  isBookmarked: boolean;
  coverImage: string;
}

class BlogService {
  // Get all available tags
  static async getAllTags(): Promise<Tag[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // Get all blogs from API
  static async getAllBlogs(): Promise<BlogPost[]> {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error;
    }
  }

  // Get blog by ID
  static async getBlogById(id: number): Promise<BlogPost> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error;
    }
  }

  // Create new blog
  static async createBlog(blogData: Omit<BlogPost, 'id' | 'created_at'> & { tagIds?: number[] }): Promise<BlogPost> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update blog
  static async updateBlog(id: number, blogData: Omit<BlogPost, 'id' | 'created_at'>): Promise<BlogPost> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete blog
  static async deleteBlog(id: number): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }

  // Transform API data to UI format
  static transformToUIFormat(apiPost: BlogPost): BlogPostUI {
    return {
      ...apiPost,
      excerpt: apiPost.content.substring(0, 150) + '...',
      authorInfo: {
        name: apiPost.author || 'Anonymous',
        avatar: '/placeholder.svg',
        role: 'Thành viên'
      },
      publishDate: apiPost.created_at,
      readTime: Math.ceil(apiPost.content.length / 200) + ' phút đọc',
      category: 'general',
      tags: apiPost.tags || ['Blog', 'Chia sẻ'],
      likes: Math.floor(Math.random() * 50) + 10,
      comments: Math.floor(Math.random() * 20) + 1,
      views: Math.floor(Math.random() * 500) + 100,
      isBookmarked: false,
      coverImage: '/images/blog-default.jpg'
    };
  }
}

export default BlogService;
