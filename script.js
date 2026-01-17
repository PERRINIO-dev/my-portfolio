// ====== PORTFOLIO REFACTOR v5.0 - SIMPLIFIED STATIC PAGES ======
// Removed modal system, added project page linking

// ====== CONFIGURATION ======
const CONFIG = {
    navScrolledThreshold: 30,
    revealThreshold: 0.1,
    revealRootMargin: '0px 0px -100px 0px',
    formEndpoint: 'https://formspree.io/f/mbdrzrbq'
};

// ====== GLOBAL STATE ======
const AppState = {
    isNavScrolled: false,
    isMobileMenuOpen: false
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

function updateCopyrightYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
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
                
                const navHeight = document.querySelector('.main-nav').offsetHeight;
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

// ====== CONTACT FORM ======
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form || !status) return;
    
    // Honeypot field
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_gotcha';
    honeypot.style.display = 'none';
    honeypot.setAttribute('aria-hidden', 'true');
    form.appendChild(honeypot);
    
    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
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

// ====== MAIN INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio v5.0 - Static Pages Architecture');
    
    try {
        // Initialize core systems
        initializeNavigation();
        initializeSmoothScroll();
        initializeRevealAnimations();
        initializeContactForm();
        initializeProjectCards();
        
        // Update dynamic content
        updateCopyrightYear();
        initializeHeroPortrait();
        
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

// ====== CONSOLE WELCOME MESSAGE ======
console.log(`
╔══════════════════════════════════════════════╗
║      MAJESTOR KEPSEU PORTFOLIO v5.0         ║
║      Static Pages Architecture              ║
║      © ${new Date().getFullYear()} - All Rights Reserved     ║
╚══════════════════════════════════════════════╝

✅ REMOVED: Complex modal system
✅ ADDED: Static project pages
✅ SIMPLIFIED: JavaScript (500+ lines removed)
✅ IMPROVED: Mobile navigation
✅ MAINTAINED: All animations and theme
✅ FIXED: Mobile project viewing issues
✅ ADDED: Native browser navigation
✅ IMPROVED: SEO with individual pages
✅ RETAINED: Contact form functionality
✅ PRESERVED: Premium design and UX

📱 Mobile-first project pages
⚡ Fast loading without JavaScript
🔧 Easy to maintain and update
🎯 Professional user experience
`);