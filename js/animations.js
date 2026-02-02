/* ===========================================
   Koderka Scroll Animations
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});

/**
 * Initialize scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // If reduced motion is preferred, show all elements immediately
    document.querySelectorAll('.animate-fade-in-up, .animate-fade-in, .animate-slide-left, .animate-slide-right').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  // Elements to animate
  const animatedElements = document.querySelectorAll(
    '.animate-fade-in-up, .animate-fade-in, .animate-slide-left, .animate-slide-right'
  );

  if (animatedElements.length === 0) return;

  // Create observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Once animated, no need to observe anymore
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe each element
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Add animation classes to elements dynamically
 * Call this after dynamically adding content
 */
function refreshAnimations() {
  initScrollAnimations();
}

// Expose for potential use
window.refreshAnimations = refreshAnimations;
