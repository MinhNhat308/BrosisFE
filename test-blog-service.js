// Simple test to check if BlogService works
import BlogService from '../client/services/blogService.js';

async function testBlogService() {
    console.log('🧪 Testing BlogService...');
    
    try {
        // Test 1: Get all blogs
        console.log('1. Testing getAllBlogs...');
        const blogs = await BlogService.getAllBlogs();
        console.log('✅ Success:', blogs);
        
        // Test 2: Create a blog if none exist
        if (blogs.length === 0) {
            console.log('2. Creating test blog...');
            const newBlog = await BlogService.createBlog({
                title: 'Test Blog from Frontend',
                content: 'This is a test blog created from frontend to verify API connection.',
                author: 'Frontend Test'
            });
            console.log('✅ Blog created:', newBlog);
        }
        
        console.log('🎉 All tests passed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run test
testBlogService();
