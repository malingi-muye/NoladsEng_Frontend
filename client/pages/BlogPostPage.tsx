import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  MessageSquare,
  ThumbsUp,
  Eye,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Send
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useNotify } from '@/hooks/use-notify';
import { api } from '@/lib/api';
import { useImageLoader } from '@/hooks/use-image-loader';
import { useAuth } from '@/hooks/use-auth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSEO } from '@/hooks/use-seo';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
const renderer = new marked.Renderer();
marked.use({ renderer }); // Use the default renderer for now

import { BlogPost as BlogPostType, BlogComment, CreateBlogComment } from '@/types/blog';

interface BlogPost extends BlogPostType {
  author_name: string;
  author_email: string;
}

type Comment = BlogComment;

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const notify = useNotify();
  const { optimizeImage } = useImageLoader();
  const { user, isAuthenticated } = useAuth();

  // SEO
  useSEO({
    title: post?.meta_title || post?.title,
    description: post?.meta_description || post?.excerpt,
    ogTitle: post?.title,
    ogDescription: post?.excerpt,
    ogImage: post?.featured_image,
    ogUrl: typeof window !== 'undefined' ? window.location.href : undefined,
  });

  const fetchPost = async () => {
    try {
      setLoading(true);
      const cacheKey = `blog_post_${slug}`;
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        // Cache valid for 5 minutes
        if (Date.now() - timestamp < 300000) {
          setPost(data);
          setLoading(false);
          return;
        }
      }

      const response = await api.blog.getBySlug(slug || '');
      
      if (response.success && response.data) {
        setPost({
          ...response.data,
          author_name: response.data.author_name ?? '',
          author_email: response.data.author_email ?? '',
        });
        // Cache the response
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: {
            ...response.data,
            author_name: response.data.author_name ?? '',
            author_email: response.data.author_email ?? '',
          },
          timestamp: Date.now()
        }));
      } else {
        throw new Error(response.error || 'Failed to fetch post');
      }
    } catch (err: any) {
      setError(err.message);
      // Implement retry mechanism
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchPost();
        }, 1000 * (retryCount + 1));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!post?.id) return;
    try {
      const response = await api.blog.getComments(post.id);
      if (response.success) {
        setComments(response.data);
      }
    } catch (err) {
      notify.error('Error', 'Failed to load comments');
    }
  };

  const fetchRelatedPosts = async () => {
    if (!post?.category) return;
    try {
      const response = await api.blog.getAll({ category: post.category, limit: 3 });
      if (response.success) {
        if (response.success && response.data) {
          setRelatedPosts(
            response.data
              .filter(p => p.id !== post.id)
              .map(p => ({
                ...p,
                author_name: p.author_name ?? '',
                author_email: p.author_email ?? '',
              }))
          );
        }
      }
    } catch (err) {
      console.error('Failed to fetch related posts:', err);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchComments();
      fetchRelatedPosts();
    }
  }, [post]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post?.id || !newComment.trim()) return;

    setCommentLoading(true);
    try {
      const response = await api.blog.createComment({
        post_id: post.id,
        content: newComment.trim(),
        author_name: user?.name || '',
        author_email: user?.email || '',
      });

      if (response.success) {
        notify.success('Success', 'Comment submitted successfully');
        setNewComment('');
        // Refresh comments
        fetchComments();
      } else {
        throw new Error(response.error || 'Failed to submit comment');
      }
    } catch (err: any) {
      notify.error('Error', err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post?.title || '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      default:
        try {
          await navigator.clipboard.writeText(url);
          notify.success('Copied!', 'Link copied to clipboard');
        } catch (err) {
          notify.error('Error', 'Failed to copy link');
        }
    }
  };

  if (error) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Post</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          onClick={() => {
            setError('');
            setRetryCount(0);
            fetchPost();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
          <div className="h-96 bg-gray-200 rounded mb-8" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
        <p className="text-gray-600 mb-4">The post you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <article className="min-h-screen bg-white">
        {/* Hero Section */}
        <header className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 pt-24 pb-16 relative overflow-hidden">
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Link to="/blog" className="inline-flex items-center gap-2 text-blue-100 hover:text-white mb-6">
                ← Back to Blog
              </Link>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-blue-100 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(post.published_at), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author_name}
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  {post.category}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {post.views} views
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container py-12">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={optimizeImage(post.featured_image, { width: 1200, height: 600 })}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>

            {/* Share Buttons */}
            <div className="sticky top-4 float-left -ml-16 hidden lg:block">
              <div className="flex flex-col gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare('facebook')}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Facebook className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share on Facebook</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare('twitter')}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Twitter className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share on Twitter</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare('linkedin')}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Linkedin className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share on LinkedIn</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleShare()}
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Copy className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Link</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Content */}
            <div 
              ref={contentRef}
              className="prose prose-lg max-w-none mb-12"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(marked.parse(post.content, { async: false }))
              }}
            />

            {/* Mobile Share Buttons */}
            <div className="flex items-center justify-center gap-4 my-8 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('facebook')}
              >
                <Facebook className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare('twitter')}
              >
                <Twitter className="w-4 h-4 mr-2" />
                Tweet
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleShare()}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>

            {/* Author Bio */}
            <Card className="mb-12">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={`https://www.gravatar.com/avatar/${post.author_email}?s=100&d=identicon`}
                    alt={post.author_name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{post.author_name}</h3>
                    <p className="text-gray-600">
                      Engineering expert and technical writer at Nolads Engineering
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <section className="mb-12">
              <h3 className="text-2xl font-bold mb-6">
                Comments ({comments.length})
              </h3>

              {/* Comment Form */}
              {isAuthenticated ? (
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    rows={4}
                    className="mb-4"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={commentLoading}
                  >
                    {commentLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg mb-8 text-center">
                  <p className="text-gray-600 mb-4">
                    Please log in to post a comment
                  </p>
                  <Link to="/login">
                    <Button>
                      Log In
                    </Button>
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    No comments yet. Be the first to comment!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <Card key={comment.id} className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={`https://www.gravatar.com/avatar/${comment.author_name}?s=40&d=identicon`}
                            alt={comment.author_name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">
                                {comment.author_name}
                              </h4>
                              <span className="text-sm text-gray-500">
                                {format(new Date(comment.created_at), 'MMM d, yyyy')}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold mb-6">Related Posts</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="group"
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={optimizeImage(relatedPost.featured_image, { width: 400, height: 300 })}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h4 className="font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
    </ErrorBoundary>
  );
}
