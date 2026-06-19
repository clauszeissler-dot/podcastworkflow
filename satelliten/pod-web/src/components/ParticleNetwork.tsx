import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  fadeDirection: 'in' | 'out' | 'stable';
  lifespan: number;
  age: number;
}

const ParticleNetwork = () => {
  // Early return for mobile devices - significant performance improvement
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  // Return null early for mobile or reduced motion preference
  if (isMobile || prefersReducedMotion) {
    return null;
  }

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const scrollRef = useRef(0);
  const animationRef = useRef<number>();
  const isVisibleRef = useRef(true);
  // Cache dimensions to avoid forced reflows by reading layout properties
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const colors = {
    orange: '#FC8337',
    cyan: '#00d4ff',
  };

  const createParticle = useCallback((width: number, height: number, scrollY: number): Particle => {
    const x = Math.random() * width;
    const y = Math.random() * height + scrollY;
    return {
      x,
      y,
      baseX: x,
      baseY: y,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      color: Math.random() > 0.5 ? colors.orange : colors.cyan,
      size: Math.random() * 2 + 1,
      opacity: 0,
      fadeDirection: 'in',
      lifespan: 300 + Math.random() * 400, // 300-700 frames
      age: 0,
    };
  }, []);

  const initParticles = useCallback((width: number, height: number) => {
    const isMobile = width < 768;
    const particleCount = isMobile ? 25 : 50; // Reduced for performance
    const particles: Particle[] = [];
    // Use cached scrollY to avoid forced reflow
    const scrollY = scrollRef.current;

    for (let i = 0; i < particleCount; i++) {
      const particle = createParticle(width, height * 3, scrollY);
      particle.opacity = Math.random();
      particle.fadeDirection = 'stable';
      particle.age = Math.random() * particle.lifespan * 0.5;
      particles.push(particle);
    }

    particlesRef.current = particles;
  }, [createParticle]);

  const animate = useCallback(() => {
    // Skip animation if tab not visible (battery/CPU saving)
    if (!isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use cached dimensions to avoid forced reflows
    const { width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    const scrollY = scrollRef.current;

    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    particles.forEach((particle, i) => {
      // Age the particle
      particle.age++;

      // Handle fade in/out lifecycle
      if (particle.fadeDirection === 'in') {
        particle.opacity += 0.02;
        if (particle.opacity >= 1) {
          particle.opacity = 1;
          particle.fadeDirection = 'stable';
        }
      } else if (particle.fadeDirection === 'out') {
        particle.opacity -= 0.02;
        if (particle.opacity <= 0) {
          // Respawn particle at new location
          const newParticle = createParticle(width, height * 3, scrollY);
          particles[i] = newParticle;
          return;
        }
      } else if (particle.age > particle.lifespan) {
        // Start fading out
        particle.fadeDirection = 'out';
      }

      // Gentle drift - more organic movement
      particle.vx += (Math.random() - 0.5) * 0.08;
      particle.vy += (Math.random() - 0.5) * 0.08;

      // Mouse attraction (sluggish/träge)
      const adjustedY = particle.y - scrollY;
      const dx = mouse.x - particle.x;
      const dy = mouse.y - adjustedY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 250 && dist > 0) {
        // Gentle attraction toward mouse
        const force = 0.0003;
        particle.vx += (dx / dist) * force * (250 - dist);
        particle.vy += (dy / dist) * force * (250 - dist);
      }

      // Return force to base position (weaker, allows more drift)
      const returnForce = 0.003;
      const dxBase = particle.baseX - particle.x;
      const dyBase = particle.baseY - particle.y;
      particle.vx += dxBase * returnForce;
      particle.vy += dyBase * returnForce;

      // Velocity limits
      const maxSpeed = 1.5;
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
      if (speed > maxSpeed) {
        particle.vx = (particle.vx / speed) * maxSpeed;
        particle.vy = (particle.vy / speed) * maxSpeed;
      }

      // Damping (more sluggish)
      particle.vx *= 0.96;
      particle.vy *= 0.96;

      // Apply velocity
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around bounds with scroll consideration
      const totalHeight = height * 3;
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < scrollY - height) {
        particle.y = scrollY + height * 2;
        particle.baseY = particle.y;
      }
      if (particle.y > scrollY + height * 2) {
        particle.y = scrollY - height;
        particle.baseY = particle.y;
      }

      // Only draw if visible on screen
      if (adjustedY < -50 || adjustedY > height + 50) return;

      // Draw particle with glow
      ctx.beginPath();
      ctx.arc(particle.x, adjustedY, particle.size, 0, Math.PI * 2);
      
      const gradient = ctx.createRadialGradient(
        particle.x, adjustedY, 0,
        particle.x, adjustedY, particle.size * 3
      );
      const colorWithAlpha = particle.color === colors.orange 
        ? `rgba(252, 131, 55, ${particle.opacity})`
        : `rgba(0, 212, 255, ${particle.opacity})`;
      gradient.addColorStop(0, colorWithAlpha);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw connections to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j];
        const otherAdjustedY = other.y - scrollY;
        
        // Skip if other particle not visible
        if (otherAdjustedY < -50 || otherAdjustedY > height + 50) continue;
        
        const pdx = particle.x - other.x;
        const pdy = adjustedY - otherAdjustedY;
        const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

        if (pdist < 150) {
          const opacity = (1 - pdist / 150) * 0.3 * Math.min(particle.opacity, other.opacity);
          ctx.beginPath();
          ctx.moveTo(particle.x, adjustedY);
          ctx.lineTo(other.x, otherAdjustedY);
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Draw connection to mouse
      if (dist < 200) {
        const opacity = (1 - dist / 200) * 0.5 * particle.opacity;
        ctx.beginPath();
        ctx.moveTo(particle.x, adjustedY);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(252, 131, 55, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Draw subtle mouse glow
    if (mouse.x > 0 && mouse.y > 0) {
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 60
      );
      gradient.addColorStop(0, 'rgba(252, 131, 55, 0.08)');
      gradient.addColorStop(0.5, 'rgba(252, 131, 55, 0.03)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(mouse.x - 60, mouse.y - 60, 120, 120);
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Debounced resize handler - batch reads then defer writes to avoid forced reflow
    let resizeTimeout: number;
    let pendingWidth = 0;
    let pendingHeight = 0;
    
    const handleResize = () => {
      cancelAnimationFrame(resizeTimeout);
      // Batch all reads first (outside rAF to avoid sync layout)
      pendingWidth = window.innerWidth;
      pendingHeight = window.innerHeight;
      
      // Defer all writes to next frame
      resizeTimeout = requestAnimationFrame(() => {
        canvas.width = pendingWidth;
        canvas.height = pendingHeight;
        // Cache dimensions to avoid reading layout properties in animation loop
        dimensionsRef.current = { width: pendingWidth, height: pendingHeight };
        initParticles(pendingWidth, pendingHeight);
      });
    };

    // Throttled scroll handler using rAF to batch reads
    let scrollTicking = false;
    const handleScroll = () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(() => {
          scrollRef.current = window.scrollY;
          scrollTicking = false;
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    // Page Visibility API - pause animation when tab not visible
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    // Defer initialization to avoid blocking FID - batch reads before writes
    const initializeParticles = () => {
      // Batch all reads first
      const initScrollY = window.scrollY;
      const initWidth = window.innerWidth;
      const initHeight = window.innerHeight;
      
      // Then perform all writes
      scrollRef.current = initScrollY;
      pendingWidth = initWidth;
      pendingHeight = initHeight;
      canvas.width = initWidth;
      canvas.height = initHeight;
      dimensionsRef.current = { width: initWidth, height: initHeight };
      initParticles(initWidth, initHeight);
      animationRef.current = requestAnimationFrame(animate);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    const scheduleInit = window.requestIdleCallback 
      ? () => window.requestIdleCallback(initializeParticles, { timeout: 200 })
      : () => setTimeout(initializeParticles, 50);
    
    const initId = scheduleInit();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initParticles]);

  // Early return already handled at component top

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
};

export default ParticleNetwork;
