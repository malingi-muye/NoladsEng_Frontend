import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  canonical?: string;
  structuredData?: object;
}

export const useSEO = ({
  title = 'Nolads Engineering - Power Your Future',
  description = 'Leading electrical engineering services for industrial applications. Power systems design, safety solutions, automation, and performance monitoring.',
  keywords = 'electrical engineering, power systems, industrial automation, safety solutions, electrical design, power distribution, SCADA, PLC programming',
  ogTitle,
  ogDescription,
  ogImage = 'https://cdn.builder.io/api/v1/image/assets%2F3c0fcc38dd884921bc700a3cf9b78d45%2Ff9ea4eec89994d938666cc0285e37bae?format=webp&width=1200',
  ogUrl,
  twitterCard = 'summary_large_image',
  canonical,
  structuredData
}: SEOProps = {}) => {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (property) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper function to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);

    // Open Graph tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', 'website', true);
    
    if (ogUrl) {
      updateMetaTag('og:url', ogUrl, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      updateLinkTag('canonical', canonical);
    }

    // Structured Data
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.setAttribute('type', 'application/ld+json');
        document.head.appendChild(scriptElement);
      }
      
      scriptElement.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Reset title to default when component unmounts
      document.title = 'Nolads Engineering - Power Your Future';
    };
  }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, twitterCard, canonical, structuredData]);
};

export default useSEO;