/**
 * CEART - Centre for Embryology & Assisted Reproductive Technology
 * Ultra-Premium Motion & Interactive Engine (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Sticky Header Glassmorphism on Scroll
  // =========================================================================
  const header = document.querySelector('.main-header');
  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check

  // =========================================================================
  // 2. Hero Background Parallax Effect
  // =========================================================================
  const heroParallax = document.querySelector('.hero-parallax-bg');
  let ticking = false;

  const handleParallax = () => {
    if (!heroParallax) return;
    const scrollPos = window.scrollY;
    // Limit parallax within the hero viewport
    if (scrollPos < 900) {
      const translateY = scrollPos * 0.35;
      heroParallax.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleParallax);
      ticking = true;
    }
  }, { passive: true });

  // =========================================================================
  // 3. High-Performance Intersection Observer for Scroll Reveals
  // =========================================================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver isn't supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // =========================================================================
  // 4. Smooth Eased Number Counting Animation
  // =========================================================================
  const counterElements = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const targetText = el.getAttribute('data-counter');
    const isDecimal = targetText.includes('.');
    const numericTarget = parseFloat(targetText.replace(/[^0-9.]/g, ''));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000; // ms
    const startTime = performance.now();

    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = easeProgress * numericTarget;

      if (isDecimal) {
        el.textContent = `${prefix}${currentVal.toFixed(1)}${suffix}`;
      } else {
        const formatted = Math.floor(currentVal).toLocaleString();
        el.textContent = `${prefix}${formatted}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        el.textContent = `${prefix}${targetText}${suffix}`;
      }
    };

    requestAnimationFrame(updateNumber);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    counterElements.forEach(el => counterObserver.observe(el));
  } else {
    counterElements.forEach(el => animateCounter(el));
  }

  // =========================================================================
  // 5. Admission Process Timeline Line Fill Animation
  // =========================================================================
  const timelineSection = document.querySelector('.timeline-section-wrap');
  const timelineBarFill = document.querySelector('.timeline-bar-fill');
  const timelineSteps = document.querySelectorAll('.timeline-step');

  if (timelineSection && timelineBarFill && 'IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timelineBarFill.style.width = '100%';
          timelineSteps.forEach((step, idx) => {
            setTimeout(() => {
              step.classList.add('active');
            }, (idx + 1) * 350);
          });
        }
      });
    }, {
      threshold: 0.3
    });

    timelineObserver.observe(timelineSection);
  }

  // =========================================================================
  // 6. Mobile Navigation Drawer Toggle
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const expanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', expanded);
    });

    // Close when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 7. Course Category Filtering
  // =========================================================================
  window.filterCourses = (category, btnElement) => {
    const cards = document.querySelectorAll('.course-card');
    const tabBtns = document.querySelectorAll('.filter-tabs .tab-btn');

    tabBtns.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px) scale(0.97)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 250);
      }
    });
  };

  // =========================================================================
  // 8. FAQ Category Switcher & Smooth Accordion
  // =========================================================================
  window.switchFaqTab = (category, btnElement) => {
    const catButtons = document.querySelectorAll('.faq-cat-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    catButtons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    faqItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      if (itemCategory === category) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
        item.classList.remove('active');
      }
    });
  };

  window.toggleFaq = (buttonElement) => {
    const parentItem = buttonElement.closest('.faq-item');
    if (!parentItem) return;

    const isActive = parentItem.classList.contains('active');
    const category = parentItem.getAttribute('data-category');

    // Close peers in current category
    document.querySelectorAll(`.faq-item[data-category="${category}"]`).forEach(item => {
      item.classList.remove('active');
    });

    if (!isActive) {
      parentItem.classList.add('active');
    }
  };

  // =========================================================================
  // 9. Lead Form Submission Handler with Toast
  // =========================================================================
  window.handleFormSubmit = (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('fullName');
    const courseSelect = document.getElementById('courseSelect');
    
    const candidateName = nameInput ? nameInput.value.trim() : 'Candidate';
    const selectedCourse = courseSelect && courseSelect.selectedIndex > 0 
      ? courseSelect.options[courseSelect.selectedIndex].text 
      : 'Clinical Embryology Program';

    showNotificationToast(`Thank you, ${candidateName}! Your application for "${selectedCourse}" was submitted successfully. Our Admissions Director will connect with you within 24 hours.`);
    e.target.reset();
  };

  // Modern Toast Notification
  const showNotificationToast = (message) => {
    const existingToast = document.querySelector('.ceart-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'ceart-toast';
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 1.4rem;">🎉</span>
        <div style="font-size: 0.92rem; line-height: 1.5; color: #fff;">${message}</div>
      </div>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      backgroundColor: 'var(--navy-blue)',
      borderLeft: '5px solid var(--accent-pink)',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
      color: '#fff',
      padding: '18px 24px',
      borderRadius: '12px',
      zIndex: '99999',
      maxWidth: '420px',
      transform: 'translateY(100px)',
      opacity: '0',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      fontFamily: 'var(--font-heading)'
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 50);

    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 6000);
  };

  // =========================================================================
  // 10. Video & Article Modal Previews
  // =========================================================================
  window.openVideoModal = () => {
    showNotificationToast('🎬 Loading CEART Virtual Cleanroom Tour & Micromanipulation Session...');
  };

  window.simulateReadArticle = (e, title) => {
    e.preventDefault();
    showNotificationToast(`📖 Opening publication: "${title}". Redirecting to clinical repository.`);
  };
});
