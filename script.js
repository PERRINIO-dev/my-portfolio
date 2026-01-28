// ====== PORTFOLIO v7.0 - Clean & Minimal ======
// No excessive touch effects, just smooth functionality

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
        if (window.scrollY > 50) {
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
        backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
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
            
            const target = document.querySelector(href);
            if (!target) return;
            
            e.preventDefault();
            
            const navHeight = document.getElementById('nav')?.offsetHeight || 80;
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

// Reveal Animations (subtle fade in on scroll)
function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections and cards
    document.querySelectorAll('.section, .project-card, .skill-domain, .cert-card, .edu-item, .about-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
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
        }, 5000);
    });
}

