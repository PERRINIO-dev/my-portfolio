// ====== PORTFOLIO REFACTOR v4.0 - ENTERPRISE ARCHITECTURE ======
// Complete overhaul with state management, templates, and mobile optimization

// ====== CONFIGURATION ======
const CONFIG = {
    navScrolledThreshold: 30,
    revealThreshold: 0.1,
    revealRootMargin: '0px 0px -100px 0px',
    projectImagesPath: 'assets/images/',
    profileImagePath: 'assets/profile.jpg',
    formEndpoint: 'https://formspree.io/f/mbdrzrbq'
};

// ====== GLOBAL STATE ======
const AppState = {
    isNavScrolled: false,
    isMobileMenuOpen: false,
    isMobileView: window.innerWidth <= 768,
    controllers: {}
};

// ====== PROJECT STATE MANAGEMENT ======
const ProjectState = {
    current: null,
    isDetailView: false,
    history: [],
    lastClickedCard: null,
    scrollPosition: 0,
    observers: new Set(),
    
    init() {
        this.current = null;
        this.isDetailView = false;
        this.history = [];
        this.lastClickedCard = null;
        this.scrollPosition = 0;
    },
    
    setCurrent(project, clickedCard) {
        // Save current state before change
        this.history.push({
            project: this.current,
            card: this.lastClickedCard,
            scrollPosition: window.pageYOffset,
            isDetailView: this.isDetailView
        });
        
        // Update state
        this.current = project;
        this.lastClickedCard = clickedCard;
        this.scrollPosition = window.pageYOffset;
        this.isDetailView = true;
        
        this.notify('project-changed');
    },
    
    goBack() {
        if (this.history.length === 0) {
            this.current = null;
            this.isDetailView = false;
            this.lastClickedCard = null;
        } else {
            const prevState = this.history.pop();
            this.current = prevState.project;
            this.lastClickedCard = prevState.card;
            this.scrollPosition = prevState.scrollPosition;
            this.isDetailView = prevState.isDetailView;
        }
        
        this.notify('project-changed');
        this.notify('project-back');
    },
    
    subscribe(callback) {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    },
    
    notify(event) {
        this.observers.forEach(callback => callback(event, this));
    }
};

// ====== PROJECT TEMPLATES ======
const ProjectTemplates = {
    card: (project, id) => {
        const iconMap = {
            '1': 'fas fa-server',
            '2': 'fas fa-envelope',
            '3': 'fas fa-network-wired',
            '4': 'fas fa-shield-alt'
        };
        
        const categoryMap = {
            '1': 'Virtualization',
            '2': 'Messaging',
            '3': 'Network Design',
            '4': 'Security'
        };
        
        return `
            <button class="project-card reveal" data-project-id="${id}"
                    aria-label="View details for ${project.title}">
                <div class="project-card-header">
                    <div class="project-card-icon">
                        <i class="${iconMap[id] || 'fas fa-project-diagram'}"></i>
                    </div>
                    <div class="project-card-badge">${categoryMap[id] || 'Project'}</div>
                </div>
                <div class="project-card-img">
                    <div class="img-placeholder">${project.title.split(' ').slice(0, 3).join(' ')} Diagram</div>
                </div>
                <div class="project-card-content">
                    <h3 class="project-card-title">${project.title}</h3>
                    <p class="project-card-desc">${project.overview.substring(0, 120)}...</p>
                    <div class="project-card-tags">
                        ${project.skills.slice(0, 3).map(skill => `<span class="project-tag">${skill.split(' ')[0]}</span>`).join('')}
                    </div>
                    <div class="project-card-hint">
                        <span>View details</span>
                        <i class="fas fa-arrow-right"></i>
                    </div>
                </div>
            </button>
        `;
    },
    
    detail: (project) => {
        return `
            <header class="project-detail-header">
                <div class="container project-header-container">
                    <h2 class="project-detail-title">${project.title}</h2>
                    <div class="project-header-actions">
                        <button class="btn-print" id="print-button" aria-label="Print project details">
                            <i class="fas fa-print"></i>
                            <span class="print-text">Print</span>
                        </button>
                    </div>
                </div>
            </header>
            
            <nav class="detail-nav" aria-label="Project detail navigation">
                <ul>
                    <li><a href="#overview" class="detail-nav-link active">Overview</a></li>
                    <li><a href="#architecture" class="detail-nav-link">Architecture</a></li>
                    <li><a href="#results" class="detail-nav-link">Results</a></li>
                    <li><a href="#skills" class="detail-nav-link">Technologies</a></li>
                    ${project.images && project.images.length > 0 ? '<li><a href="#images" class="detail-nav-link">Images</a></li>' : ''}
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
                
                ${project.images && project.images.length > 0 ? `
                <section id="images" class="detail-section">
                    <h3 class="detail-subtitle">🔹 Project Images</h3>
                    <p><em>Visual documentation of the project's implementation and outcomes.</em></p>
                    <div class="images-container">
                        ${project.images.map((imgName, index) => `
                        <div class="image-item">
                            <div class="image-wrapper">
                                <img src="${CONFIG.projectImagesPath}${imgName}" 
                                     alt="Project Image ${index + 1}: ${imgName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}" 
                                     class="project-image"
                                     loading="lazy"
                                     decoding="async">
                                <div class="image-caption">${imgName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}</div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}
            </main>
            
            <footer class="project-detail-footer">
                <div class="container project-footer-container">
                    <button class="btn-back-footer" id="footer-back-button" aria-label="Back to all projects">
                        <i class="fas fa-arrow-left"></i>
                        <span>Back to Projects</span>
                    </button>
                </div>
            </footer>
        `;
    }
};

// ====== IMAGE LOADER ======
class ImageLoader {
    constructor() {
        this.cache = new Map();
        this.pendingLoads = new Map();
    }
    
    async loadProjectImages(imageNames) {
        const loadPromises = imageNames.map(imgName => 
            this.loadImage(`${CONFIG.projectImagesPath}${imgName}`)
        );
        
        return Promise.allSettled(loadPromises);
    }
    
    async loadImage(src) {
        // Check cache first
        if (this.cache.has(src)) {
            return this.cache.get(src);
        }
        
        // Check if already loading
        if (this.pendingLoads.has(src)) {
            return this.pendingLoads.get(src);
        }
        
        // Create load promise
        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                this.cache.set(src, img);
                this.pendingLoads.delete(src);
                resolve(img);
            };
            
            img.onerror = () => {
                this.pendingLoads.delete(src);
                console.warn(`Failed to load image: ${src}`);
                
                // Create fallback element
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.textContent = 'Image not available';
                fallback.style.background = 'var(--bg-secondary)';
                fallback.style.color = 'var(--text-tertiary)';
                fallback.style.display = 'flex';
                fallback.style.alignItems = 'center';
                fallback.style.justifyContent = 'center';
                fallback.style.fontSize = '0.9rem';
                fallback.style.height = '200px';
                
                this.cache.set(src, fallback);
                resolve(fallback);
            };
            
            img.src = src;
        });
        
        this.pendingLoads.set(src, loadPromise);
        return loadPromise;
    }
}

// ====== TOUCH GESTURE SUPPORT ======
class TouchGesture {
    constructor(element, callback) {
        this.element = element;
        this.callback = callback;
        this.startX = 0;
        this.startY = 0;
        this.threshold = 50;
        this.enabled = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        this.init();
    }
    
    init() {
        if (!this.enabled) return;
        
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }
    
    handleTouchMove(e) {
        if (!this.startX || !this.startY) return;
        
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        
        const diffX = currentX - this.startX;
        const diffY = currentY - this.startY;
        
        // Check if it's primarily horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            e.preventDefault(); // Prevent vertical scroll during horizontal swipe
        }
    }
    
    handleTouchEnd(e) {
        if (!this.startX || !this.startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = endX - this.startX;
        const diffY = endY - this.startY;
        
        // Check for left swipe (close gesture)
        if (diffX < -this.threshold && Math.abs(diffY) < this.threshold) {
            this.callback('swipe-left');
        }
        
        this.startX = 0;
        this.startY = 0;
    }
    
    destroy() {
        if (!this.enabled) return;
        
        this.element.removeEventListener('touchstart', this.handleTouchStart);
        this.element.removeEventListener('touchmove', this.handleTouchMove);
        this.element.removeEventListener('touchend', this.handleTouchEnd);
    }
}

// ====== PROJECT CONTROLLER ======
class ProjectController {
    constructor() {
        this.grid = null;
        this.detail = null;
        this.detailContent = null;
        this.projectsData = null;
        this.imageLoader = null;
        this.sectionObserver = null;
        this.touchGesture = null;
        this.unsubscribe = null;
        this.initialized = false;
    }
    
    async init() {
        // Wait for DOM to be ready
        await this.waitForDOM();
        
        // Get DOM elements
        this.grid = document.getElementById('projects-grid');
        this.detail = document.getElementById('project-detail');
        this.detailContent = document.getElementById('detail-content');
        
        if (!this.grid || !this.detail || !this.detailContent) {
            console.error('Project section elements not found');
            return;
        }
        
        // Load project data
        this.projectsData = this.getProjectsData();
        
        // Initialize utilities
        this.imageLoader = new ImageLoader();
        
        // Initialize state
        ProjectState.init();
        
        // Subscribe to state changes
        this.unsubscribe = ProjectState.subscribe(this.handleStateChange.bind(this));
        
        // Render initial grid
        this.renderProjectGrid();
        
        // Setup event delegation
        this.setupEventDelegation();
        
        // Handle browser back/forward
        window.addEventListener('popstate', this.handlePopState.bind(this));
        
        this.initialized = true;
        console.log('✅ ProjectController initialized');
    }
    
    waitForDOM() {
        return new Promise(resolve => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }
    
    getProjectsData() {
        return {
            1: {
                title: "Enterprise Virtualization Cluster with VMware vSphere, HA & Fault Tolerance",
                overview: "The objective of this project was to design, deploy, and validate a highly available enterprise virtualization infrastructure using VMware vSphere. The environment was built to ensure service continuity, centralized management, and infrastructure resilience through the implementation of High Availability (HA) and Fault Tolerance (FT).",
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
                overview: "The objective of this project was to design, deploy, and validate a highly available enterprise email infrastructure using Microsoft Exchange Server 2019. The environment was built to support secure messaging, centralized administration, and high availability through the implementation of a Database Availability Group (DAG).",
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
                overview: "The objective of this capstone project was to design and model a scalable, multi-region enterprise network supporting geographically distributed offices. The environment simulated corporate sites in North America and Asia, focusing on hardware selection, IP addressing strategy, site connectivity, and infrastructure scalability.",
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
                overview: "The objective of this project was to design, deploy, and secure a multi-site enterprise network interconnecting geographically distributed offices. The environment simulated corporate sites located in Toronto, Vancouver, and Tokyo, with a focus on secure inter-site connectivity, network segmentation, centralized services, and controlled administrative access.",
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
    
    renderProjectGrid() {
        const projectsHTML = Object.entries(this.projectsData).map(([id, project]) => {
            return ProjectTemplates.card(project, id);
        }).join('');
        
        this.grid.innerHTML = projectsHTML;
        this.grid.setAttribute('aria-hidden', 'false');
        
        // Initialize reveal animations for new cards
        this.initRevealAnimations();
    }
    
    initRevealAnimations() {
        const revealElements = this.grid.querySelectorAll('.reveal');
        
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
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );
        
        revealElements.forEach((element, index) => {
            element.style.transitionDelay = `${Math.min(index * 50, 300)}ms`;
            revealObserver.observe(element);
        });
    }
    
    setupEventDelegation() {
        // Single event listener for all project cards
        this.grid.addEventListener('click', (e) => {
            const card = e.target.closest('.project-card');
            if (card) {
                e.preventDefault();
                const projectId = card.getAttribute('data-project-id');
                this.openProject(projectId, card);
            }
        });
        
        this.grid.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const card = e.target.closest('.project-card');
                if (card) {
                    e.preventDefault();
                    const projectId = card.getAttribute('data-project-id');
                    this.openProject(projectId, card);
                }
            }
        });
    }
    
    async openProject(projectId, clickedCard) {
        const project = this.projectsData[projectId];
        if (!project) return;
        
        // Update state
        ProjectState.setCurrent(project, clickedCard);
    }
    
    async showDetailView(project) {
        // Store current scroll position
        const scrollPosition = window.pageYOffset;
        
        // FIXED: No scroll jump - switch views at current position
        this.grid.style.display = 'none';
        this.grid.setAttribute('aria-hidden', 'true');
        this.detail.style.display = 'block';
        this.detail.setAttribute('aria-hidden', 'false');
        
        // Add mobile class for slide-in animation
        if (window.innerWidth <= 768) {
            this.detail.classList.add('active');
        }
        
        // Render detail content
        this.detailContent.innerHTML = ProjectTemplates.detail(project);
        
        // Initialize touch gesture for mobile
        if (window.innerWidth <= 768) {
            this.touchGesture = new TouchGesture(this.detail, (gesture) => {
                if (gesture === 'swipe-left') {
                    this.closeProject();
                }
            });
        }
        
        // Setup detail interactions
        this.setupDetailInteractions();
        
        // Initialize section observer
        this.initDetailSectionObserver();
        
        // Load images
        if (project.images && project.images.length > 0) {
            this.imageLoader.loadProjectImages(project.images).then(results => {
                results.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        const img = this.detailContent.querySelectorAll('.project-image')[index];
                        if (img && result.value instanceof HTMLImageElement) {
                            img.classList.add('loaded');
                        }
                    }
                });
            });
        }
        
        // Show footer back button
        setTimeout(() => {
            const footer = this.detailContent.querySelector('.project-detail-footer');
            if (footer) footer.classList.add('visible');
        }, 300);
        
        // Focus on title for accessibility
        setTimeout(() => {
            const title = this.detailContent.querySelector('.project-detail-title');
            if (title) {
                title.setAttribute('tabindex', '-1');
                title.focus();
            }
        }, 100);
        
        // Update URL without scrolling
        const projectId = Object.keys(this.projectsData).find(key => this.projectsData[key] === project);
        history.pushState({ projectId: projectId, type: 'project' }, '', `#project-${projectId}`);
        
        // Restore scroll position to prevent jump
        window.scrollTo(0, scrollPosition);
    }
    
    async closeProject() {
        // Hide detail, show grid
        this.detail.style.display = 'none';
        this.detail.setAttribute('aria-hidden', 'true');
        this.grid.style.display = 'grid';
        this.grid.setAttribute('aria-hidden', 'false');
        
        // Remove mobile class
        this.detail.classList.remove('active');
        
        // Clear detail content
        this.detailContent.innerHTML = '';
        
        // Cleanup touch gesture
        if (this.touchGesture) {
            this.touchGesture.destroy();
            this.touchGesture = null;
        }
        
        // Cleanup observer
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
            this.sectionObserver = null;
        }
        
        // Update URL
        history.pushState(null, '', '#projects');
        
        // Focus back on the clicked card
        await this.focusOnPreviousCard();
    }
    
    async focusOnPreviousCard() {
        const card = ProjectState.lastClickedCard;
        if (!card) return;
        
        // Smooth scroll to projects section
        const projectsSection = document.getElementById('projects');
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        
        await this.smoothScrollTo(projectsSection, navHeight, 600);
        
        // Highlight and focus the card
        card.classList.add('highlight');
        card.setAttribute('tabindex', '-1');
        card.focus();
        
        setTimeout(() => {
            card.classList.remove('highlight');
            card.removeAttribute('tabindex');
        }, 1500);
    }
    
    setupDetailInteractions() {
        // Back button
        const backButton = this.detailContent.querySelector('#footer-back-button');
        if (backButton) {
            backButton.addEventListener('click', () => this.closeProject());
            backButton.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.closeProject();
                }
            });
        }
        
        // Print button
        const printButton = this.detailContent.querySelector('#print-button');
        if (printButton) {
            printButton.addEventListener('click', () => window.print());
        }
        
        // Detail navigation
        const navLinks = this.detailContent.querySelectorAll('.detail-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = this.detailContent.querySelector(targetId);
                
                if (targetElement) {
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Smooth scroll to section
                    const navHeight = document.querySelector('.main-nav').offsetHeight;
                    const projectHeaderHeight = this.detailContent.querySelector('.project-detail-header').offsetHeight;
                    const detailNavHeight = this.detailContent.querySelector('.detail-nav').offsetHeight;
                    const offset = navHeight + projectHeaderHeight + detailNavHeight + 20;
                    
                    this.smoothScrollTo(targetElement, offset, 800);
                }
            });
        });
    }
    
    initDetailSectionObserver() {
        const sections = this.detailContent.querySelectorAll('.detail-section');
        const navLinks = this.detailContent.querySelectorAll('.detail-nav-link');
        
        if (!sections.length || !navLinks.length) return;
        
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
        
        this.sectionObserver = new IntersectionObserver(
            (entries) => {
                let mostVisible = null;
                let highestRatio = 0;
                
                entries.forEach(entry => {
                    if (entry.isIntersecting && entry.intersectionRatio > highestRatio) {
                        highestRatio = entry.intersectionRatio;
                        mostVisible = entry.target;
                    }
                });
                
                if (mostVisible && highestRatio > 0.3) {
                    const id = mostVisible.id;
                    const correspondingLink = this.detailContent.querySelector(`.detail-nav-link[href="#${id}"]`);
                    
                    if (correspondingLink) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        correspondingLink.classList.add('active');
                    }
                }
            },
            {
                root: null,
                threshold: [0.1, 0.3, 0.5],
                rootMargin: '-20% 0px -40% 0px'
            }
        );
        
        sections.forEach(section => this.sectionObserver.observe(section));
    }
    
    handleStateChange(event, state) {
        switch (event) {
            case 'project-changed':
                if (state.isDetailView && state.current) {
                    this.showDetailView(state.current);
                } else {
                    this.closeProject();
                }
                break;
                
            case 'project-back':
                // Handled by project-changed event
                break;
        }
    }
    
    handlePopState(event) {
        if (!ProjectState.isDetailView) return;
        
        // If we're in detail view and user hits back button, close project
        if (event.state === null || !event.state.type === 'project') {
            ProjectState.goBack();
        }
    }
    
    smoothScrollTo(element, offset = 0, duration = 600) {
        return new Promise((resolve) => {
            const startPosition = window.pageYOffset;
            const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
            const distance = targetPosition - startPosition;
            const startTime = performance.now();
            
            if (distance === 0) {
                resolve();
                return;
            }
            
            function scrollStep(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const ease = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (progress < 1) {
                    requestAnimationFrame(scrollStep);
                } else {
                    resolve();
                }
            }
            
            requestAnimationFrame(scrollStep);
        });
    }
    
    destroy() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
        
        if (this.touchGesture) {
            this.touchGesture.destroy();
        }
        
        if (this.sectionObserver) {
            this.sectionObserver.disconnect();
        }
        
        window.removeEventListener('popstate', this.handlePopState);
    }
}

// ====== PROJECT PRELOADER ======
class ProjectPreloader {
    constructor() {
        this.preloaded = new Set();
        this.intersectionObserver = null;
    }
    
    init() {
        // Setup intersection observer for viewport-based preloading
        this.setupIntersectionObserver();
    }
    
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const projectId = card.getAttribute('data-project-id');
                    if (projectId && !this.preloaded.has(projectId)) {
                        this.preloadProject(projectId);
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe all project cards
        setTimeout(() => {
            const cards = document.querySelectorAll('.project-card');
            cards.forEach(card => {
                this.intersectionObserver.observe(card);
            });
        }, 500);
    }
    
    async preloadProject(projectId) {
        if (this.preloaded.has(projectId)) return;
        
        this.preloaded.add(projectId);
        const controller = AppState.controllers.projectController;
        if (!controller) return;
        
        const project = controller.projectsData[projectId];
        if (!project || !project.images) return;
        
        // Preload images
        const preloadPromises = project.images.map(imgName => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = `${CONFIG.projectImagesPath}${imgName}`;
                img.onload = resolve;
                img.onerror = resolve; // Don't fail on preload errors
            });
        });
        
        await Promise.allSettled(preloadPromises);
    }
}

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
        if (ProjectState.isDetailView) return;
        
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
        
        if (!ProjectState.isDetailView) {
            updateActiveNavLink();
        }
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
    
    portraitImg.src = CONFIG.profileImagePath;
    
    portraitImg.onload = () => {
        portraitImg.style.opacity = '1';
    };
    
    portraitImg.onerror = () => {
        portraitImg.style.background = 'var(--accent)';
        portraitImg.style.opacity = '0.3';
    };
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
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Portfolio v4.0 - Enterprise Architecture');
    
    try {
        // Initialize core systems
        initializeNavigation();
        initializeSmoothScroll();
        initializeRevealAnimations();
        initializeContactForm();
        
        // Update dynamic content
        updateCopyrightYear();
        initializeHeroPortrait();
        
        // Initialize project system (with proper delay)
        setTimeout(async () => {
            const projectController = new ProjectController();
            await projectController.init();
            
            const projectPreloader = new ProjectPreloader();
            projectPreloader.init();
            
            // Store controllers for cleanup
            AppState.controllers = {
                projectController,
                projectPreloader
            };
            
            console.log('✅ All systems initialized successfully');
        }, 100);
        
        // Listen for viewport changes
        window.addEventListener('resize', debounce(() => {
            AppState.isMobileView = window.innerWidth <= 768;
        }, 250));
        
        // Add Escape key support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && ProjectState.isDetailView) {
                ProjectState.goBack();
            }
        });
        
    } catch (error) {
        console.error('❌ Initialization error:', error);
        showToast('Some features may not work correctly. Please refresh.', 'error');
    }
});

// ====== CONSOLE WELCOME MESSAGE ======
console.log(`
╔══════════════════════════════════════════════╗
║      MAJESTOR KEPSEU PORTFOLIO v4.0         ║
║      Enterprise Architecture Refactor        ║
║      © ${new Date().getFullYear()} - All Rights Reserved     ║
╚══════════════════════════════════════════════╝

✅ FIXED: Project cards now visible
✅ FIXED: DOM initialization race condition
✅ FIXED: Zero scroll jumping on project open
✅ ADDED: State management system
✅ ADDED: Template-based rendering
✅ ADDED: Touch gesture support (mobile)
✅ ADDED: Image preloading system
✅ ADDED: Unified event delegation
✅ FIXED: Mobile header collisions
✅ ADDED: Swipe-to-close on mobile
✅ ADDED: Proper focus management
✅ ADDED: Browser history integration

📱 Mobile-optimized project detail view
🎯 Professional architecture patterns
⚡ Performance optimized
🔧 Easy to maintain and extend
`);