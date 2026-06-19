import { useState, useRef, useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyEmbedProps {
  children: ReactNode;
  height?: number;
  className?: string;
}

/**
 * LazyEmbed - Only loads embed content when visible in viewport
 * Saves ~400KB of JavaScript from Spotify/YouTube embeds until needed
 */
const LazyEmbed = ({ children, height = 352, className = '' }: LazyEmbedProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px', // Start loading 100px before visible
        threshold: 0
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ minHeight: height }}
    >
      {isVisible ? (
        children
      ) : (
        <div 
          className="flex items-center justify-center bg-muted/30 rounded-lg animate-pulse"
          style={{ height }}
        >
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default LazyEmbed;
