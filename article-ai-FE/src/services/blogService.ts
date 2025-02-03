import { Blog } from '@/types/blog';

export const blogService = {
  async getBlogByExecutionId(executionId: number): Promise<Blog> {
    const API_BASE_URL = "http://127.0.0.1:8000"
    const response = await fetch(`${API_BASE_URL}/blog/execution/${executionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog');
    }
    return response.json();
  },

  async updateBlog(blogId: number, content: string): Promise<Blog> {
    const API_BASE_URL = "http://127.0.0.1:8000"
    const response = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to update blog');
    }
    return response.json();
  }
}; 