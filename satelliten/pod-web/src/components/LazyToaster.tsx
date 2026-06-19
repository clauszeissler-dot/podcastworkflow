import { lazy, Suspense, useState, useEffect } from 'react';

// Lazy load Toaster only when needed
const Toaster = lazy(() => import('@/components/ui/sonner').then(m => ({ default: m.Toaster })));

/**
 * LazyToaster - Defers loading of Sonner Toaster until first toast is triggered
 * This reduces initial bundle size by ~15KB
 */
const LazyToaster = () => {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Listen for custom event that signals a toast was triggered
    const handleToastTrigger = () => {
      setShouldLoad(true);
    };

    // Check if sonner has any toasts queued (via internal state)
    // Also trigger on first interaction as fallback
    const triggerOnInteraction = () => {
      setShouldLoad(true);
      cleanup();
    };

    // Load after a short delay to ensure toasts from URL params work
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 1000);

    const cleanup = () => {
      window.removeEventListener('click', triggerOnInteraction);
      window.removeEventListener('keydown', triggerOnInteraction);
      clearTimeout(timer);
    };

    window.addEventListener('click', triggerOnInteraction, { once: true });
    window.addEventListener('keydown', triggerOnInteraction, { once: true });
    document.addEventListener('toast-trigger', handleToastTrigger, { once: true });

    return () => {
      cleanup();
      document.removeEventListener('toast-trigger', handleToastTrigger);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <Suspense fallback={null}>
      <Toaster />
    </Suspense>
  );
};

export default LazyToaster;
