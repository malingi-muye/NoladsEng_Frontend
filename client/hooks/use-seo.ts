import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  noIndex?: boolean;
}

export function useSEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  noIndex
}: SEOProps = {}) {
  useEffect(() => {
    // Update title
    if (title) {
      document.title = `${title} | Nolads Engineering`;
    }

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('og:title', ogTitle || title);
    updateMetaTag('og:description', ogDescription || description);
    updateMetaTag('og:image', ogImage);
    updateMetaTag('og:url', ogUrl);

    // Handle robots meta tag
    if (noIndex) {
      updateMetaTag('robots', 'noindex,nofollow');
    } else {
      removeMetaTag('robots');
    }

    // Cleanup
    return () => {
      removeMetaTag('description');
      removeMetaTag('og:title');
      removeMetaTag('og:description');
      removeMetaTag('og:image');
      removeMetaTag('og:url');
      removeMetaTag('robots');
    };
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, noIndex]);
}

function updateMetaTag(name: string, content?: string) {
  if (!content) {
    removeMetaTag(name);
    return;
  }

  let meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
}

function removeMetaTag(name: string) {
  const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  if (meta) {
    meta.remove();
  }
}
