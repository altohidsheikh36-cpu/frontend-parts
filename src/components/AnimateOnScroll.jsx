import React, { useEffect, useRef, useState } from 'react';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveals children when they enter the viewport.
 * @param {'fade-up'|'fade-down'|'fade-in'|'fade-left'|'fade-right'|'scale'|'blur-up'} animation
 */
const AnimateOnScroll = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  as: Tag = 'div',
  once = true,
  threshold = 0.12,
  rootMargin = '0px 0px -48px 0px',
}) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, threshold, rootMargin]);

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag
      ref={ref}
      className={`motion-reveal motion-${animation} ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={style}
    >
      {children}
    </Tag>
  );
};

export default AnimateOnScroll;
