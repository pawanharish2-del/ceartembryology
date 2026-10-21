/**
 * CEART - Centre for Embryology & Assisted Reproductive Technology
 * Ultra-Premium Motion, Sliders & Interactive Engine (main.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Sticky Header Glassmorphism on Scroll
  // =========================================================================
  const header = document.querySelector('.main-header');
  const handleHeaderScroll = () => {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  // =========================================================================
  // 2. Mobile Navigation with Animated Hamburger (Transforms to X)
  // =========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // =========================================================================
  // 3. Hero Background Parallax Effect
  // =========================================================================
  const heroParallax = document.querySelector('.hero-parallax-bg');
  let ticking = false;

  const handleParallax = () => {
    if (!heroParallax) return;
    const scrollPos = window.scrollY;
    if (scrollPos < 950) {
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
  // 4. Scroll Reveal via Intersection Observer
  // =========================================================================
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // =========================================================================
  // 5. Smooth Eased Number Counting Animation (easeOutCubic)
  // =========================================================================
  const counterElements = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const targetText = el.getAttribute('data-counter');
    const isDecimal = targetText.includes('.');
    const numericTarget = parseFloat(targetText.replace(/[^0-9.]/g, ''));
    const prefix = el.getAttribute('data-prefix') || '';
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
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
  // 6. Admission Process Timeline Line Fill Animation
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
          timelineObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.25
    });

    timelineObserver.observe(timelineSection);
  }

  // =========================================================================
  // 7. Dynamic Course Category Filtering
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
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(15px) scale(0.97)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 250);
      }
    });
  };

  // =========================================================================
  // 8. Working FAQ Accordion (Strictly Single Active Item Across FAQs)
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

    const isAlreadyActive = parentItem.classList.contains('active');

    // Close all accordion items across all categories (strictly only one open at a time)
    document.querySelectorAll('.faq-item').forEach(item => {
      item.classList.remove('active');
    });

    // Toggle active state
    if (!isAlreadyActive) {
      parentItem.classList.add('active');
    }
  };

  // =========================================================================
  // 9. Lead Generation Form with Validation, Loading Spinner & Polished Success
  // =========================================================================
  window.handleFormSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const courseSelect = document.getElementById('courseSelect');
    const successMsg = document.getElementById('formSuccessMessage');

    // HTML5 native validation check
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const candidateName = nameInput ? nameInput.value.trim() : 'Candidate';
    const selectedCourse = courseSelect && courseSelect.selectedIndex > 0 
      ? courseSelect.options[courseSelect.selectedIndex].text 
      : 'Clinical Embryology Program';
    const candidatePhone = phoneInput ? phoneInput.value.trim() : '+91 98765 43210';

    // Show button loading spinner
    if (submitBtn) {
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;
    }

    // Simulate backend submission delay
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
      }

      // Display polished success message card
      if (successMsg) {
        successMsg.innerHTML = `
          <div style="display: flex; align-items: flex-start; gap: 16px;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-teal), var(--soft-cyan)); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.15rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(27, 122, 139, 0.35);">✓</div>
            <div style="flex-grow: 1;">
              <h4 style="color: var(--navy-blue); margin-bottom: 6px; font-size: 1.1rem; font-weight: 700;">Thank you, ${candidateName}!</h4>
              <p style="color: var(--text-body); font-size: 0.92rem; line-height: 1.55; margin-bottom: 14px;">
                Your enrollment application for <strong>"${selectedCourse}"</strong> has been received successfully. Our Senior Academic Counselor will contact you on <strong>${candidatePhone}</strong> within 24 hours with syllabus details, eligibility criteria, and fee structure.
              </p>
              <button type="button" class="btn btn-outline-teal btn-sm" onclick="resetApplicationForm()">Submit Another Inquiry</button>
            </div>
          </div>
        `;
        successMsg.classList.add('visible');
      }

      // Show toast notification
      showNotificationToast(`Thank you, ${candidateName}! We have received your inquiry for ${selectedCourse}.`);
      
      // Hide input elements temporarily to showcase success message
      form.querySelectorAll('.floating-group, button[type="submit"]').forEach(el => {
        el.style.display = 'none';
      });
    }, 1200);
  };

  window.resetApplicationForm = () => {
    const form = document.getElementById('admissionForm');
    const successMsg = document.getElementById('formSuccessMessage');
    if (form) {
      form.reset();
      form.querySelectorAll('.floating-group, button[type="submit"]').forEach(el => {
        el.style.display = '';
      });
    }
    if (successMsg) {
      successMsg.classList.remove('visible');
      successMsg.innerHTML = '';
    }
  };

  // Modern Floating Toast Notification
  const showNotificationToast = (message) => {
    const existingToast = document.querySelector('.ceart-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'ceart-toast';
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 14px;">
        <span style="font-size: 1.5rem; line-height: 1;">🎉</span>
        <div style="font-size: 0.92rem; line-height: 1.5; color: #fff; font-weight: 500;">${message}</div>
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
      zIndex: '999999',
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
    }, 5500);
  };

  // =========================================================================
  // 10. Lightweight Touch-Friendly Slider Engine with Pagination Dots
  // =========================================================================
  const initSlider = (config) => {
    const { containerSelector, prevBtnSelector, nextBtnSelector, dotsSelector, autoplayInterval = 5000 } = config;
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const track = container.querySelector('.slider-track');
    const slides = container.querySelectorAll('.slider-slide');
    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);
    const dotsContainer = dotsSelector ? document.querySelector(dotsSelector) : null;
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    let autoplayTimer = null;

    const getSlidesPerView = () => {
      if (window.innerWidth < 768) return 1;
      if (window.innerWidth < 1024) return 2;
      return 3;
    };

    const getMaxIndex = () => {
      const spv = getSlidesPerView();
      return Math.max(0, slides.length - spv);
    };

    // Render / update pagination dots dynamically
    const renderDots = () => {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const maxIndex = getMaxIndex();
      const dotCount = maxIndex + 1;

      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.className = `slider-dot ${i === currentIndex ? 'active' : ''}`;
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateSlider();
          restartAutoplay();
        });
        dotsContainer.appendChild(dot);
      }
    };

    const updateSlider = () => {
      const spv = getSlidesPerView();
      const maxIndex = getMaxIndex();
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      if (currentIndex < 0) currentIndex = 0;

      const slideWidthPercentage = 100 / spv;
      track.style.transform = `translateX(-${currentIndex * slideWidthPercentage}%)`;
      track.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';

      // Update active dot
      if (dotsContainer) {
        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
          dot.classList.toggle('active', idx === currentIndex);
        });
      }
    };

    const nextSlide = () => {
      const maxIndex = getMaxIndex();
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    };

    const prevSlide = () => {
      const maxIndex = getMaxIndex();
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex;
      }
      updateSlider();
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoplay();
      });
    }

    // Touch & Swipe gestures for mobile users
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
      track.style.transition = 'none';
      stopAutoplay();
    }, { passive: true });

    track.addEventListener('touchmove', (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      const diffX = startX - currentX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      } else {
        updateSlider();
      }
      startAutoplay();
    });

    // Autoplay functionality
    const startAutoplay = () => {
      if (autoplayInterval > 0 && !autoplayTimer) {
        autoplayTimer = setInterval(nextSlide, autoplayInterval);
      }
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const restartAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    container.addEventListener('mouseenter', stopAutoplay);
    container.addEventListener('mouseleave', startAutoplay);

    window.addEventListener('resize', () => {
      renderDots();
      updateSlider();
    }, { passive: true });

    renderDots();
    updateSlider();
    startAutoplay();
  };

  // Initialize Testimonial Slider & Campus Life Slider with working arrows and pagination dots
  initSlider({
    containerSelector: '#testimonialsSlider',
    prevBtnSelector: '#testPrevBtn',
    nextBtnSelector: '#testNextBtn',
    dotsSelector: '#testDots',
    autoplayInterval: 5000
  });

  initSlider({
    containerSelector: '#campusSlider',
    prevBtnSelector: '#campusPrevBtn',
    nextBtnSelector: '#campusNextBtn',
    dotsSelector: '#campusDots',
    autoplayInterval: 5500
  });

  // =========================================================================
  // 11. Interactive Video Modal (Cleanroom & Virtual Lab Tour)
  // =========================================================================
  const videoModal = document.getElementById('videoModal');
  const videoIframe = document.getElementById('videoModalIframe');

  window.openVideoModal = (videoUrl) => {
    if (!videoModal) return;
    const defaultEmbed = 'https://www.youtube-nocookie.com/embed/ScMzIvxBSi4?autoplay=1&mute=0&rel=0';
    const targetUrl = videoUrl || defaultEmbed;
    
    if (videoIframe) {
      videoIframe.src = targetUrl;
    }
    videoModal.classList.add('active');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoModal = () => {
    if (!videoModal) return;
    videoModal.classList.remove('active');
    videoModal.setAttribute('aria-hidden', 'true');
    if (videoIframe) {
      videoIframe.src = '';
    }
    document.body.style.overflow = '';
  };

  // Close modal when clicking backdrop or pressing Escape
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) {
        closeVideoModal();
      }
    });
  }

  // Brochure Download Simulator
  window.downloadBrochure = (e) => {
    if (e) e.preventDefault();
    showNotificationToast('📄 Preparing CEART Academic Prospectus & Syllabus (PDF)...');
    setTimeout(() => {
      showNotificationToast('✅ CEART Prospectus (PDF) downloaded successfully! Check your downloads folder.');
    }, 1400);
  };

  window.simulateReadArticle = (e, title) => {
    e.preventDefault();
    showNotificationToast(`📖 Opening publication: "${title}". Redirecting to clinical repository.`);
  };
});
