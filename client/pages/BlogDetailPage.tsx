import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ModernNavBar from '../components/ModernNavBar';
import { api } from '../lib/api';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      try {
        setLoading(true);
        const res = await api.blog.getBySlug(slug);
        if (res.success) setPost(res.data);
        else setError(res.error || 'Failed to load post');
      } catch (e: any) {
        setError(e?.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen bg-white">
      <ModernNavBar />
      <div className="container py-24">Loading...</div>
    </div>
  );
  if (error) return (
    <div className="min-h-screen bg-white">
      <ModernNavBar />
      <div className="container py-24 text-red-600">{error}</div>
    </div>
  );
  if (!post) return null;

  return (
    <div className="min-h-screen bg-white">
      <ModernNavBar />
      <section className="pt-24 pb-12 bg-slate-50">
        <div className="container">
          <p className="text-sm text-slate-500 mb-4"><Link to="/blog" className="text-blue-600">← Back to Blog</Link></p>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="text-slate-600 text-sm mb-6">
            {post.author} • {post.read_time || 0} min read • {post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}
          </div>
          {post.featured_image && (
            <img src={post.featured_image} alt={post.title} className="w-full rounded-lg mb-6" />
          )}
          <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
        </div>
      </section>
    </div>
  );
}