// ====== PORTFOLIO REFACTOR v5.1 - ENHANCED FEATURES ======
// Added PWA capabilities, keyboard shortcuts, and performance monitoring

// ====== CONFIGURATION ======
const CONFIG = {
    navScrolledThreshold: 30,
    revealThreshold: 0.1,
    revealRootMargin: '0px 0px -100px 0px',
    formEndpoint: 'https://formspree.io/f/mbdrzrbq',
    analyticsKey: 'portfolio_views'
};

// ====== GLOBAL STATE ======
const AppState = {
    isNavScrolled: false,
    isMobileMenuOpen: false,
    portfolioViews: 0,
    pageLoadTime: 0
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

// ====== ANALYTICS & PERFORMANCE ======
function initializeAnalytics() {
    // Track page views
    if (localStorage) {
        try {
            const views = parseInt(localStorage.getItem(CONFIG.analyticsKey) || '0');
            AppState.portfolioViews = views + 1;
            localStorage.setItem(CONFIG.analyticsKey, AppState.portfolioViews.toString());
            
            // Performance tracking
            if ('performance' in window && performance.timing) {
                const perfData = performance.timing;
                AppState.pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                
                console.log(`📊 Portfolio Stats:
                • Total Views: ${AppState.portfolioViews}
                • Load Time: ${AppState.pageLoadTime}ms
                • Current Page: ${document.title}`);
            }
        } catch (e) {
            console.warn('Analytics disabled:', e.message);
        }
    }
}

function showToast(message, type = 'info') {
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

function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
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
        
        // Back to projects with B key (when on project page)
        if (e.key === 'b' || e.key === 'B') {
            const backBtn = document.querySelector('.project-back-btn');
            if (backBtn && document.referrer.includes('projects')) {
                backBtn.click();
            }
        }
        
        // Navigation with arrow keys
        if (e.key === 'ArrowLeft' && document.referrer.includes('projects')) {
            window.history.back();
        }
        
        // Focus search for accessibility (Ctrl+F or Cmd+F)
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const firstHeading = document.querySelector('h1, h2, h3');
            if (firstHeading) {
                firstHeading.focus();
                showToast('Use browser search (Ctrl+F) to find content', 'info');
            }
        }
    });
}

// ====== NAVIGATION FUNCTIONS ======
function initializeNavigation() {
    const nav = document.querySelector('.main-nav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (!nav || !hamburger || !navLinks) return;
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navHeight = nav.offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (!navLink) return;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
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
        
        document.body.style.overflow = AppState.isMobileMenuOpen ? 'hidden' : '';
        
        if (AppState.isMobileMenuOpen) {
            nav.classList.add('nav-scrolled');
        } else if (window.scrollY <= CONFIG.navScrolledThreshold) {
            nav.classList.remove('nav-scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    hamburger.addEventListener('click', toggleMobileMenu);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (AppState.isMobileMenuOpen) {
                toggleMobileMenu();
            }
        });
    });
    
    handleScroll();
}

// ====== SMOOTH SCROLL ======
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const navHeight = document.querySelector('.main-nav')?.offsetHeight || 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, targetId);
            }
        });
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

// ====== HERO PORTRAIT ======
function initializeHeroPortrait() {
    const portraitImg = document.querySelector('.portrait-img');
    
    if (!portraitImg) return;
    
    portraitImg.onload = () => {
        portraitImg.style.opacity = '1';
    };
    
    portraitImg.onerror = () => {
        portraitImg.style.background = 'var(--accent)';
        portraitImg.style.opacity = '0.3';
    };
}

// ====== PROJECT CARD INTERACTIONS ======
function initializeProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (this.getAttribute('href')) {
                return; // Let the link work normally
            }
        });
        
        card.addEventListener('keydown', function(e) {
            if ((e.key === 'Enter' || e.key === ' ') && !this.getAttribute('href')) {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ====== CONTACT FORM ENHANCEMENTS ======
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form || !status) return;
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Honeypot field
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_gotcha';
    honeypot.style.display = 'none';
    honeypot.setAttribute('aria-hidden', 'true');
    form.appendChild(honeypot);
    
    // Real-time email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const value = this.value.trim();
            if (value && !emailRegex.test(value)) {
                this.classList.add('invalid');
                showToast('Please enter a valid email address', 'error');
            } else {
                this.classList.remove('invalid');
            }
        });
    }
    
    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Honeypot check
        if (honeypot.value) {
            showErrorStatus('Submission blocked. Please try again.');
            return;
        }
        
        // Email validation
        const email = form.querySelector('input[type="email"]').value.trim();
        if (!emailRegex.test(email)) {
            showErrorStatus('Please enter a valid email address');
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-small"></span>
            Sending...
        `;
        
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
                
                submitButton.innerHTML = '✓ Sent!';
                submitButton.style.background = '#00b894';
                
                // Track form submission
                console.log('📨 Contact form submitted successfully');
                
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 2000);
                
            } else {
                showErrorStatus('Server error. Please try again.');
                resetSubmitButton(submitButton, originalText);
            }
            
        } catch (error) {
            showErrorStatus('Network error. Please check your connection.');
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
    }
    
    function showErrorStatus(message) {
        status.innerHTML = `
            <div class="status-error">
                <i class="fas fa-exclamation-circle"></i>
                <div>${message}</div>
            </div>
        `;
        status.className = 'form-status error';
    }
    
    function resetSubmitButton(button, originalHTML) {
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 1500);
    }
}

// ====== PWA FEATURES ======
function initializePWA() {
    // Check if PWA is already installed
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    }
    
    // Add install prompt for mobile
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button (optional)
        const installBtn = document.createElement('button');
        installBtn.className = 'install-btn';
        installBtn.innerHTML = '<i class="fas fa-download"></i> Install App';
        installBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--accent);
            color: var(--bg-primary);
            border: none;
            padding: 10px 15px;
            border-radius: 20px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        
        installBtn.addEventListener('click', () => {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted install');
                }
                deferredPrompt = null;
                installBtn.remove();
            });
        });
        
        document.body.appendChild(installBtn);
    });
}

// ====== LAZY LOADING FOR IMAGES ======
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.3s ease';
                img.classList.add('lazy-load');
                imageObserver.observe(img);
            }
        });
    }
}

// ====== MAIN INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    console.log(`

╔══════════════════════════════════════════════════╗
║      MAJESTOR KEPSEU PORTFOLIO v5.1             ║
║      Enhanced with Analytics & PWA Features     ║
║      © ${new Date().getFullYear()} - All Rights Reserved         ║
╚══════════════════════════════════════════════════╝
    `);
    
    try {
        // Initialize core systems
        initializeNavigation();
        initializeSmoothScroll();
        initializeRevealAnimations();
        initializeContactForm();
        initializeProjectCards();
        
        // Enhanced features
        initializeAnalytics();
        initializeKeyboardShortcuts();
        initializeLazyLoading();
        
        // PWA features (only on HTTPS)
        if (window.location.protocol === 'https:') {
            initializePWA();
        }
        
        // Update dynamic content
        updateCopyrightYear();
        initializeHeroPortrait();
        
        // Performance monitoring
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const navigationStart = performance.getEntriesByType('navigation')[0];
                if (navigationStart) {
                    const loadTime = navigationStart.duration.toFixed(2);
                    console.log(`⚡ Page loaded in ${loadTime}ms`);
                }
            }
        });
        
        // Listen for viewport changes
        window.addEventListener('resize', debounce(() => {
            AppState.isMobileView = window.innerWidth <= 768;
        }, 250));
        
        console.log('✅ All systems initialized successfully');
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showToast('Some features may not work correctly. Please refresh.', 'error');
    }
});

// ====== SERVICE WORKER SCRIPT (sw.js - create new file) ======
// Create this as a separate file: sw.js
/*
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
});

self.addEventListener('fetch', event => {
    // Cache-first strategy for static assets
    if (event.request.url.includes('/assets/')) {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});
*/
