// ====== CONFIGURATION & GLOBALS ======
const CONFIG = {
    navHeightDesktop: 85,
    navHeightMobile: 100,
    formEndpoint: 'https://formspree.io/f/mbdrzrbq',
    projectImagesPath: 'assets/images/'
};

// Global state for cleanup
let globalState = {
    scrollListeners: new Set(),
    resizeListeners: new Set(),
    intersectionObservers: [],
    abortControllers: []
};

// ====== MAIN INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized - Enhanced version');

    // Initialize all modules with error handling
    try {
        initPerformanceMonitoring();
        initThemeSystem();
        initSmoothScroll();
        initMobileNav();
        initSkillsAccordion();
        initProjects();
        initContactForm();
        initPrintOptimizations();
        initLazyLoading();

        // Update copyright year
        document.getElementById('currentYear').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Initialization error:', error);
        showErrorToast('Some features may not work correctly. Please refresh the page.');
    }
});

// ====== PERFORMANCE MONITORING ======
function initPerformanceMonitoring() {
    // Log performance metrics in development
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const [navigationEntry] = performance.getEntriesByType('navigation');
                if (navigationEntry) {
                    console.log(`🚀 Performance Metrics:
                    - DOM Content Loaded: ${navigationEntry.domContentLoadedEventEnd.toFixed(2)}ms
                    - Page Load Complete: ${navigationEntry.loadEventEnd.toFixed(2)}ms
                    - First Contentful Paint: ${performance.getEntriesByName('first-contentful-paint')[0]?.startTime.toFixed(2) || 'N/A'}ms`);
                }
            }, 0);
        });
    }
}

// ====== THEME SYSTEM (Future-ready) ======
function initThemeSystem() {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('portfolio-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Store theme toggle for future implementation
    window.portfolioTheme = {
        toggle: () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
            console.log(`Theme changed to: ${newTheme}`);
        },
        current: () => document.documentElement.getAttribute('data-theme') || 'light'
    };
}

// ====== 1. ENHANCED SMOOTH SCROLLING ======
function initSmoothScroll() {
    // Set dynamic scroll offset based on screen size
    function updateScrollOffset() {
        const isMobile = window.innerWidth <= 768;
        const offset = isMobile ? CONFIG.navHeightMobile : CONFIG.navHeightDesktop;

        document.documentElement.style.setProperty('--nav-height', `${offset}px`);
        document.documentElement.style.scrollPaddingTop = `${offset}px`;
    }

    updateScrollOffset();
    window.addEventListener('resize', updateScrollOffset);
    globalState.resizeListeners.add(() => window.removeEventListener('resize', updateScrollOffset));

    // Enhanced smooth scroll with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const controller = new AbortController();
        globalState.abortControllers.push(controller);

        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#' || targetId === '#!') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const isMobile = window.innerWidth <= 768;
                const offset = isMobile ? CONFIG.navHeightMobile : CONFIG.navHeightDesktop;

                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without adding to history (for single page)
                history.replaceState(null, null, targetId);

                // Close mobile menu if open
                const navLinks = document.getElementById('nav-links');
                const hamburger = document.getElementById('hamburger');
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        }, { signal: controller.signal });
    });
}

// ====== 2. ENHANCED MOBILE NAVIGATION ======
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) {
        console.warn('Mobile navigation elements not found.');
        return;
    }

    const navItems = document.querySelectorAll('.nav-link');
    const controller = new AbortController();
    globalState.abortControllers.push(controller);

    // Toggle menu with animation
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');

        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';

        // Update aria attributes
        const isExpanded = navLinks.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    }, { signal: controller.signal });

    // Close menu when clicking links
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }, { signal: controller.signal });
    });

    // Close menu when clicking outside or pressing Escape
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target) && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }, { signal: controller.signal });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }, { signal: controller.signal });

    // Handle keyboard navigation in menu
    navLinks.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && navLinks.classList.contains('active')) {
            const focusableElements = navLinks.querySelectorAll('a[href]');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                hamburger.focus();
            }
        }
    }, { signal: controller.signal });
}

// ====== 3. ENHANCED SKILLS ACCORDION ======
function initSkillsAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (accordionItems.length === 0) return;

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (!header || !content) return;

        const controller = new AbortController();
        globalState.abortControllers.push(controller);

        // Click handler
        header.addEventListener('click', () => {
            const isAlreadyActive = item.classList.contains('active');

            // Close all other accordion items
            accordionItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.accordion-header');
                    const otherContent = otherItem.querySelector('.accordion-content');

                    if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                    if (otherContent) {
                        otherContent.style.maxHeight = null;
                        otherContent.setAttribute('aria-hidden', 'true');
                    }
                }
            });

            // Toggle current item
            if (!isAlreadyActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.setAttribute('aria-hidden', 'false');
            } else {
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
                content.setAttribute('aria-hidden', 'true');
            }
        }, { signal: controller.signal });

        // Keyboard support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }

            // Arrow key navigation between accordions
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const currentIndex = Array.from(accordionItems).indexOf(item);
                const direction = e.key === 'ArrowDown' ? 1 : -1;
                const nextIndex = (currentIndex + direction + accordionItems.length) % accordionItems.length;
                const nextHeader = accordionItems[nextIndex].querySelector('.accordion-header');

                if (nextHeader) {
                    nextHeader.focus();
                    nextHeader.click();
                }
            }
        }, { signal: controller.signal });

        // Initialize ARIA attributes
        header.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
    });
}

// ====== 4. ENHANCED PROJECTS SYSTEM ======
function initProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectDetail = document.getElementById('project-detail');
    const backButton = document.getElementById('back-to-projects');
    const detailContent = document.getElementById('detail-content');

    if (!projectsGrid || !projectDetail || !backButton || !detailContent) {
        console.warn('Projects section elements not found.');
        return;
    }

    // Project data manager
    const projectsManager = {
        data: getProjectsData(),
        currentProjectId: null,
        lastClickedCard: null,
        observer: null,

        renderDetail(projectId, clickedCard) {
            const project = this.data[projectId];
            if (!project) {
                this.showError('Project not found');
                return;
            }

            this.currentProjectId = projectId;
            this.lastClickedCard = clickedCard;

            // Show loading state
            detailContent.innerHTML = `
                <div class="project-loading">
                    <div class="spinner"></div>
                    <p>Loading project details...</p>
                </div>
            `;

            // Switch views
            projectsGrid.style.display = 'none';
            projectDetail.style.display = 'block';
            projectsGrid.setAttribute('aria-hidden', 'true');
            projectDetail.setAttribute('aria-hidden', 'false');

            // Render content after a small delay (simulate async)
            setTimeout(() => {
                detailContent.innerHTML = this.generateProjectDetailHTML(project);
                this.initProjectDetailInteractions();
                this.initStickyBackButton();

                // Set focus for accessibility
                detailContent.setAttribute('tabindex', '-1');
                detailContent.focus();

                // Track view (analytics placeholder)
                console.log(`Project viewed: ${project.title}`);
            }, 100);
        },

        generateProjectDetailHTML(project) {
            const imagePlaceholderSVG = `data:image/svg+xml;base64,${btoa(`
                <svg width="100%" height="200" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="400" height="200" fill="#f8f9fa"/>
                    <text x="200" y="100" font-family="Arial" font-size="14" fill="#636e72" text-anchor="middle" dy=".3em">
                        Project Diagram
                    </text>
                    <text x="200" y="120" font-family="Arial" font-size="12" fill="#adb5bd" text-anchor="middle" dy=".3em">
                        Add your screenshots to /assets/images/
                    </text>
                </svg>
            `)}`;

            const imagesHTML = project.images.map((imgName, index) => `
                <div class="image-item">
                    <div class="image-wrapper">
                        <img src="${CONFIG.projectImagesPath}${imgName}" 
                             alt="Project Image ${index + 1}: ${imgName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}" 
                             class="project-image"
                             loading="lazy"
                             decoding="async"
                             onerror="this.onerror=null; this.src='${imagePlaceholderSVG}'; this.alt='Image not available'; this.classList.add('image-error');">
                        <div class="image-loading"></div>
                        <div class="image-caption">${imgName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}</div>
                    </div>
                </div>
            `).join('');

            return `
                <header class="detail-header" id="project-detail-header">
                    <h2 class="detail-title">${project.title}</h2>
                    <div class="project-meta">
                        <span class="meta-item">${project.skills.length} technologies</span>
                        <span class="meta-separator">•</span>
                        <span class="meta-item">${project.images.length} images</span>
                    </div>
                </header>
                
                <nav class="detail-nav" aria-label="Project detail navigation">
                    <ul>
                        <li><a href="#overview" class="detail-nav-link">Overview</a></li>
                        <li><a href="#architecture" class="detail-nav-link">Architecture</a></li>
                        <li><a href="#results" class="detail-nav-link">Results</a></li>
                        <li><a href="#skills" class="detail-nav-link">Technologies</a></li>
                        <li><a href="#images" class="detail-nav-link">Images</a></li>
                    </ul>
                </nav>
                
                <main class="detail-main">
                    <section id="overview" class="detail-section">
                        <h3 class="detail-subtitle">🔹 Project Overview</h3>
                        <p>${project.overview}</p>
                    </section>
                    
                    <section id="architecture" class="detail-section">
                        <h3 class="detail-subtitle">🔹 Architecture & Implementation</h3>
                        <ul class="detail-list">
                            ${project.architecture.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </section>
                    
                    <section id="results" class="detail-section">
                        <h3 class="detail-subtitle">🔹 Results & Validation</h3>
                        <ul class="detail-list">
                            ${project.results.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </section>
                    
                    <section id="skills" class="detail-section">
                        <h3 class="detail-subtitle">🔹 Skills & Technologies Used</h3>
                        <div class="skills-container">
                            ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        </div>
                    </section>
                    
                    <section id="images" class="detail-section">
                        <h3 class="detail-subtitle">🔹 Project Images</h3>
                        <p><em>Visual documentation of the project's implementation and outcomes.</em></p>
                        <div class="images-container" id="project-images-container">
                            ${imagesHTML}
                        </div>
                        <p class="image-note">
                            <small>To add your screenshots, save them in the <code>/assets/images/</code> folder with the filenames listed in the project data.</small>
                        </p>
                    </section>
                </main>
                
                <footer class="detail-footer">
                    <button class="btn btn-secondary" onclick="window.print()">
                        <span class="print-icon">🖨️</span> Print Project Details
                    </button>
                </footer>
            `;
        },

        initProjectDetailInteractions() {
            // Image lazy loading enhancement
            const images = detailContent.querySelectorAll('.project-image');
            images.forEach(img => {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    img.previousElementSibling?.remove(); // Remove loading spinner
                });

                img.addEventListener('error', () => {
                    img.classList.add('error');
                    img.previousElementSibling?.remove();
                });
            });

            // Detail navigation smooth scroll
            const navLinks = detailContent.querySelectorAll('.detail-nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetElement = detailContent.querySelector(targetId);

                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // Update active nav link
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            });

            // Intersection observer for nav highlighting
            const sections = detailContent.querySelectorAll('.detail-section');
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const id = entry.target.id;
                            const correspondingLink = detailContent.querySelector(`.detail-nav-link[href="#${id}"]`);
                            if (correspondingLink) {
                                navLinks.forEach(l => l.classList.remove('active'));
                                correspondingLink.classList.add('active');
                            }
                        }
                    });
                },
                { root: detailContent, threshold: 0.5 }
            );

            sections.forEach(section => observer.observe(section));
            globalState.intersectionObservers.push(observer);
        },

        initStickyBackButton() {
            // Clean up previous observer
            if (this.observer) {
                this.observer.disconnect();
            }

            // Create new observer for sticky behavior
            this.observer = new IntersectionObserver(
                (entries) => {
                    const [entry] = entries;
                    backButton.classList.toggle('sticky-active', !entry.isIntersecting);

                    // Add smooth transition
                    if (!entry.isIntersecting) {
                        backButton.style.opacity = '1';
                        backButton.style.transform = window.innerWidth >= 769
                            ? 'translateX(-50%) translateY(0)'
                            : 'translateY(0)';
                    } else {
                        backButton.style.opacity = '0';
                        backButton.style.transform = window.innerWidth >= 769
                            ? 'translateX(-50%) translateY(-10px)'
                            : 'translateY(10px)';
                    }
                },
                {
                    root: null,
                    threshold: 0,
                    rootMargin: '-100px 0px 0px 0px'
                }
            );

            const header = detailContent.querySelector('.detail-header');
            if (header) {
                this.observer.observe(header);
            }
        },

        returnToProjects() {
            // Clean up observers
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            // Switch views
            projectDetail.style.display = 'none';
            projectsGrid.style.display = 'grid';
            projectsGrid.setAttribute('aria-hidden', 'false');
            projectDetail.setAttribute('aria-hidden', 'true');

            // Reset sticky button
            backButton.classList.remove('sticky-active');
            backButton.style.cssText = '';

            // Return focus to clicked card
            if (this.lastClickedCard) {
                setTimeout(() => {
                    this.lastClickedCard.focus();
                    this.lastClickedCard.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 100);
            }

            this.currentProjectId = null;
            this.lastClickedCard = null;
        },

        showError(message) {
            console.error('Project error:', message);

            // Show error toast
            const toast = document.createElement('div');
            toast.className = 'error-toast';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => toast.remove(), 5000);
        }
    };

    // Event listeners for project cards
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', function () {
            const projectId = this.getAttribute('data-project-id');
            projectsManager.renderDetail(projectId, this);
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectId = this.getAttribute('data-project-id');
                projectsManager.renderDetail(projectId, this);
            }
        });
    });

    // Back button
    backButton.addEventListener('click', () => projectsManager.returnToProjects());
    backButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            projectsManager.returnToProjects();
        }
    });

    // Handle browser back button
    window.addEventListener('popstate', () => {
        if (projectsManager.currentProjectId) {
            projectsManager.returnToProjects();
        }
    });
}

// ====== 5. ENHANCED CONTACT FORM ======
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form || !status) {
        console.warn('Contact form elements not found.');
        return;
    }

    // Honeypot field for spam protection
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_gotcha';
    honeypot.style.display = 'none';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.setAttribute('tabindex', '-1');
    honeypot.autocomplete = 'off';
    form.appendChild(honeypot);

    // Timestamp for rate limiting
    const timestamp = document.createElement('input');
    timestamp.type = 'hidden';
    timestamp.name = '_timestamp';
    timestamp.value = Date.now();
    form.appendChild(timestamp);

    // Accessibility setup
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    status.setAttribute('aria-relevant', 'additions text');

    // Form validation functions
    const validators = {
        name: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return 'Please enter your name.';
            if (trimmed.length < 2) return 'Name must be at least 2 characters.';
            if (trimmed.length > 100) return 'Name is too long (max 100 characters).';
            return null;
        },

        email: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return 'Please enter your email address.';

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';

            // Additional email validation
            if (trimmed.length > 254) return 'Email is too long.';
            if (trimmed.includes('..')) return 'Email contains invalid characters.';

            return null;
        },

        message: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return 'Please enter your message.';
            if (trimmed.length < 10) return 'Message must be at least 10 characters.';
            if (trimmed.length > 5000) return 'Message is too long (max 5000 characters).';

            // Check for suspicious content
            const suspiciousPatterns = [
                /\[url\]/i,
                /\[link\]/i,
                /http[s]?:\/\//i,
                /<script/i,
                /onclick=/i,
                /javascript:/i
            ];

            if (suspiciousPatterns.some(pattern => pattern.test(trimmed))) {
                return 'Message contains suspicious content. Please remove any links or scripts.';
            }

            return null;
        }
    };

    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
        const fieldName = field.id || field.name;

        field.addEventListener('blur', () => {
            const validator = validators[fieldName];
            if (validator) {
                const error = validator(field.value);
                updateFieldValidation(field, error);
            }
        });

        field.addEventListener('input', () => {
            // Clear any previous error styling
            field.classList.remove('error');
            field.nextElementSibling?.remove();

            // Clear status message if user starts typing
            if (status.textContent && status.style.color === '#d63031') {
                clearStatus();
            }
        });
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Check honeypot
        if (honeypot.value) {
            console.log('Spam detected via honeypot');
            showErrorStatus('❌ Submission blocked. Please try again.');
            return;
        }

        // Rate limiting check (5 seconds between submissions)
        const lastSubmit = parseInt(timestamp.value);
        if (Date.now() - lastSubmit < 5000) {
            showErrorStatus('❌ Please wait a few seconds before submitting again.');
            return;
        }

        // Validate all fields
        const formData = new FormData(form);
        let hasErrors = false;

        for (const [fieldName, validator] of Object.entries(validators)) {
            const fieldValue = formData.get(fieldName) || '';
            const error = validator(fieldValue);

            if (error) {
                const field = form.querySelector(`[name="${fieldName}"]`);
                if (field) {
                    updateFieldValidation(field, error);
                    if (!hasErrors) field.focus();
                    hasErrors = true;
                }
            }
        }

        if (hasErrors) return;

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        const originalButtonHTML = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = `
            <span class="spinner-small"></span>
            Sending...
        `;

        // Update timestamp
        timestamp.value = Date.now();

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                showSuccessStatus();
                form.reset();

                // Success animation
                submitButton.innerHTML = '✓ Sent!';
                submitButton.style.backgroundColor = '#00b894';

                setTimeout(() => {
                    submitButton.innerHTML = originalButtonHTML;
                    submitButton.style.backgroundColor = '';
                    submitButton.disabled = false;
                }, 2000);

                // Focus on name field for next message
                setTimeout(() => document.getElementById('name').focus(), 100);

                // Log success (analytics placeholder)
                console.log('Contact form submitted successfully');

            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error ||
                    errorData.errors?.map(e => e.message).join(', ') ||
                    '❌ Server error. Please try again.';

                showErrorStatus(errorMessage);
                resetSubmitButton(submitButton, originalButtonHTML);
            }

        } catch (error) {
            console.error('Form submission error:', error);
            showErrorStatus('❌ Network error. Please check your connection.');
            resetSubmitButton(submitButton, originalButtonHTML);
        }
    });

    // Helper functions
    function updateFieldValidation(field, error) {
        field.classList.remove('error');
        field.nextElementSibling?.remove();

        if (error) {
            field.classList.add('error');

            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = error;
            errorElement.setAttribute('role', 'alert');
            errorElement.setAttribute('aria-live', 'assertive');

            field.parentNode.appendChild(errorElement);
        }
    }

    function showSuccessStatus() {
        status.innerHTML = `
            <div class="status-success">
                <span class="status-icon">✅</span>
                <div>
                    <strong>Thank you!</strong> Your message has been sent successfully.
                    <br><small>I'll get back to you within 24-48 hours.</small>
                </div>
            </div>
        `;
        status.className = 'form-status success';
    }

    function showErrorStatus(message) {
        status.innerHTML = `
            <div class="status-error">
                <span class="status-icon">❌</span>
                <div>${message}</div>
            </div>
        `;
        status.className = 'form-status error';

        // Auto-clear after 10 seconds
        setTimeout(() => {
            if (status.classList.contains('error')) {
                clearStatus();
            }
        }, 10000);
    }

    function clearStatus() {
        status.textContent = '';
        status.className = 'form-status';
    }

    function resetSubmitButton(button, originalHTML) {
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.disabled = false;
        }, 1500);
    }
}

// ====== 6. PRINT OPTIMIZATIONS ======
function initPrintOptimizations() {
    // Add print styles dynamically
    const printStyles = `
        @media print {
            * {
                background: transparent !important;
                color: #000 !important;
                box-shadow: none !important;
                text-shadow: none !important;
            }
            
            nav, 
            .btn, 
            .contact-form-col,
            .hamburger,
            .btn-back,
            .detail-nav,
            .detail-footer {
                display: none !important;
            }
            
            body {
                font-size: 12pt;
                line-height: 1.5;
                font-family: 'Georgia', 'Times New Roman', serif;
            }
            
            .container {
                width: 100% !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
            }
            
            section {
                padding: 1rem 0 !important;
                page-break-inside: avoid;
            }
            
            .section-title {
                font-size: 16pt !important;
                margin-bottom: 1rem !important;
            }
            
            .section-title::after {
                display: none !important;
            }
            
            a {
                color: #000 !important;
                text-decoration: underline !important;
            }
            
            a[href^="http"]::after {
                content: " (" attr(href) ")";
                font-size: 10pt;
                font-weight: normal;
            }
            
            .project-detail {
                box-shadow: none !important;
                border: 1px solid #ddd !important;
            }
            
            .skill-tag {
                border: 1px solid #000 !important;
                background: none !important;
                color: #000 !important;
            }
            
            @page {
                margin: 0.5in;
            }
            
            h1, h2, h3 {
                page-break-after: avoid;
            }
            
            ul, ol, img {
                page-break-inside: avoid;
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
}

// ====== 7. LAZY LOADING ENHANCEMENT ======
function initLazyLoading() {
    // Use IntersectionObserver for images outside of project details
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.classList.add('lazy-loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
        globalState.intersectionObservers.push(imageObserver);
    }
}

// ====== 8. ERROR HANDLING & TOASTS ======
function showErrorToast(message) {
    const toast = document.createElement('div');
    toast.className = 'global-toast error';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
        <span class="toast-icon">⚠️</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" aria-label="Dismiss">×</button>
    `;

    document.body.appendChild(toast);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 5000);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    });
}

// ====== 9. CLEANUP ON PAGE UNLOAD ======
window.addEventListener('beforeunload', () => {
    // Clean up all observers
    globalState.intersectionObservers.forEach(observer => observer.disconnect());

    // Clean up all event listeners
    globalState.abortControllers.forEach(controller => controller.abort());

    // Remove any global styles
    document.querySelectorAll('[data-dynamic-style]').forEach(el => el.remove());
});

// ====== 10. PROJECT DATA (Externalized) ======
function getProjectsData() {
    // Same as your existing project data
    return {
        1: {
            title: "Enterprise Virtualization Cluster with VMware vSphere, HA & Fault Tolerance",
            overview: "The objective of this project was to design, deploy, and validate a highly available enterprise virtualization infrastructure using VMware vSphere. The environment was built to ensure service continuity, centralized management, and infrastructure resilience through the implementation of High Availability (HA) and Fault Tolerance (FT). This project focused on core virtualization concepts used in production data centers, emphasizing reliability, failover, and operational stability.",
            architecture: [
                "Deployed and configured multiple VMware ESXi hosts to form a clustered environment.",
                "Installed and configured vCenter Server for centralized management and monitoring.",
                "Created a vSphere cluster with High Availability (HA) enabled for automatic VM recovery.",
                "Implemented Fault Tolerance (FT) to ensure zero downtime for critical virtual machines.",
                "Configured shared iSCSI storage to support VM mobility and cluster services.",
                "Designed virtual networking for management, storage, and VM traffic separation.",
                "Integrated Active Directory authentication for role-based administrative access."
            ],
            results: [
                "Successfully validated HA failover by simulating host outages and confirming automatic VM restarts.",
                "Achieved continuous availability for protected workloads using Fault Tolerance.",
                "Ensured reliable VM mobility and storage accessibility across cluster nodes.",
                "Demonstrated enterprise-grade resilience, redundancy, and manageability.",
                "Confirmed compliance with virtualization best practices for availability and fault tolerance."
            ],
            skills: [
                "VMware vSphere / ESXi",
                "vCenter Server",
                "High Availability (HA)",
                "Fault Tolerance (FT)",
                "iSCSI shared storage",
                "Virtual networking & traffic segmentation",
                "Active Directory integration",
                "Infrastructure testing & validation"
            ],
            images: ["vmware-arch-diagram.jpg", "vcenter-dashboard.png", "ha-test-result.png"]
        },
        2: {
            title: "Microsoft Exchange Server 2019 Infrastructure with Database Availability Group (DAG)",
            overview: "The objective of this project was to design, deploy, and validate a highly available enterprise email infrastructure using Microsoft Exchange Server 2019. The environment was built to support secure messaging, centralized administration, and high availability through the implementation of a Database Availability Group (DAG). This project simulated a real-world enterprise collaboration platform, focusing on Active Directory integration, mailbox resiliency, and service continuity.",
            architecture: [
                "Deployed a Windows Server–based Active Directory domain with integrated DNS services.",
                "Designed and implemented a structured Organizational Unit (OU) hierarchy following best practices.",
                "Created and managed users, security groups, and service accounts for Exchange administration.",
                "Installed and configured Microsoft Exchange Server 2019 on multiple member servers.",
                "Configured DHCP services to support dynamic client addressing within the environment.",
                "Implemented department-based file shares with access control enforced through Group Policy Objects (GPOs).",
                "Created and mounted custom mailbox databases across Exchange servers.",
                "Configured mailboxes, shared mailboxes, resource mailboxes, and distribution groups using the Exchange Admin Center (EAC).",
                "Performed Exchange administration using PowerShell, including mailbox and group creation.",
                "Implemented a Database Availability Group (DAG) with mailbox database replication and failover capabilities.",
                "Configured a witness server to support DAG quorum and resiliency."
            ],
            results: [
                "Successfully validated mail flow between users across different departments.",
                "Confirmed correct functionality of shared mailboxes, resource booking, and distribution groups.",
                "Verified mailbox database replication between Exchange servers.",
                "Tested DAG failover to ensure mailbox availability during simulated server outages.",
                "Achieved a resilient and fault-tolerant enterprise email platform aligned with Microsoft best practices.",
                "Demonstrated reliable identity-based access control through AD and Exchange role separation."
            ],
            skills: [
                "Microsoft Exchange Server 2019",
                "Database Availability Group (DAG)",
                "Windows Server",
                "Active Directory Domain Services (AD DS)",
                "DNS & DHCP",
                "Group Policy Objects (GPO)",
                "Exchange Admin Center (EAC)",
                "Exchange Management Shell (PowerShell)",
                "Mailbox databases & replication",
                "Enterprise messaging & collaboration infrastructure"
            ],
            images: ["exchange-dag-diagram.jpg", "eac-mailflow.png", "powershell-output.png"]
        },
        3: {
            title: "Multi-Region Enterprise Network Architecture & IP Addressing Strategy",
            overview: "The objective of this capstone project was to design and model a scalable, multi-region enterprise network supporting geographically distributed offices. The environment simulated corporate sites in North America and Asia, focusing on hardware selection, IP addressing strategy, site connectivity, and infrastructure scalability. This project emphasized network design fundamentals, capacity planning, and real-world enterprise considerations rather than device-level configuration.",
            architecture: [
                "Designed a multi-site enterprise network architecture connecting regional offices across different geographic locations.",
                "Evaluated and selected end-user workstation models tailored to office staff and software development workloads.",
                "Recommended enterprise-grade server hardware optimized for virtualization and infrastructure services.",
                "Designed a virtualized infrastructure model suitable for hosting server workloads at each site.",
                "Developed a structured IP addressing scheme based on organizational size, scalability, and regional segmentation.",
                "Selected appropriate IP address classes and subnetting strategies to support future growth.",
                "Planned inter-site connectivity to ensure reliable communication between regions.",
                "Executed the design within a vSphere-based academic environment, collaborating remotely with team members on shared virtual infrastructure."
            ],
            results: [
                "Delivered a complete end-to-end network design addressing compute, network, and server infrastructure needs.",
                "Produced a scalable IP addressing plan that supports expansion without re-architecting.",
                "Demonstrated effective capacity planning for both user devices and server workloads.",
                "Validated connectivity and interoperability between regional office environments.",
                "Successfully collaborated in a distributed team environment, simulating real enterprise project workflows."
            ],
            skills: [
                "Enterprise network design & planning",
                "IP addressing & subnetting",
                "Multi-site infrastructure architecture",
                "Virtualization-ready server design",
                "Capacity planning & hardware evaluation",
                "vSphere-based lab environments",
                "Technical documentation & team collaboration"
            ],
            images: ["network-architecture-diagram.png", "ip-addressing-plan.jpg", "team-collab-screen.png"]
        },
        4: {
            title: "Multi-Site Secure Enterprise Network with Segmentation, Dynamic Routing & Centralized Services",
            overview: "The objective of this project was to design, deploy, and secure a multi-site enterprise network interconnecting geographically distributed offices. The environment simulated corporate sites located in Toronto, Vancouver, and Tokyo, with a focus on secure inter-site connectivity, network segmentation, centralized services, and controlled administrative access. This project emphasized enterprise networking, security controls, and operational manageability using both simulated and physical network equipment.",
            architecture: [
                "Designed a Layer 3 multi-site network architecture interconnecting three enterprise locations.",
                "Implemented dynamic routing using EIGRP (AS100) to enable scalable and resilient inter-site communication.",
                "Segmented each site into Admin and General VLANs to reduce broadcast domains and enforce security boundaries.",
                "Applied inter-VLAN access control lists (ACLs) to restrict General VLAN access to sensitive administrative resources.",
                "Deployed centralized enterprise services (web server, TFTP backup server, and Syslog server) hosted in the Tokyo site.",
                "Configured extended ACLs to tightly control access to centralized services based on site and user role.",
                "Implemented port security on access-layer switch ports with real-time violation logging to a centralized Syslog server.",
                "Enabled secure remote device management using SSH.",
                "Configured role-based access control (RBAC) with distinct privilege levels for administrators, technicians, and interns.",
                "Modeled the network in Cisco Packet Tracer, then replicated and tested the design on physical networking equipment."
            ],
            results: [
                "Successfully established reliable inter-site connectivity across all enterprise locations.",
                "Verified correct routing convergence and failover behavior using EIGRP.",
                "Confirmed VLAN isolation and ACL enforcement through controlled access testing.",
                "Validated secure access to centralized services based on user role and site location.",
                "Detected and logged port security violations in real time via centralized Syslog monitoring.",
                "Demonstrated secure and auditable remote network administration using SSH and RBAC.",
                "Delivered a scalable and security-focused enterprise network aligned with industry best practices."
            ],
            skills: [
                "Enterprise network architecture & design",
                "EIGRP dynamic routing",
                "VLAN segmentation & inter-VLAN routing",
                "Standard & extended Access Control Lists (ACLs)",
                "Port security & centralized logging (Syslog)",
                "Secure remote management (SSH)",
                "Role-Based Access Control (RBAC)",
                "Cisco Packet Tracer & physical network devices",
                "Enterprise documentation & testing"
            ],
            images: ["network-topology.jpg", "eigrp-tables.png", "syslog-monitor.png"]
        }
    };
}

// ====== POLYFILLS & FALLBACKS ======
// Ensure smooth scrolling works in all browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    import('https://cdn.jsdelivr.net/npm/smoothscroll-polyfill@0.4.4/dist/smoothscroll.min.js')
        .then(() => console.log('SmoothScroll polyfill loaded'))
        .catch(err => console.warn('SmoothScroll polyfill failed:', err));
}

// Console welcome message
console.log(`
╔══════════════════════════════════════╗
║   Majestor Kepseu Portfolio v2.0     ║
║   Enhanced with modern features      ║
║   © ${new Date().getFullYear()} - All rights reserved  ║
╚══════════════════════════════════════╝
`);