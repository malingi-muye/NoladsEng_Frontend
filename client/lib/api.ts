import { 
  ApiResponse, 
  User, CreateUser,
  Service, CreateService,
  Product, CreateProduct,
  Quote, CreateQuote, QuoteWithDetails,
  ContactMessage, CreateContactMessage,
  Image, CreateImage,
  Testimonial, CreateTestimonial,
  QuoteStatistics,
  ContactStatistics,
  StorageStatistics,
  TestimonialStatistics,
  AuthResponse,
  LoginCredentials,
  CompanyInfo,
  CompanyContacts,
  CompanyStats,
  CompanyRegistration,
} from '@shared/api';
import {
  BlogPost, CreateBlogPost,
  BlogCategory, CreateBlogCategory,
  BlogComment, CreateBlogComment,
} from '@/types/blog';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || '/api'; // For dev, set VITE_API_BASE or VITE_API_PROXY_URL to your PHP API origin

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('sessionToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

private async request<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // Google Analytics API
  // Moved analytics property outside of request method
  const url = `${API_BASE}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

    try {
      const response = await fetch(url, config);
      // Auto-refresh logic can be added here if needed
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // User API methods
  users = {
    getAll: (params?: { page?: number; limit?: number; search?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      
      return this.request<User[]>(`/users?${searchParams}`);
    },

    getById: (id: number) => 
      this.request<User>(`/users/${id}`),

    create: (userData: CreateUser) =>
      this.request<User>('/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    update: (id: number, userData: Partial<CreateUser>) =>
      this.request<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/users/${id}`, {
        method: 'DELETE',
      }),
  };

  // Service API methods
  services = {
    getAll: (params?: { page?: number; limit?: number; search?: string; category?: string; active?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.category) searchParams.set('category', params.category);
      if (params?.active !== undefined) searchParams.set('active', params.active.toString());
      
      return this.request<Service[]>(`/services?${searchParams}`);
    },

    getFeatured: (limit?: number) => {
      const searchParams = new URLSearchParams();
      if (limit) searchParams.set('limit', limit.toString());
      
      return this.request<Service[]>(`/services/featured?${searchParams}`);
    },

    getById: (id: number) => 
      this.request<Service>(`/services/${id}`),

    create: (serviceData: CreateService) =>
      this.request<Service>('/services', {
        method: 'POST',
        body: JSON.stringify(serviceData),
      }),

    update: (id: number, serviceData: Partial<CreateService>) =>
      this.request<Service>(`/services/${id}`, {
        method: 'PUT',
        body: JSON.stringify(serviceData),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/services/${id}`, {
        method: 'DELETE',
      }),
  };

  // Product API methods
  products = {
    getAll: (params?: { page?: number; limit?: number; search?: string; category?: string; active?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.category) searchParams.set('category', params.category);
      if (params?.active !== undefined) searchParams.set('active', params.active.toString());
      
      return this.request<Product[]>(`/products?${searchParams}`);
    },

    getFeatured: (limit?: number) => {
      const searchParams = new URLSearchParams();
      if (limit) searchParams.set('limit', limit.toString());
      
      return this.request<Product[]>(`/products/featured?${searchParams}`);
    },

    getLowStock: (threshold?: number) => {
      const searchParams = new URLSearchParams();
      if (threshold) searchParams.set('threshold', threshold.toString());
      
      return this.request<Product[]>(`/products/low-stock?${searchParams}`);
    },

    getById: (id: number) => 
      this.request<Product>(`/products/${id}`),

    create: (productData: CreateProduct) =>
      this.request<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),

    update: (id: number, productData: Partial<CreateProduct>) =>
      this.request<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      }),

    updateStock: (id: number, quantity: number) =>
      this.request<Product>(`/products/${id}/stock`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/products/${id}`, {
        method: 'DELETE',
      }),

    subscribeToStock: (productId: number, email: string) =>
      this.request<{ message: string }>(`/products/${productId}/stock-alert`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    getRelated: (productId: number, limit?: number) => {
      const searchParams = new URLSearchParams();
      if (limit) searchParams.set('limit', limit.toString());
      return this.request<Product[]>(`/products/${productId}/related?${searchParams}`);
    },
  };

  // Quote API methods
  quotes = {
    getAll: (params?: { page?: number; limit?: number; search?: string; status?: string; userId?: number }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status) searchParams.set('status', params.status);
      if (params?.userId) searchParams.set('userId', params.userId.toString());
      
      return this.request<QuoteWithDetails[]>(`/quotes?${searchParams}`);
    },

    getStatistics: () =>
      this.request<QuoteStatistics>('/quotes/statistics'),

    getById: (id: number) => 
      this.request<QuoteWithDetails>(`/quotes/${id}`),

    create: (quoteData: CreateQuote) =>
      this.request<Quote>('/quotes', {
        method: 'POST',
        body: JSON.stringify(quoteData),
      }),

    update: (id: number, quoteData: Partial<CreateQuote>) =>
      this.request<Quote>(`/quotes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(quoteData),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/quotes/${id}`, {
        method: 'DELETE',
      }),
  };

  // Contact API methods
  contact = {
    getAll: (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status) searchParams.set('status', params.status);
      
      return this.request<ContactMessage[]>(`/contact?${searchParams}`);
    },

    getStatistics: () =>
      this.request<ContactStatistics>('/contact/statistics'),

    getById: (id: number) => 
      this.request<ContactMessage>(`/contact/${id}`),

    create: (messageData: CreateContactMessage) =>
      this.request<ContactMessage>('/contact', {
        method: 'POST',
        body: JSON.stringify(messageData),
      }),

    update: (id: number, messageData: Partial<CreateContactMessage>) =>
      this.request<ContactMessage>(`/contact/${id}`, {
        method: 'PUT',
        body: JSON.stringify(messageData),
      }),

    markAsRead: (id: number) =>
      this.request<ContactMessage>(`/contact/${id}/read`, {
        method: 'PUT',
      }),

    markAsReplied: (id: number) =>
      this.request<ContactMessage>(`/contact/${id}/replied`, {
        method: 'PUT',
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/contact/${id}`, {
        method: 'DELETE',
      }),
  };

  // Image API methods
  images = {
    getAll: (params?: { page?: number; limit?: number; search?: string; entity_type?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.entity_type) searchParams.set('entity_type', params.entity_type);
      
      return this.request<Image[]>(`/images?${searchParams}`);
    },

    getStorageStats: () =>
      this.request<StorageStatistics>('/images/stats'),

    getById: (id: number) => 
      this.request<Image>(`/images/${id}`),

    getByEntity: (entityType: string, entityId: number) =>
      this.request<Image[]>(`/images/entity/${entityType}/${entityId}`),

    upload: (file: File, entityType?: string, entityId?: number, altText?: string) => {
      const formData = new FormData();
      formData.append('image', file);
      if (entityType) formData.append('entity_type', entityType);
      if (entityId) formData.append('entity_id', entityId.toString());
      if (altText) formData.append('alt_text', altText);

      return this.request<Image>('/images/upload', {
        method: 'POST',
        headers: {}, // Remove Content-Type to let browser set it for FormData
        body: formData,
      });
    },

    uploadMultiple: (files: File[], entityType?: string, entityId?: number) => {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      if (entityType) formData.append('entity_type', entityType);
      if (entityId) formData.append('entity_id', entityId.toString());

      return this.request<Image[]>('/images/upload-multiple', {
        method: 'POST',
        headers: {}, // Remove Content-Type to let browser set it for FormData
        body: formData,
      });
    },

    update: (id: number, imageData: { alt_text?: string; entity_type?: string; entity_id?: number }) =>
      this.request<Image>(`/images/${id}`, {
        method: 'PUT',
        body: JSON.stringify(imageData),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/images/${id}`, {
        method: 'DELETE',
      }),

    cleanup: () =>
      this.request<{ message: string }>('/images/cleanup', {
        method: 'POST',
      }),
  };

  // Authentication API methods
  auth = {
    login: (email: string, password: string) =>
      this.request<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    logout: () =>
      this.request<{ message: string }>('/auth/logout', {
        method: 'POST',
      }),

    logoutAll: () =>
      this.request<{ message: string }>('/auth/logout-all', {
        method: 'POST',
      }),

    verify: () =>
      this.request<AuthResponse>('/auth/verify'),

    getProfile: () =>
      this.request<User>('/auth/profile'),

    changePassword: (currentPassword: string, newPassword: string) =>
      this.request<{ message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      }),

    requestPasswordReset: (email: string) =>
      this.request<{ message: string; token?: string }>('/auth/request-password-reset', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (token: string, newPassword: string) =>
      this.request<{ message: string }>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      }),

    getActiveSessions: () =>
      this.request<Array<{
        id: string;
        created_at: string;
        expires_at: string;
        is_current: boolean;
      }>>('/auth/sessions'),
  };

  // Testimonials API methods
  testimonials = {
    getAll: (params?: { page?: number; limit?: number; search?: string; rating?: number; userId?: number; activeOnly?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.rating) searchParams.set('rating', params.rating.toString());
      if (params?.userId) searchParams.set('userId', params.userId.toString());
      if (params?.activeOnly !== undefined) searchParams.set('activeOnly', params.activeOnly.toString());
      
      return this.request<Testimonial[]>(`/testimonials?${searchParams}`);
    },

    getFeatured: (limit?: number) => {
      const searchParams = new URLSearchParams();
      if (limit) searchParams.set('limit', limit.toString());
      
      return this.request<Testimonial[]>(`/testimonials/featured?${searchParams}`);
    },

    getStatistics: () =>
      this.request<TestimonialStatistics>('/testimonials/statistics'),

    getById: (id: number) => 
      this.request<Testimonial>(`/testimonials/${id}`),

    create: (testimonialData: CreateTestimonial) =>
      this.request<Testimonial>('/testimonials', {
        method: 'POST',
        body: JSON.stringify(testimonialData),
      }),

    update: (id: number, testimonialData: Partial<CreateTestimonial>) =>
      this.request<Testimonial>(`/testimonials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(testimonialData),
      }),

    setFeatured: (id: number, featured: boolean) =>
      this.request<Testimonial>(`/testimonials/${id}/featured`, {
        method: 'PUT',
        body: JSON.stringify({ featured }),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/testimonials/${id}`, {
        method: 'DELETE',
      }),
  };

  // Company API methods
  company = {
    getInfo: () =>
      this.request<CompanyInfo>('/company/info'),

    getContact: () =>
      this.request<CompanyContacts>('/company/contact'),

    getStats: () =>
      this.request<CompanyStats>('/company/stats'),

    getRegistration: () =>
      this.request<CompanyRegistration>('/company/registration'),
  };

  // Blog API methods
  blog = {
    getAll: (params?: { page?: number; limit?: number; search?: string; category?: string; featured?: boolean }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.search) searchParams.set('search', params.search);
      if (params?.category) searchParams.set('category', params.category);
      if (params?.featured !== undefined) searchParams.set('featured', params.featured.toString());
      return this.request<BlogPost[]>(`/blog?${searchParams}`);
    },

    getBySlug: (slug: string) =>
      this.request<BlogPost>(`/blog/${encodeURIComponent(slug)}`),

    create: (post: CreateBlogPost) =>
      this.request<BlogPost>('/blog', {
        method: 'POST',
        body: JSON.stringify(post),
      }),

    update: (id: number, post: Partial<BlogPost>) =>
      this.request<BlogPost>(`/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(post),
      }),

    delete: (id: number) =>
      this.request<{ message: string }>(`/blog/${id}`, {
        method: 'DELETE',
      }),

    listAll: () =>
      this.request<BlogPost[]>('/blog/list-all'),

    // Category methods
    getCategories: () =>
      this.request<BlogCategory[]>('/blog/categories'),

    createCategory: (category: CreateBlogCategory) =>
      this.request<BlogCategory>('/blog/categories', {
        method: 'POST',
        body: JSON.stringify(category),
      }),

    updateCategory: (id: number, category: Partial<BlogCategory>) =>
      this.request<BlogCategory>(`/blog/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(category),
      }),

    deleteCategory: (id: number) =>
      this.request<{ message: string }>(`/blog/categories/${id}`, {
        method: 'DELETE',
      }),

    // Comment methods
    getComments: (postId: number) =>
      this.request<BlogComment[]>(`/blog/${postId}/comments`),

    createComment: (comment: CreateBlogComment) =>
      this.request<BlogComment>('/blog/comments', {
        method: 'POST',
        body: JSON.stringify(comment),
      }),

    approveComment: (id: number) =>
      this.request<{ message: string }>(`/blog/comments/${id}/approve`, {
        method: 'PUT',
      }),

    deleteComment: (id: number) =>
      this.request<{ message: string }>(`/blog/comments/${id}`, {
        method: 'DELETE',
      }),
  };
}

export const api = new ApiClient();