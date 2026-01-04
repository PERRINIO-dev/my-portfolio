// ====== PORTFOLIO ENHANCEMENTS v3.2 - RELIABILITY FOCUSED ======
// Comprehensive fixes for all reported issues

// ====== CONFIGURATION ======
const CONFIG = {
    navScrolledThreshold: 30,
    revealThreshold: 0.1,
    revealRootMargin: '0px 0px -100px 0px',
    projectImagesPath: 'assets/images/',
    profileImagePath: 'assets/profile.jpg',
    formEndpoint: 'https://formspree.io/f/mbdrzrbq'
};

// ====== STATE MANAGEMENT ======
const AppState = {
    currentProject: null,
    lastProjectCard: null,
    isNavScrolled: false,
    isMobileMenuOpen: false,
    observers: new Set(),
    timeouts: new Set(),
    events: new Map(),
    isMobileView: false,
    gradientSupported: null
};

// ====== UTILITY FUNCTIONS ======
function detectGradientSupport() {
    // Test if browser supports background-clip text
    const testEl = document.createElement('div');
    testEl.style.cssText = 'background-clip:text;-webkit-background-clip:text;';
    const supported = 'backgroundClip' in testEl.style || 'webkitBackgroundClip' in testEl.style;
    
    // Add class to body for CSS fallbacks
    if (!supported) {
        document.body.classList.add('no-backgroundclip');
    }
    
    AppState.gradientSupported = supported;
    console.log(`Gradient text support: ${supported ? 'Yes' : 'No'}`);
    return supported;
}

function isMobileView() {
    return window.innerWidth <= 768;
}

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

// ====== MAIN INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio v3.2 - Reliability Focused');
    
    try {
        // Detect capabilities
        detectGradientSupport();
        AppState.isMobileView = isMobileView();
        
        // Initialize core modules
        initializeNavigation();
        initializeSmoothScroll();
        initializeRevealAnimations();
        initializeProjects();
        initializeContactForm();
        
        // Update dynamic content
        updateCopyrightYear();
        initializeHeroPortrait();
        
        // Listen for viewport changes
        window.addEventListener('resize', debounce(() => {
            AppState.isMobileView = isMobileView();
        }, 250));
        
        console.log('✅ All modules initialized successfully');
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showToast('Some features may not work correctly. Please refresh.', 'error');
    }
});

// ====== NAVIGATION ENHANCEMENTS ======
function initializeNavigation() {
    const nav = document.querySelector('.main-nav');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    
    if (!nav || !hamburger || !navLinks) {
        console.warn('Navigation elements not found');
        return;
    }
    
    // Update active nav link based on scroll
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
    
    // Handle scroll behavior
    function handleScroll() {
        const shouldBeScrolled = window.scrollY > CONFIG.navScrolledThreshold;
        
        if (shouldBeScrolled !== AppState.isNavScrolled) {
            AppState.isNavScrolled = shouldBeScrolled;
            nav.classList.toggle('nav-scrolled', shouldBeScrolled);
        }
        
        // Update active nav link
        updateActiveNavLink();
    }
    
    // Mobile menu toggle
    function toggleMobileMenu() {
        AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
        navLinks.classList.toggle('active', AppState.isMobileMenuOpen);
        hamburger.classList.toggle('active', AppState.isMobileMenuOpen);
        hamburger.setAttribute('aria-expanded', AppState.isMobileMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = AppState.isMobileMenuOpen ? 'hidden' : '';
        
        // Update nav state for mobile
        if (AppState.isMobileMenuOpen) {
            nav.classList.add('nav-scrolled');
        } else if (window.scrollY <= CONFIG.navScrolledThreshold) {
            nav.classList.remove('nav-scrolled');
        }
    }
    
    // Close mobile menu when clicking outside
    function handleOutsideClick(event) {
        if (AppState.isMobileMenuOpen && 
            !navLinks.contains(event.target) && 
            !hamburger.contains(event.target)) {
            toggleMobileMenu();
        }
    }
    
    // Close mobile menu on Escape key
    function handleEscapeKey(event) {
        if (AppState.isMobileMenuOpen && event.key === 'Escape') {
            toggleMobileMenu();
        }
    }
    
    // Close mobile menu when clicking a link
    function closeMenuOnLinkClick() {
        if (AppState.isMobileMenuOpen) {
            toggleMobileMenu();
        }
    }
    
    // Event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    hamburger.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenuOnLinkClick);
    });
    
    // Initialize scroll state
    handleScroll();
    
    // Cleanup function
    AppState.events.set('nav-cleanup', () => {
        window.removeEventListener('scroll', handleScroll);
        hamburger.removeEventListener('click', toggleMobileMenu);
        document.removeEventListener('click', handleOutsideClick);
        document.removeEventListener('keydown', handleEscapeKey);
    });
}

// ====== SMOOTH SCROLL ENHANCEMENTS ======
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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
                
                // Update URL
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
    
    // Observe each reveal element with staggered delay
    revealElements.forEach((element, index) => {
        // Add staggered delay for visual interest
        element.style.transitionDelay = `${Math.min(index * 50, 300)}ms`;
        revealObserver.observe(element);
    });
    
    // Store observer for cleanup
    AppState.observers.add(revealObserver);
}

// ====== HERO PORTRAIT INITIALIZATION ======
function initializeHeroPortrait() {
    const portraitImg = document.querySelector('.portrait-img');
    
    if (!portraitImg) {
        console.warn('Hero portrait element not found');
        return;
    }
    
    // Set profile image source
    portraitImg.src = CONFIG.profileImagePath;
    
    // Add loading state
    portraitImg.onload = () => {
        portraitImg.style.opacity = '1';
    };
    
    portraitImg.onerror = () => {
        console.warn('Profile image failed to load');
        // Set a solid color fallback
        portraitImg.style.background = 'var(--accent)';
        portraitImg.style.opacity = '0.3';
    };
}

// ====== PROJECTS SYSTEM ======
function initializeProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectDetail = document.getElementById('project-detail');
    const detailContent = document.getElementById('detail-content');
    
    if (!projectsGrid || !projectDetail || !detailContent) {
        console.warn('Projects section elements not found');
        return;
    }
    
    // Project data
    const projectsData = getProjectsData();
    
    // Current state
    let currentProjectId = null;
    let lastClickedCard = null;
    let sectionHighlightObserver = null;
    let floatingButtonObserver = null;
    let floatingButton = null;
    let staticBackButton = null;
    
    // ====== PROJECT CARD HANDLERS ======
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', handleProjectCardClick);
        card.addEventListener('keydown', handleProjectCardKeydown);
    });
    
    function handleProjectCardClick(event) {
        const projectId = this.getAttribute('data-project-id');
        openProjectDetail(projectId, this);
    }
    
    function handleProjectCardKeydown(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const projectId = this.getAttribute('data-project-id');
            openProjectDetail(projectId, this);
        }
    }
    
    // ====== OPEN PROJECT DETAIL ======
    function openProjectDetail(projectId, clickedCard) {
        const project = projectsData[projectId];
        if (!project) return;
        
        currentProjectId = projectId;
        lastClickedCard = clickedCard;
        
        // Show loading state
        detailContent.innerHTML = createLoadingHTML();
        
        // Switch views
        projectsGrid.style.display = 'none';
        projectDetail.style.display = 'block';
        projectsGrid.setAttribute('aria-hidden', 'true');
        projectDetail.setAttribute('aria-hidden', 'false');
        
        // Render project detail
        setTimeout(() => {
            detailContent.innerHTML = createProjectDetailHTML(project);
            
            // Initialize detail interactions
            initializeDetailInteractions();
            
            // Create and setup back buttons
            createBackButtons();
            setupBackButtonObservers();
            
            // Show floating button immediately
            if (floatingButton) {
                setTimeout(() => {
                    floatingButton.classList.add('visible');
                }, 300);
            }
            
            // Set focus for accessibility
            detailContent.focus({ preventScroll: true });
            
            // Update URL
            history.pushState(null, null, `#project-${projectId}`);
        }, 300);
    }
    
    // ====== CREATE PROJECT DETAIL HTML ======
    function createProjectDetailHTML(project) {
        const imagesHTML = project.images.map((imgName, index) => `
            <div class="image-item">
                <div class="image-wrapper">
                    <img src="${CONFIG.projectImagesPath}${imgName}" 
                         alt="Project Image ${index + 1}: ${imgName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}" 
                         class="project-image"
                         loading="lazy"
                         decoding="async"
                         onerror="this.onerror=null; this.classList.add('error');">
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
                    <li><a href="#overview" class="detail-nav-link active">Overview</a></li>
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
                    <div class="images-container">
                        ${imagesHTML}
                    </div>
                </section>
                
                <!-- Static Back Button (Bottom Left) -->
                <div class="static-back-button-container">
                    <button class="btn btn-secondary btn-back-static" id="static-back-button" aria-label="Back to all projects">
                        <i class="fas fa-arrow-left"></i>
                        <span>Back to Projects</span>
                    </button>
                </div>
            </main>
            
            <footer class="detail-footer">
                <button class="btn btn-secondary print-btn" onclick="window.print()">
                    <i class="fas fa-print"></i>
                    <span>Print Project Details</span>
                </button>
            </footer>
        `;
    }
    
    function createLoadingHTML() {
        return `
            <div class="project-loading">
                <div class="loading-spinner"></div>
                <p>Loading project details...</p>
            </div>
        `;
    }
    
    // ====== CREATE BACK BUTTONS ======
    function createBackButtons() {
        // Create floating button if it doesn't exist
        if (!floatingButton) {
            floatingButton = document.createElement('button');
            floatingButton.className = 'btn-back-floating';
            floatingButton.setAttribute('aria-label', 'Back to projects');
            floatingButton.innerHTML = '<i class="fas fa-arrow-left"></i>';
            floatingButton.setAttribute('tabindex', '0');
            document.body.appendChild(floatingButton);
            
            // Add click handler
            floatingButton.addEventListener('click', returnToProjects);
            floatingButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    returnToProjects();
                }
            });
        }
        
        // Get static button
        staticBackButton = document.getElementById('static-back-button');
        if (staticBackButton) {
            staticBackButton.addEventListener('click', returnToProjects);
            staticBackButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    returnToProjects();
                }
            });
        }
    }
    
    // ====== SETUP BACK BUTTON OBSERVERS ======
    function setupBackButtonObservers() {
        // Clean up previous observers
        if (floatingButtonObserver) {
            floatingButtonObserver.disconnect();
            floatingButtonObserver = null;
        }
        
        const staticButton = staticBackButton;
        if (!staticButton || !floatingButton) return;
        
        // Observer to show/hide floating button based on static button visibility
        floatingButtonObserver = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                
                if (entry.isIntersecting) {
                    // Static button is visible, hide floating button
                    floatingButton.classList.remove('visible');
                } else {
                    // Static button is not visible, show floating button
                    floatingButton.classList.add('visible');
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px' // Triggers when static button enters viewport
            }
        );
        
        floatingButtonObserver.observe(staticButton);
        AppState.observers.add(floatingButtonObserver);
        
        // Show floating button initially (static button won't be visible yet)
        floatingButton.classList.add('visible');
    }
    
    // ====== INITIALIZE DETAIL INTERACTIONS ======
    function initializeDetailInteractions() {
        // === FIX 3: OPTIMIZED SECTION HIGHLIGHTING ===
        initializeSectionHighlighting();
        
        // Initialize image loading
        initializeImageLoading();
        
        // Initialize smooth scroll for detail navigation
        initializeDetailNavigation();
    }
    
    function initializeSectionHighlighting() {
        const sections = detailContent.querySelectorAll('.detail-section');
        const navLinks = detailContent.querySelectorAll('.detail-nav-link');
        
        if (!sections.length || !navLinks.length) return;
        
        // Clean up previous observer
        if (sectionHighlightObserver) {
            sectionHighlightObserver.disconnect();
            sectionHighlightObserver = null;
        }
        
        // Different settings for mobile vs desktop
        const observerOptions = AppState.isMobileView ? {
            root: null,
            threshold: [0.1, 0.3, 0.5],
            rootMargin: '-10% 0px -40% 0px' // Smaller margins for mobile
        } : {
            root: null,
            threshold: [0.1, 0.3, 0.5, 0.7],
            rootMargin: '-20% 0px -60% 0px' // Larger margins for desktop
        };
        
        sectionHighlightObserver = new IntersectionObserver(
            (entries) => {
                // Find the most visible section
                let mostVisible = null;
                let highestRatio = 0;
                
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
                        highestRatio = entry.intersectionRatio;
                        mostVisible = entry.target;
                    }
                });
                
                // Update active nav link
                if (mostVisible && highestRatio > (AppState.isMobileView ? 0.2 : 0.3)) {
                    const id = mostVisible.id;
                    const correspondingLink = detailContent.querySelector(`.detail-nav-link[href="#${id}"]`);
                    
                    if (correspondingLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        correspondingLink.classList.add('active');
                    }
                }
            },
            observerOptions
        );
        
        sections.forEach(section => sectionHighlightObserver.observe(section));
        AppState.observers.add(sectionHighlightObserver);
    }
    
    function initializeImageLoading() {
        const images = detailContent.querySelectorAll('.project-image');
        
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.style.opacity = '1';
            });
            
            img.addEventListener('error', () => {
                console.warn(`Failed to load image: ${img.src}`);
                img.style.opacity = '0.5';
            });
        });
    }
    
    function initializeDetailNavigation() {
        const navLinks = detailContent.querySelectorAll('.detail-nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = detailContent.querySelector(targetId);
                
                if (targetElement) {
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Scroll to section
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // ====== RETURN TO PROJECTS GRID ======
    function returnToProjects() {
        // Hide floating button
        if (floatingButton) {
            floatingButton.classList.remove('visible');
        }
        
        // Clean up observers
        if (sectionHighlightObserver) {
            sectionHighlightObserver.disconnect();
            sectionHighlightObserver = null;
        }
        
        if (floatingButtonObserver) {
            floatingButtonObserver.disconnect();
            floatingButtonObserver = null;
        }
        
        // Switch views
        projectDetail.style.display = 'none';
        projectsGrid.style.display = 'grid';
        projectsGrid.setAttribute('aria-hidden', 'false');
        projectDetail.setAttribute('aria-hidden', 'true');
        
        // Return focus to clicked card
        if (lastClickedCard) {
            setTimeout(() => {
                lastClickedCard.focus();
                lastClickedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        }
        
        // Update URL
        history.pushState(null, null, '#projects');
        
        // Reset state
        currentProjectId = null;
        lastClickedCard = null;
    }
    
    // ====== CLEANUP FUNCTION ======
    AppState.events.set('projects-cleanup', () => {
        if (sectionHighlightObserver) {
            sectionHighlightObserver.disconnect();
        }
        
        if (floatingButtonObserver) {
            floatingButtonObserver.disconnect();
        }
        
        document.querySelectorAll('.project-card').forEach(card => {
            card.removeEventListener('click', handleProjectCardClick);
            card.removeEventListener('keydown', handleProjectCardKeydown);
        });
        
        if (floatingButton) {
            floatingButton.removeEventListener('click', returnToProjects);
            if (floatingButton.parentNode) {
                floatingButton.parentNode.removeChild(floatingButton);
            }
        }
        
        if (staticBackButton) {
            staticBackButton.removeEventListener('click', returnToProjects);
        }
        
        window.removeEventListener('popstate', () => {});
    });
    
    // Handle browser back button
    window.addEventListener('popstate', () => {
        if (currentProjectId) {
            returnToProjects();
        }
    });
}

// ====== CONTACT FORM ENHANCEMENTS ======
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (!form || !status) {
        console.warn('Contact form elements not found');
        return;
    }
    
    // Honeypot field for spam protection
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_gotcha';
    honeypot.style.display = 'none';
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.setAttribute('tabindex', '-1');
    form.appendChild(honeypot);
    
    // Timestamp for rate limiting
    const timestamp = document.createElement('input');
    timestamp.type = 'hidden';
    timestamp.name = '_timestamp';
    timestamp.value = Date.now();
    form.appendChild(timestamp);
    
    // Form validation functions
    const validators = {
        name: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return 'Please enter your name';
            if (trimmed.length < 2) return 'Name must be at least 2 characters';
            return null;
        },
        
        email: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return 'Please enter your email address';
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
            
            return null;
        },
        
        message: (value) => {
            const trimmed = value.trim();
            if (!trimmed) return 'Please enter your message';
            if (trimmed.length < 10) return 'Message must be at least 10 characters';
            return null;
        }
    };
    
    // Real-time validation
    form.querySelectorAll('input, textarea').forEach(field => {
        const fieldName = field.id;
        
        field.addEventListener('blur', () => {
            const validator = validators[fieldName];
            if (validator) {
                const error = validator(field.value);
                updateFieldValidation(field, error);
            }
        });
        
        field.addEventListener('input', () => {
            field.classList.remove('error');
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('field-error')) {
                errorElement.remove();
            }
            
            // Clear status if user starts typing
            if (status.textContent) {
                clearStatus();
            }
        });
    });
    
    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Check honeypot
        if (honeypot.value) {
            showErrorStatus('Submission blocked. Please try again.');
            return;
        }
        
        // Rate limiting (5 seconds between submissions)
        const lastSubmit = parseInt(timestamp.value);
        if (Date.now() - lastSubmit < 5000) {
            showErrorStatus('Please wait a few seconds before submitting again.');
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
        const originalText = submitButton.innerHTML;
        
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
                submitButton.style.background = 'var(--success-color)';
                
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.style.background = '';
                    submitButton.disabled = false;
                }, 2000);
                
                // Focus on name field
                setTimeout(() => document.getElementById('name').focus(), 100);
                
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || 'Server error. Please try again.';
                showErrorStatus(errorMessage);
                resetSubmitButton(submitButton, originalText);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            showErrorStatus('Network error. Please check your connection.');
            resetSubmitButton(submitButton, originalText);
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
            
            field.parentNode.appendChild(errorElement);
        }
    }
    
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
        
        // Auto-clear after 10 seconds
        const timeout = setTimeout(() => {
            if (status.classList.contains('error')) {
                clearStatus();
            }
        }, 10000);
        
        AppState.timeouts.add(timeout);
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
    
    // Cleanup function
    AppState.events.set('form-cleanup', () => {
        form.removeEventListener('submit', () => {});
    });
}

// ====== UTILITY FUNCTIONS ======
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
    
    // Auto-remove after 5 seconds
    const timeout = setTimeout(() => {
        toast.remove();
    }, 5000);
    
    AppState.timeouts.add(timeout);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
        clearTimeout(timeout);
    });
}

// ====== PROJECT DATA ======
function getProjectsData() {
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

// ====== CLEANUP ON PAGE UNLOAD ======
window.addEventListener('beforeunload', () => {
    // Clean up all observers
    AppState.observers.forEach(observer => {
        if (observer && typeof observer.disconnect === 'function') {
            observer.disconnect();
        }
    });
    
    // Clear all timeouts
    AppState.timeouts.forEach(timeout => clearTimeout(timeout));
    
    // Remove all event listeners
    AppState.events.forEach((cleanup, name) => {
        if (typeof cleanup === 'function') {
            cleanup();
        }
    });
});

// ====== CONSOLE WELCOME MESSAGE ======
console.log(`
╔══════════════════════════════════════════════╗
║      MAJESTOR KEPSEU PORTFOLIO v3.2         ║
║      Reliability Focused - All Fixes        ║
║      © ${new Date().getFullYear()} - All Rights Reserved     ║
╚══════════════════════════════════════════════╝

✅ FIXED: Hero name visibility (rock-solid)
✅ FIXED: Navbar hover/active states (clean & distinct)
✅ FIXED: Logo positioning (better spacing)
✅ FIXED: Mobile project highlighting (optimized)
✅ NEW: Back button system (floating + static)
✅ FIXED: Gradient fallback detection
✅ BROWSERS: Full compatibility
✅ MOBILE: Enhanced experience
`);