// ====== PORTFOLIO v7.0 - Clean & Minimal ======
// No excessive touch effects, just smooth functionality

// Centralized configuration — no more magic numbers scattered through code
const CONFIG = {
    SCROLL_THRESHOLD: 50,
    NAV_HEIGHT_FALLBACK: 80,
    OBSERVER_THRESHOLD: 0.1,
    OBSERVER_ROOT_MARGIN: '0px 0px -50px 0px',
    FORM_SUCCESS_TIMEOUT: 5000
};

document.addEventListener('DOMContentLoaded', () => {
    // Set current year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize theme (with OS detection)
    initTheme();
    
    // Navigation scroll effect
    initNavigation();
    
    // Mobile menu
    initMobileMenu();
    
    // Smooth scroll
    initSmoothScroll();
    
    // Reveal animations
    initRevealAnimations();
    
    // Contact form
    initContactForm();
});

// Theme Toggle with OS Detection
function initTheme() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or use OS preference
    const savedTheme = localStorage.getItem('theme');
    const currentTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
    
    // Apply theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateToggleButton(toggle, currentTheme);
    
    // Toggle click handler
    toggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleButton(toggle, newTheme);
    });
    
    // Listen for OS theme changes (when no manual preference set)
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            updateToggleButton(toggle, newTheme);
        }
    });
}

function updateToggleButton(toggle, theme) {
    const icon = toggle.querySelector('i');
    const text = toggle.querySelector('span');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        text.textContent = 'Light';
    } else {
        icon.className = 'fas fa-moon';
        text.textContent = 'Dark';
    }
}

// Navigation
function initNavigation() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Mobile Menu
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (!toggle || !menu) return;

    // Create backdrop overlay for mobile menu
    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function openMenu() {
        menu.classList.add('active');
        toggle.classList.add('active');
        toggle.setAttribute('aria-expanded', 'true');
        backdrop.classList.add('active');
        // Defer overflow lock until transition ends to avoid iOS Safari reflow mid-animation
        menu.addEventListener('transitionend', function handler() {
            menu.removeEventListener('transitionend', handler);
            if (menu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            }
        });
    }

    function closeMenu() {
        document.body.style.overflow = '';
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        backdrop.classList.remove('active');
    }

    toggle.addEventListener('click', () => {
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on link click
    menu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on backdrop click (click-outside)
    backdrop.addEventListener('click', closeMenu);

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// Smooth Scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            let target;
            try { target = document.querySelector(href); } catch (e) { return; }
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = document.getElementById('nav')?.offsetHeight
                || parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'))
                || CONFIG.NAV_HEIGHT_FALLBACK;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without polluting browser history
            history.replaceState(null, null, href);
        });
    });
}

// Reveal Animations (staggered cascade on scroll with varied directions)
function initRevealAnimations() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var STAGGER_DELAY = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--reveal-stagger')
    ) || 0.1;

    var observerOptions = {
        threshold: CONFIG.OBSERVER_THRESHOLD,
        rootMargin: CONFIG.OBSERVER_ROOT_MARGIN
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // If page loaded with a hash, find that section so we can skip its animation
    var hashTarget = null;
    if (window.location.hash) {
        try { hashTarget = document.querySelector(window.location.hash); } catch (e) { /* invalid selector */ }
    }

    // Observe sections and cards
    document.querySelectorAll('.section, .project-card, .skill-domain, .cert-card, .edu-item, .about-card').forEach(function(el) {
        // Skip animation for the hash-targeted section and its children
        if (hashTarget && (el === hashTarget || hashTarget.contains(el))) {
            el.classList.add('revealed');
            return;
        }

        // Determine stagger index among siblings of the same type
        var staggerIndex = 0;
        if (!el.classList.contains('section')) {
            var siblings = el.parentElement.children;
            var count = 0;
            for (var i = 0; i < siblings.length; i++) {
                if (siblings[i] === el) { staggerIndex = count; break; }
                if (siblings[i].tagName === el.tagName) count++;
            }
        }

        var delay = staggerIndex * STAGGER_DELAY;
        var direction = getRevealDirection(el, staggerIndex);
        var easing = 'cubic-bezier(0.16, 1, 0.3, 1)';

        el.style.opacity = '0';
        el.style.transform = direction;
        el.style.transition = 'opacity 0.6s ' + easing + ' ' + delay + 's, transform 0.6s ' + easing + ' ' + delay + 's';

        observer.observe(el);
    });
}

function getRevealDirection(el, index) {
    // Sections: standard fade up
    if (el.classList.contains('section')) {
        return 'translateY(20px)';
    }

    // About cards: slide from right
    if (el.classList.contains('about-card')) {
        return 'translateX(30px)';
    }

    // Education items: slide from left (toward timeline)
    if (el.classList.contains('edu-item')) {
        return 'translateX(-30px)';
    }

    // Project cards: alternate left/right
    if (el.classList.contains('project-card')) {
        return index % 2 === 0 ? 'translateX(-20px)' : 'translateX(20px)';
    }

    // Skill domains: fade up with slightly more distance
    if (el.classList.contains('skill-domain')) {
        return 'translateY(25px)';
    }

    // Cert cards: fade up with subtle scale
    if (el.classList.contains('cert-card')) {
        return 'translateY(15px) scale(0.97)';
    }

    // Default: fade up
    return 'translateY(20px)';
}


// Contact Form
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form || !status) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';
        
        // Reset status visibility before showing new result
        status.className = 'form-status';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.className = 'form-status success';
                status.innerHTML = '<strong>Thank you!</strong> Your message has been sent. I\'ll respond within 24-48 hours.';
                form.reset();
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            status.className = 'form-status error';
            status.innerHTML = 'Something went wrong. Please try again or email me directly.';
        }

        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Auto-hide status after 5 seconds
        setTimeout(() => {
            status.className = 'form-status';
        }, CONFIG.FORM_SUCCESS_TIMEOUT);
    });
}

