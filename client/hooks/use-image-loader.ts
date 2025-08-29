interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export function useImageLoader() {
  const optimizeImage = (url: string, options: ImageOptions = {}) => {
    if (!url) return '';
    
    // Return as is if it's an external URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Add default values
    const params = new URLSearchParams({
      w: (options.width || 800).toString(),
      h: (options.height || 600).toString(),
      q: (options.quality || 80).toString(),
      fmt: options.format || 'webp'
    });

    // Assuming we have an image optimization endpoint at /api/images/optimize
    return `/api/images/optimize/${encodeURIComponent(url)}?${params}`;
  };

  return { optimizeImage };
}
