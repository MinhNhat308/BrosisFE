// Service to handle blog interaction statistics via API
const API_BASE_URL = 'http://localhost:8081/api/blog';

export class BlogStatsService {
  // Increment view count via API
  static async incrementViewCount(blogId: number): Promise<number> {
    try {
      const response = await fetch(`${API_BASE_URL}/${blogId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.views;
      } else {
        // Fallback to localStorage if API fails
        const currentViews = this.getViewCountFromStorage(blogId);
        const newViewCount = currentViews + 1;
        localStorage.setItem(`blog_${blogId}_views`, newViewCount.toString());
        return newViewCount;
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
      // Fallback to localStorage
      const currentViews = this.getViewCountFromStorage(blogId);
      const newViewCount = currentViews + 1;
      localStorage.setItem(`blog_${blogId}_views`, newViewCount.toString());
      return newViewCount;
    }
  }

  // Toggle like status via API
  static async toggleLike(blogId: number, currentlyLiked: boolean): Promise<{ liked: boolean; count: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ increment: !currentlyLiked }),
      });
      
      if (response.ok) {
        const data = await response.json();
        const newLikedState = !currentlyLiked;
        
        // Store user's like state in localStorage
        localStorage.setItem(`blog_${blogId}_user_liked`, newLikedState.toString());
        
        return {
          liked: newLikedState,
          count: data.likes
        };
      } else {
        // Fallback to localStorage if API fails
        return this.toggleLikeStorage(blogId, currentlyLiked);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Fallback to localStorage
      return this.toggleLikeStorage(blogId, currentlyLiked);
    }
  }

  // Get blog stats from API (for initial load)
  static async getBlogStats(blogId: number): Promise<{ views: number; likes: number; isLiked: boolean }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${blogId}`);
      
      if (response.ok) {
        const blog = await response.json();
        const isLiked = localStorage.getItem(`blog_${blogId}_user_liked`) === 'true';
        
        return {
          views: blog.views || 0,
          likes: blog.likes || 0,
          isLiked: isLiked
        };
      } else {
        // Fallback to localStorage
        return this.getBlogStatsStorage(blogId);
      }
    } catch (error) {
      console.error('Error fetching blog stats:', error);
      // Fallback to localStorage
      return this.getBlogStatsStorage(blogId);
    }
  }

  // Fallback methods using localStorage
  private static getViewCountFromStorage(blogId: number): number {
    return parseInt(localStorage.getItem(`blog_${blogId}_views`) || '0');
  }

  private static getLikeCountFromStorage(blogId: number): number {
    return parseInt(localStorage.getItem(`blog_${blogId}_likes`) || '0');
  }

  private static isLikedByUser(blogId: number): boolean {
    return localStorage.getItem(`blog_${blogId}_user_liked`) === 'true';
  }

  private static toggleLikeStorage(blogId: number, currentlyLiked: boolean): { liked: boolean; count: number } {
    const currentLikes = this.getLikeCountFromStorage(blogId);
    const newLikedState = !currentlyLiked;
    const newLikeCount = newLikedState ? currentLikes + 1 : Math.max(0, currentLikes - 1);
    
    localStorage.setItem(`blog_${blogId}_likes`, newLikeCount.toString());
    localStorage.setItem(`blog_${blogId}_user_liked`, newLikedState.toString());
    
    return {
      liked: newLikedState,
      count: newLikeCount
    };
  }

  private static getBlogStatsStorage(blogId: number): { views: number; likes: number; isLiked: boolean } {
    return {
      views: this.getViewCountFromStorage(blogId),
      likes: this.getLikeCountFromStorage(blogId),
      isLiked: this.isLikedByUser(blogId)
    };
  }

  // For backwards compatibility and fallback
  static getViewCount(blogId: number): number {
    return this.getViewCountFromStorage(blogId);
  }

  static getLikeCount(blogId: number): number {
    return this.getLikeCountFromStorage(blogId);
  }

  // Initialize stats for a new blog (for backwards compatibility)
  static initializeBlogStats(blogId: number): void {
    if (!localStorage.getItem(`blog_${blogId}_views`)) {
      localStorage.setItem(`blog_${blogId}_views`, '0');
    }
    if (!localStorage.getItem(`blog_${blogId}_likes`)) {
      localStorage.setItem(`blog_${blogId}_likes`, '0');
    }
    if (!localStorage.getItem(`blog_${blogId}_user_liked`)) {
      localStorage.setItem(`blog_${blogId}_user_liked`, 'false');
    }
  }
}

export default BlogStatsService;
