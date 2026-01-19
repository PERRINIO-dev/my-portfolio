// ====== PORTFOLIO v5.3 - PROFESSIONAL OPTIMIZATION ======
// FIXED: Navigation always visible, subtle mobile effects, theme integration
// © 2025 Majestor Kepseu - All Rights Reserved

// ====== CONFIGURATION ======
const CONFIG = {
    navScrolledThreshold: 30,
    revealThreshold: 0.1,
    revealRootMargin: '0px 0px -100px 0px',
    formEndpoint: 'https://formspree.io/f/mbdrzrbq',
    analyticsKey: 'portfolio_views',
    animationDebounceDelay: 100,
    touchRippleDuration: 400,
    mobileBreakpoint: 768
};

// ====== GLOBAL STATE ======
const AppState = {
    isNavScrolled: false,
    isMobileMenuOpen: false,
    portfolioViews: 0,
    pageLoadTime: 0,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    touchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    currentTheme: 'dark',
    animationsEnabled: true,
    isInitialized: false,
    isMobile: window.innerWidth <= 768
};

// ====== UTILITY FUNCTIONS ======
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ====== ANIMATION CONTROL ======
function initializeAnimationSystem() {
    // Check if animations should be disabled
    AppState.animationsEnabled = !AppState.prefersReducedMotion;
    
    if (!AppState.animationsEnabled) {
        document.documentElement.classList.add('reduced-motion');
        console.log('🚫 Reduced motion preference detected - animations disabled');
    }
    
    // Add animation-ready class after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.documentElement.classList.add('animations-ready');
        }, 100);
    });
    
    // Add hover detection class for CSS
    if (!AppState.touchDevice) {
        document.documentElement.classList.add('has-hover');
    }
    
    // Update mobile state on resize
    window.addEventListener('resize', debounce(() => {
        AppState.isMobile = window.innerWidth <= CONFIG.mobileBreakpoint;
    }, 250));
}

// ====== TOUCH & CLICK FEEDBACK - SUBTLE ON MOBILE ======
function initializeTouchFeedback() {
    if (!AppState.animationsEnabled) return;
    
    // Add ripple class to interactive elements
    document.querySelectorAll('.btn, .project-card, .skill-category, .contact-method, .card-lift').forEach(el => {
        if (!el.classList.contains('ripple')) {
            el.classList.add('ripple');
        }
    });
    
    // Add press-down class to elements that need it (only on desktop)
    if (!AppState.touchDevice) {
        document.querySelectorAll('.btn, .project-card, .skill-category').forEach(el => {
            if (!el.classList.contains('press-down')) {
                el.classList.add('press-down');
            }
        });
    }
    
    // Event listeners - passive for better performance
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('touchend', handlePressEnd, { passive: true });
    document.addEventListener('mouseup', handlePressEnd);
    document.addEventListener('touchcancel', handlePressEnd, { passive: true });
}

function handleTouchStart(e) {
    if (!AppState.animationsEnabled) return;
    
    const target = e.target;
    const interactiveElement = target.closest('.ripple, .btn, .card-lift, .project-card, .skill-category, .contact-method');
    
    if (interactiveElement && AppState.touchDevice) {
        // SUBTLE ripple effect on mobile only - no press-down for subtlety
        createRippleEffect(interactiveElement, e);
        // Removed: pressing class for more subtle mobile experience
    }
}

function handleMouseDown(e) {
    if (!AppState.animationsEnabled || AppState.touchDevice) return;
    
    const target = e.target;
    const interactiveElement = target.closest('.ripple, .btn, .card-lift, .project-card, .skill-category, .contact-method');
    
    if (interactiveElement) {
        createRippleEffect(interactiveElement, e);
        interactiveElement.classList.add('pressing');
    }
}

function createRippleEffect(element, event) {
    if (!element.classList.contains('ripple')) return;
    
    element.classList.add('active');
    
    // Remove active class after animation
    setTimeout(() => {
        element.classList.remove('active');
    }, CONFIG.touchRippleDuration);
}

function handlePressEnd(e) {
    const target = e.target;
    const pressElement = target.closest('.press-down, .btn, .project-card, .skill-category');
    
    if (pressElement) {
        pressElement.classList.remove('pressing');
    }
}

// ====== SCROLL ANIMATIONS ======
function initializeScrollAnimations() {
    if (!AppState.animationsEnabled) return;
    
    // Set up Intersection Observer for scroll animations
    const fadeElements = document.querySelectorAll('.fade-in-up, .stagger-children, .timeline-item, .skill-bar');
    
    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
        
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Progress indicator for reading
    const progressBar = createProgressIndicator();
    if (progressBar) {
        window.addEventListener('scroll', throttle(() => {
            updateProgressIndicator(progressBar);
        }, 100), { passive: true });
    }
}

function createProgressIndicator() {
    if (!document.querySelector('.reading-progress')) {
        const indicator = document.createElement('div');
        indicator.className = 'reading-progress';
        indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: var(--accent);
            width: 0%;
            z-index: 1001;
            transition: width 0.3s ease;
        `;
        
        document.body.appendChild(indicator);
        return indicator;
    }
    return document.querySelector('.reading-progress');
}

function updateProgressIndicator(indicator) {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.pageYOffset;
    const progress = (scrolled / documentHeight) * 100;
    
    indicator.style.width = `${progress}%`;
}

// ====== CARD INTERACTIONS ======
function initializeCardInteractions() {
    if (!AppState.animationsEnabled) return;
    
    const cards = document.querySelectorAll('.card-lift, .project-card, .skill-category, .certification-card');
    
    cards.forEach(card => {
        // Add card-lift class if not present
        if (!card.classList.contains('card-lift')) {
            card.classList.add('card-lift');
        }
        
        // Desktop hover effects only (not on touch devices)
        if (!AppState.touchDevice) {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hovering');
            });
            
            card.addEventListener('mouseleave', () => {
                card.classList.remove('hovering');
            });
        }
        
        // Remove pressing effect on mobile for subtler experience
        if (AppState.touchDevice) {
            card.classList.remove('press-down');
        }
    });
}

// ====== FORM ANIMATIONS ======
function initializeFormAnimations() {
    const form = document.getElementById('contact-form');
    if (!form || !AppState.animationsEnabled) return;
    
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        // Add form-field class to parent
        const parent = input.closest('.form-group');
        if (parent && !parent.classList.contains('form-field')) {
            parent.classList.add('form-field');
        }
        
        // Add input-label class to labels
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            label.classList.add('input-label');
        }
        
        // Floating label effect
        input.addEventListener('focus', () => {
            if (label && label.classList.contains('input-label')) {
                label.classList.add('floating');
            }
        });
        
        input.addEventListener('blur', () => {
            if (label && label.classList.contains('input-label') && !input.value) {
                label.classList.remove('floating');
            }
        });
        
        // Check initial value
        if (input.value && label && label.classList.contains('input-label')) {
            label.classList.add('floating');
        }
    });
    
    // Form submission loading state
    form.addEventListener('submit', () => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('btn-loading');
            submitBtn.classList.add('btn-spring');
        }
    });
}

// ====== NAVIGATION FUNCTIONS - COMPLETELY FIXED ======
function initializeNavigation() {
    const nav = document.querySelector('.main-nav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (!nav || !hamburger || !navLinks) return;
    
    // CRITICAL: Remove any inline styles that might hide nav items
    document.querySelectorAll('.nav-link').forEach(link => {
        link.style.opacity = '';
        link.style.transform = '';
        link.style.transitionDelay = '';
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = nav.offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;
        
        // FIXED: Only remove/add active class, NOT hide items
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (!navLink) return;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLink.classList.add('active');
            }
        });
    }
    
    function handleScroll() {
        const shouldBeScrolled = window.scrollY > CONFIG.navScrolledThreshold;
        
        if (shouldBeScrolled !== AppState.isNavScrolled) {
            AppState.isNavScrolled = shouldBeScrolled;
            nav.classList.toggle('nav-scrolled', shouldBeScrolled);
        }
        
        updateActiveNavLink();
    }
    
    function toggleMobileMenu() {
        AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
        navLinks.classList.toggle('active', AppState.isMobileMenuOpen);
        hamburger.classList.toggle('active', AppState.isMobileMenuOpen);
        hamburger.setAttribute('aria-expanded', AppState.isMobileMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = AppState.isMobileMenuOpen ? 'hidden' : '';
        
        // Keep nav scrolled appearance when menu is open
        if (AppState.isMobileMenuOpen) {
            nav.classList.add('nav-scrolled');
        } else if (window.scrollY <= CONFIG.navScrolledThreshold) {
            nav.classList.remove('nav-scrolled');
        }
        
        // Staggered animation for mobile menu items
        if (AppState.isMobileMenuOpen) {
            const menuItems = navLinks.querySelectorAll('.nav-link');
            menuItems.forEach((item, index) => {
                // Stagger the transition delays for smooth animation
                setTimeout(() => {
                    item.style.transitionDelay = `${index * 50}ms`;
                }, 10);
            });
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu if open
            if (AppState.isMobileMenuOpen) {
                toggleMobileMenu();
            }
            
            // Smooth scroll
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page reload
                    history.pushState(null, null, targetId);
                }
            }
        });
    });
    
    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isMobileMenuOpen) {
            toggleMobileMenu();
        }
    });
    
    // Initialize
    handleScroll();
}

// ====== LOADING ANIMATIONS ======
function initializeLoadingAnimations() {
    // Page transition
    document.documentElement.classList.add('page-transition');
    
    // Hero portrait load animation
    const portrait = document.querySelector('.portrait-img');
    if (portrait) {
        if (portrait.complete) {
            portrait.classList.add('loaded');
        } else {
            portrait.addEventListener('load', () => {
                portrait.classList.add('loaded');
            });
        }
    }
    
    // Remove page transition after load
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.documentElement.classList.remove('page-transition');
        }, 300);
    });
}

// ====== SKILL ANIMATIONS ======
function initializeSkillAnimations() {
    if (!AppState.animationsEnabled) return;
    
    const skillBars = document.querySelectorAll('.skill-bar');
    if (skillBars.length === 0) return;
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    
    skillBars.forEach(bar => observer.observe(bar));
}

// ====== ANALYTICS & PERFORMANCE ======
function initializeAnalytics() {
    if (localStorage) {
        try {
            const views = parseInt(localStorage.getItem(CONFIG.analyticsKey) || '0');
            AppState.portfolioViews = views + 1;
            localStorage.setItem(CONFIG.analyticsKey, AppState.portfolioViews.toString());
            
            if ('performance' in window && performance.timing) {
                const perfData = performance.timing;
                AppState.pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            }
        } catch (e) {
            console.warn('Analytics disabled:', e.message);
        }
    }
}

// ====== KEYBOARD SHORTCUTS ======
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && AppState.isMobileMenuOpen) {
            const hamburger = document.getElementById('hamburger');
            if (hamburger) hamburger.click();
        }
        
        // Theme toggle with Ctrl+T (or Cmd+T on Mac)
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            if (window.ThemeUtils) {
                ThemeUtils.toggle();
            }
        }
    });
}

// ====== REVEAL ANIMATIONS ======
function initializeRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (!revealElements.length) return;
    
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--in');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: CONFIG.revealThreshold,
            rootMargin: CONFIG.revealRootMargin
        }
    );
    
    revealElements.forEach((element, index) => {
        element.style.transitionDelay = `${Math.min(index * 50, 300)}ms`;
        revealObserver.observe(element);
    });
}

// ====== CONTACT FORM ======
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form || !status) return;
    
    // Honeypot field for spam prevention
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_gotcha';
    honeypot.style.display = 'none';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.setAttribute('tabindex', '-1');
    form.appendChild(honeypot);
    
    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Check honeypot
        if (honeypot.value) {
            showErrorStatus('Submission blocked. Please try again.');
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-small"></span>
            Sending...
        `;
        submitButton.classList.add('btn-loading');
        
        const formData = new FormData(form);
        
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showSuccessStatus();
                form.reset();
                
                // Success animation
                submitButton.innerHTML = '✓ Sent!';
                submitButton.classList.add('bounce');
                
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.classList.remove('bounce');
                    submitButton.disabled = false;
                    submitButton.classList.remove('btn-loading');
                }, 2000);
                
            } else {
                showErrorStatus('Server error. Please try again.');
                submitButton.classList.add('shake');
                setTimeout(() => submitButton.classList.remove('shake'), 500);
                resetSubmitButton(submitButton, originalText);
            }
            
        } catch (error) {
            showErrorStatus('Network error. Please check your connection.');
            submitButton.classList.add('shake');
            setTimeout(() => submitButton.classList.remove('shake'), 500);
            resetSubmitButton(submitButton, originalText);
        }
    });
    
    function showSuccessStatus() {
        status.innerHTML = `
            <div class="status-success">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>Thank you!</strong> Your message has been sent.
                    <br><small>I'll respond within 24-48 hours.</small>
                </div>
            </div>
        `;
        status.className = 'form-status success';
        status.classList.add('content-fade-in');
    }
    
    function showErrorStatus(message) {
        status.innerHTML = `
            <div class="status-error">
                <i class="fas fa-exclamation-circle"></i>
                <div>${message}</div>
            </div>
        `;
        status.className = 'form-status error';
        status.classList.add('shake');
    }
    
    function resetSubmitButton(button, originalHTML) {
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
            button.classList.remove('btn-loading');
        }, 1500);
    }
}

// ====== THEME INTEGRATION ======
function initializeThemeIntegration() {
    // Listen for theme changes to update animations
    document.documentElement.addEventListener('themechange', (e) => {
        console.log('🎨 Theme changed, updating animations:', e.detail.theme);
        AppState.currentTheme = e.detail.theme;
        
        // Update ripple color based on theme
        const rippleColor = e.detail.theme === 'light' 
            ? 'rgba(0, 0, 0, 0.05)' 
            : 'rgba(255, 255, 255, 0.15)';
        
        document.documentElement.style.setProperty('--ripple-color', rippleColor);
    });
}

// ====== HELPER FUNCTIONS ======
function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

function showToast(message, type = 'info') {
    // Remove existing toasts
    document.querySelectorAll('.global-toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `global-toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === 'error' ? '⚠️' : 'ℹ️'}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Dismiss">×</button>
    `;
    
    document.body.appendChild(toast);
    
    const timeout = setTimeout(() => {
        toast.remove();
    }, 5000);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
        clearTimeout(timeout);
    });
}

// ====== MAIN INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    // Prevent duplicate initialization
    if (AppState.isInitialized) {
        console.warn('⚠️  Portfolio already initialized');
        return;
    }
    AppState.isInitialized = true;
    
    console.log(`
╔═══════════════════════════════════════════════════════╗
║      MAJESTOR KEPSEU PORTFOLIO v5.3                  ║
║      ✓ Navigation Always Visible                     ║
║      ✓ Subtle Mobile Touch Effects                   ║
║      ✓ Theme Persistence Across Pages                ║
║      © ${new Date().getFullYear()} - All Rights Reserved              ║
╚═══════════════════════════════════════════════════════╝
    `);
    
    try {
        // Initialize theme manager first (if available)
        if (typeof ThemeManager !== 'undefined') {
            ThemeManager.getInstance();
            console.log('✅ Theme Manager initialized');
        }
        
        // Initialize animation system first
        initializeAnimationSystem();
        console.log('✅ Animation System initialized');
        
        // Initialize navigation FIRST (critical for visibility)
        initializeNavigation();
        console.log('✅ Navigation initialized - all items visible');
        
        // Initialize core features
        initializeRevealAnimations();
        initializeContactForm();
        console.log('✅ Core features initialized');
        
        // Enhanced animation features
        initializeTouchFeedback();
        initializeScrollAnimations();
        initializeCardInteractions();
        initializeFormAnimations();
        initializeLoadingAnimations();
        initializeSkillAnimations();
        console.log('✅ Enhanced animations initialized');
        
        // Utilities
        initializeAnalytics();
        initializeKeyboardShortcuts();
        initializeThemeIntegration();
        updateCopyrightYear();
        console.log('✅ Utilities initialized');
        
        // Performance monitoring
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const navigationStart = performance.getEntriesByType('navigation')[0];
                if (navigationStart) {
                    const loadTime = navigationStart.duration.toFixed(2);
                    console.log(`⚡ Page loaded in ${loadTime}ms`);
                    console.log(`📊 Portfolio views: ${AppState.portfolioViews}`);
                    console.log(`📱 Device type: ${AppState.touchDevice ? 'Touch' : 'Desktop'}`);
                    console.log(`🎨 Theme: ${AppState.currentTheme}`);
                }
            }
        });
        
        console.log('✅ All systems initialized successfully');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showToast('Some features may not work correctly. Please refresh.', 'error');
    }
});

// ====== ERROR HANDLING ======
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    if (!AppState.isInitialized) {
        showToast('Page failed to load completely. Please refresh.', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// ====== PWA FEATURES ======
function initializePWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration.scope);
                })
                .catch(error => {
                    console.log('❌ Service Worker registration failed:', error);
                });
        });
    }
}

// Initialize PWA on load
initializePWA();

// ====== DEBUG MODE (DEVELOPMENT ONLY) ======
// Uncomment for debugging
// window.PortfolioDebug = {
//     state: AppState,
//     config: CONFIG,
//     reinitialize: () => {
//         AppState.isInitialized = false;
//         location.reload();
//     },
//     toggleTheme: () => window.ThemeUtils?.toggle(),
//     getTheme: () => window.ThemeUtils?.getCurrentTheme()
// };
// console.log('🔧 Debug mode enabled. Access via window.PortfolioDebug');
