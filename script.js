// ====== PORTFOLIO v7.1 - Clean & Minimal ======
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

    // Page entrance (skip on back/forward nav)
    initPageEntrance();

    // Preloader cleanup
    initPreloader();

    // Navigation scroll effect
    initNavigation();

    // Mobile menu
    initMobileMenu();

    // Smooth scroll
    initSmoothScroll();

    // Reveal animations
    initRevealAnimations();

    // Stat counter
    initStatCounter();

    // Scroll progress bar
    initScrollProgress();

    // Active section indicator in nav
    initActiveSection();

    // Back to top button
    initBackToTop();

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
        document.body.style.overflow = 'hidden';
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

    const STAGGER_DELAY = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--reveal-stagger')
    ) || 0.1;

    const observerOptions = {
        threshold: CONFIG.OBSERVER_THRESHOLD,
        rootMargin: CONFIG.OBSERVER_ROOT_MARGIN
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // If page loaded with a hash, find that section so we can skip its animation
    let hashTarget = null;
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
        let staggerIndex = 0;
        if (!el.classList.contains('section')) {
            const matchClass = ['project-card', 'skill-domain', 'cert-card', 'edu-item', 'about-card']
                .find(function(cls) { return el.classList.contains(cls); }) || '';
            const siblings = el.parentElement.children;
            let count = 0;
            for (let i = 0; i < siblings.length; i++) {
                if (siblings[i] === el) { staggerIndex = count; break; }
                if (matchClass && siblings[i].classList.contains(matchClass)) count++;
            }
        }

        const delay = staggerIndex * STAGGER_DELAY;
        const direction = getRevealDirection(el, staggerIndex);

        el.style.setProperty('--reveal-direction', direction);
        el.style.setProperty('--reveal-delay', delay + 's');
        el.classList.add('reveal-ready');

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

    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    let statusTimeout = null;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Honeypot check — if filled, silently reject (bot submission)
        const honeypot = form.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value) return;

        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        // Clear any pending status timeout from a previous submission
        if (statusTimeout) clearTimeout(statusTimeout);

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
        statusTimeout = setTimeout(() => {
            status.className = 'form-status';
        }, CONFIG.FORM_SUCCESS_TIMEOUT);
    });
}

// Page Entrance — skip animation on back/forward navigation
function initPageEntrance() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const navEntries = performance.getEntriesByType('navigation');
    const navType = navEntries.length ? navEntries[0].type : 'navigate';

    if (navType === 'back_forward') {
        document.documentElement.classList.add('skip-entrance');
    }
}

// Preloader cleanup — remove from DOM after animation ends
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader || preloader.classList.contains('done')) return;

    // Use e.target check instead of animation name — decoupled from CSS keyframe naming
    preloader.addEventListener('animationend', function (e) {
        if (e.target === preloader) {
            preloader.classList.add('done');
        }
    });
}

// Stat Counter — animate numeric stats when they scroll into view
function initStatCounter() {
    const stats = document.querySelectorAll('.stat-number[data-count]');
    if (!stats.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        stats.forEach(function (el) {
            el.textContent = el.dataset.count + (el.dataset.suffix || '');
        });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1200;
            let current = 0;
            let start = null;

            function step(timestamp) {
                if (!start) start = timestamp;
                const progress = Math.min((timestamp - start) / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                current = Math.round(eased * target);
                el.textContent = current + suffix;
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    stats.forEach(function (el) { observer.observe(el); });
}

// Scroll Progress Bar
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                bar.style.width = progress + '%';
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Active Section Indicator in Navigation
function initActiveSection() {
    const sections = document.querySelectorAll('.section[id], .hero[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');
    if (!sections.length || !navLinks.length) return;

    // Build a map of section id → nav link
    const linkMap = {};
    navLinks.forEach(function (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            linkMap[href.substring(1)] = link;
        }
    });

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;

            // Always clear — even for sections with no nav link (hero, contact)
            navLinks.forEach(function (l) { l.classList.remove('active'); });

            const link = linkMap[entry.target.id];
            if (link) link.classList.add('active');
        });
    }, {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    });

    sections.forEach(function (section) {
        observer.observe(section);
    });
}

// Back to Top Button
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const hero = document.getElementById('hero');
    let showThreshold = hero ? hero.offsetHeight : 600;

    // Recalculate threshold when viewport changes (e.g. orientation change)
    window.addEventListener('resize', function () {
        showThreshold = hero ? hero.offsetHeight : 600;
    }, { passive: true });

    window.addEventListener('scroll', function () {
        if (window.scrollY > showThreshold) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
