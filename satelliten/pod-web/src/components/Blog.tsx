import { useEffect, useState, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExternalLink, Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface BlogPost {
  id: string;
  title: string;
  published: string;
  content: string;
  link: string;
}

const Blog = () => {
  const { language, t } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notAvailable, setNotAvailable] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const isMobile = useIsMobile();
  const touchStartX = useRef<number>(0);

  // Responsive posts per page: 3 on mobile, 6 on desktop
  const postsPerPage = isMobile ? 3 : 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const visiblePosts = posts.slice(
    carouselIndex * postsPerPage,
    (carouselIndex + 1) * postsPerPage
  );

  // Reset carousel when language changes
  useEffect(() => {
    setCarouselIndex(0);
  }, [language]);

  // Defer blog fetch to after FCP/idle to avoid blocking critical path
  useEffect(() => {
    let cancelled = false;
    
    const fetchPosts = async () => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
      setNotAvailable(false);
      
      try {
        const { data, error: fnError } = await supabase.functions.invoke('fetch-blog-feed', {
          body: { language }
        });
        
        if (cancelled) return;
        if (fnError) throw fnError;
        
        if (data.status === 'not_available') {
          setNotAvailable(true);
          setPosts([]);
        } else {
          setPosts(data.posts || []);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Blog fetch error:', err);
        setError('Could not load blog posts');
        setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Defer fetch until browser is idle to not extend critical request chain
    const scheduleFetch = () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => fetchPosts(), { timeout: 3000 });
      } else {
        setTimeout(fetchPosts, 1500);
      }
    };

    // Only schedule after document is interactive
    if (document.readyState === 'complete') {
      scheduleFetch();
    } else {
      window.addEventListener('load', scheduleFetch, { once: true });
    }

    return () => { cancelled = true; };
  }, [language]);

  const handlePrevPage = useCallback(() => {
    setCarouselIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCarouselIndex(prev => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && carouselIndex < totalPages - 1) {
        handleNextPage();
      } else if (diff < 0 && carouselIndex > 0) {
        handlePrevPage();
      }
    }
  };

  const stripHtml = (html: string): string => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const truncate = (text: string, length: number): string => {
    const stripped = stripHtml(text);
    return stripped.length > length ? stripped.slice(0, length) + '...' : stripped;
  };

  return (
    <section id="blog" className="relative py-20 bg-muted/20">
      <div className="container px-4">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-center mb-12">
          <span className="text-gradient-primary">{t('blog.title')}</span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : notAvailable ? (
          <div className="text-center py-12">
            <div className="glass-card p-8 max-w-md mx-auto">
              <p className="text-muted-foreground text-lg">
                {t('blog.comingSoon')}
              </p>
              <p className="text-secondary mt-2 font-medium text-2xl">t.b.d.</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No posts available</p>
          </div>
        ) : (
          <div className="relative">
            {/* Navigation Arrows - Desktop */}
            {totalPages > 1 && (
              <>
                <button
                  onClick={handlePrevPage}
                  disabled={carouselIndex === 0}
                  className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border transition-all ${
                    carouselIndex === 0 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'hover:bg-primary/20 hover:border-primary/50 hover:text-primary'
                  }`}
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={carouselIndex === totalPages - 1}
                  className={`hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border transition-all ${
                    carouselIndex === totalPages - 1 
                      ? 'opacity-30 cursor-not-allowed' 
                      : 'hover:bg-primary/20 hover:border-primary/50 hover:text-primary'
                  }`}
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Blog Cards Grid */}
            <div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {visiblePosts.map((post) => (
                <article 
                  key={post.id}
                  className="glass-card p-6 hover:border-secondary/30 transition-all group"
                >
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3 h-3" />
                    {new Date(post.published).toLocaleDateString(
                      language === 'de' ? 'de-DE' : language === 'tl' ? 'fil-PH' : 'en-US'
                    )}
                  </div>

                  <h3 className="font-display text-lg font-semibold mb-3 group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {truncate(post.content, 150)}
                  </p>

                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 text-sm font-medium transition-colors focus-glow rounded"
                  >
                    {t('blog.readMore')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </article>
              ))}
            </div>

            {/* Pagination Dots */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === carouselIndex
                        ? 'bg-primary w-6'
                        : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
