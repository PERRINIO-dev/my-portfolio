// ====== MAIN INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio initialized');

    // Initialize all components
    initSmoothScroll();
    initMobileNav();
    initSkillsAccordion();
    initProjects();
    initContactForm();

    // Update copyright year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
});

// ====== 1. SMOOTH SCROLLING ======
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ====== 2. MOBILE NAVIGATION ======
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) {
        console.warn('Mobile navigation elements not found.');
        return;
    }

    const navItems = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a nav link is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinks.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// ====== 3. TECHNICAL SKILLS ACCORDION ======
function initSkillsAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (accordionItems.length === 0) return;

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');

        if (!header || !content) return;

        header.addEventListener('click', () => {
            const isAlreadyActive = item.classList.contains('active');

            // Close all accordion items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherHeader = otherItem.querySelector('.accordion-header');
                const otherContent = otherItem.querySelector('.accordion-content');

                if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
                if (otherContent) otherContent.style.maxHeight = null;
            });

            // If it wasn't active, open the clicked one
            if (!isAlreadyActive) {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });

        // Keyboard support for accordion headers
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

// ====== 4. PROJECTS SECTION ======
function initProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projectDetail = document.getElementById('project-detail');
    const backButton = document.getElementById('back-to-projects');
    const detailContent = document.getElementById('detail-content');

    if (!projectsGrid || !projectDetail || !backButton || !detailContent) {
        console.warn('Projects section elements not found.');
        return;
    }

    // Store the last clicked project card for focus management
    let lastClickedCard = null;
    let isStickyActive = false;

    // Project data - externalized for cleaner structure
    const projectsData = getProjectsData();

    // Function to render project detail
    function renderProjectDetail(projectId, clickedCard) {
        const project = projectsData[projectId];
        if (!project) return;

        // Store reference to the clicked card
        lastClickedCard = clickedCard;

        // Generate HTML for project detail
        detailContent.innerHTML = generateProjectDetailHTML(project);

        // Show detail view and hide grid
        projectsGrid.style.display = 'none';
        projectDetail.style.display = 'block';

        // Reset sticky state
        isStickyActive = false;
        backButton.classList.remove('sticky-active');

        // Scroll to the detail view
        projectDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Initialize sticky behavior after content loads
        setTimeout(initStickyBackButton, 100);
    }

    // Function to initialize sticky back button behavior
    function initStickyBackButton() {
        const backButtonContainer = document.querySelector('.back-button-container');
        if (!backButtonContainer) return;

        // Get the position where button should become sticky
        const stickyStart = 100; // pixels from top

        function updateStickyState() {
            if (!projectDetail.style.display || projectDetail.style.display === 'none') {
                return; // Don't run if detail view isn't visible
            }

            const scrollPosition = window.scrollY;
            const detailTop = projectDetail.offsetTop;
            const detailHeight = projectDetail.offsetHeight;
            const viewportHeight = window.innerHeight;
            const contentBottom = detailTop + detailHeight;

            // Calculate if we're at the bottom of content
            const isAtBottom = (scrollPosition + viewportHeight) >= (contentBottom - 50);

            // On desktop: sticky at top, on mobile: sticky at bottom when scrolling up
            if (window.innerWidth >= 769) {
                // Desktop behavior
                if (scrollPosition > detailTop + stickyStart && !isAtBottom) {
                    if (!isStickyActive) {
                        isStickyActive = true;
                        backButton.classList.add('sticky-active');
                    }
                } else {
                    if (isStickyActive) {
                        isStickyActive = false;
                        backButton.classList.remove('sticky-active');
                    }
                }
            } else {
                // Mobile behavior - always show sticky at bottom unless at very top
                if (scrollPosition > detailTop + 50) {
                    if (!isStickyActive) {
                        isStickyActive = true;
                        backButton.classList.add('sticky-active');
                    }
                } else {
                    if (isStickyActive) {
                        isStickyActive = false;
                        backButton.classList.remove('sticky-active');
                    }
                }
            }

            // Special handling for bottom of content
            if (isAtBottom && isStickyActive) {
                backButton.classList.remove('sticky-active');
                isStickyActive = false;
            }
        }

        // Initial check
        updateStickyState();

        // Update on scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(updateStickyState);
        });

        // Update on resize
        window.addEventListener('resize', updateStickyState);
    }

    // Function to return to projects grid
    function returnToProjects() {
        projectDetail.style.display = 'none';
        projectsGrid.style.display = 'grid';

        // Remove sticky class
        backButton.classList.remove('sticky-active');
        isStickyActive = false;

        // Remove scroll listeners
        window.removeEventListener('scroll', initStickyBackButton);
        window.removeEventListener('resize', initStickyBackButton);

        // Return focus to the previously clicked card
        if (lastClickedCard) {
            setTimeout(() => {
                lastClickedCard.focus();
                lastClickedCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 100);
        } else {
            projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Event listeners for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function () {
            const projectId = this.getAttribute('data-project-id');
            renderProjectDetail(projectId, this);
        });

        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const projectId = this.getAttribute('data-project-id');
                renderProjectDetail(projectId, this);
            }
        });
    });

    // Event listeners for back button
    backButton.addEventListener('click', returnToProjects);
    backButton.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            returnToProjects();
        }
    });

    // Helper function to generate project detail HTML
    function generateProjectDetailHTML(project) {
        const imagePlaceholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIyMDAiIHZpZXdCb3g9IjAgMCA0MDAgMjAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iMjAwIiB5PSIxMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzYzNmU3MiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlByb2plY3QgRGlhZ3JhbTwvdGV4dD48L3N2Zz4=';

        const imagesHTML = project.images.map((imgName, index) => `
            <div class="image-item">
                <div class="image-wrapper">
                    <img src="assets/images/${imgName}" 
                         alt="Project Image ${index + 1}: ${imgName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}" 
                         class="project-image"
                         onerror="this.onerror=null; this.src='${imagePlaceholderSVG}'; this.alt='Image not available';">
                    <div class="image-caption">${imgName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}</div>
                </div>
            </div>
        `).join('');

        return `
            <header class="detail-header">
                <h2 class="detail-title">${project.title}</h2>
            </header>
            <section class="detail-section">
                <h3 class="detail-subtitle">🔹 Project Overview</h3>
                <p>${project.overview}</p>
            </section>
            <section class="detail-section">
                <h3 class="detail-subtitle">🔹 Architecture & Implementation</h3>
                <ul class="detail-list">
                    ${project.architecture.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </section>
            <section class="detail-section">
                <h3 class="detail-subtitle">🔹 Results & Validation</h3>
                <ul class="detail-list">
                    ${project.results.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </section>
            <section class="detail-section">
                <h3 class="detail-subtitle">🔹 Skills & Technologies Used</h3>
                <div class="skills-container">
                    ${project.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
            </section>
            <section class="detail-section">
                <h3 class="detail-subtitle">🔹 Project Images</h3>
                <p><em>Visual documentation of the project's implementation and outcomes.</em></p>
                <div class="images-container">
                    ${imagesHTML}
                </div>
                <p class="image-note"><small>To add your screenshots, save them in the <code>/assets/images/</code> folder with the filenames listed in the project data.</small></p>
            </section>
        `;
    }
}

// ====== 5. CONTACT FORM ======
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form || !status) {
        console.warn('Contact form elements not found.');
        return;
    }

    // Add ARIA attributes for accessibility
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');

    // Basic form validation
    function validateForm(formData) {
        const name = formData.get('name')?.trim() || '';
        const email = formData.get('email')?.trim() || '';
        const message = formData.get('message')?.trim() || '';

        if (!name) return 'Please enter your name.';
        if (!email) return 'Please enter your email address.';
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return 'Please enter a valid email address.';
        if (!message) return 'Please enter your message.';
        if (message.length < 10) return 'Please enter a message with at least 10 characters.';

        return null; // No errors
    }

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Validate form
        const validationError = validateForm(formData);
        if (validationError) {
            showErrorStatus(validationError);
            focusFirstErrorField(formData);
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        showLoadingStatus(submitButton);

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showSuccessStatus();
                form.reset();
                setTimeout(() => document.getElementById('name').focus(), 100);
            } else {
                const errorData = await response.json();
                showErrorStatus(errorData.error || '❌ Oops! There was a problem sending your message. Please try again.');
            }
        } catch (error) {
            showErrorStatus('❌ Network error. Please check your connection and try again.');
            console.error('Form submission error:', error);
        } finally {
            resetSubmitButton(submitButton, originalButtonText);
        }
    }

    // Helper functions
    function showErrorStatus(message) {
        status.textContent = message;
        status.style.color = '#d63031';
        status.style.backgroundColor = '#ffeaea';
        status.style.padding = '1rem';
        status.style.borderRadius = '8px';
        status.style.border = '1px solid #ffcccc';

        // Auto-clear after 10 seconds
        setTimeout(() => {
            if (status.style.color === '#d63031') {
                clearStatus();
            }
        }, 10000);
    }

    function showSuccessStatus() {
        status.textContent = '✅ Thank you! Your message has been sent. I\'ll get back to you soon.';
        status.style.color = '#00b894';
        status.style.backgroundColor = '#e8f7f3';
        status.style.padding = '1rem';
        status.style.borderRadius = '8px';
        status.style.border = '1px solid #b2ebd2';
    }

    function showLoadingStatus(submitButton) {
        status.textContent = 'Sending your message...';
        status.style.color = '#0984e3';
        clearStatusStyles();

        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        submitButton.style.cursor = 'not-allowed';
    }

    function resetSubmitButton(submitButton, originalText) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    }

    function focusFirstErrorField(formData) {
        if (!formData.get('name')?.trim()) {
            document.getElementById('name').focus();
        } else if (!formData.get('email')?.trim() || !formData.get('email')?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            document.getElementById('email').focus();
        } else {
            document.getElementById('message').focus();
        }
    }

    function clearStatus() {
        status.textContent = '';
        clearStatusStyles();
    }

    function clearStatusStyles() {
        status.style.backgroundColor = '';
        status.style.padding = '';
        status.style.borderRadius = '';
        status.style.border = '';
    }

    // Event listeners
    form.addEventListener('submit', handleSubmit);

    // Real-time email validation
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function () {
            const email = this.value.trim();
            if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                this.style.borderColor = '#d63031';
                this.style.boxShadow = '0 0 0 2px rgba(214, 48, 49, 0.2)';
            } else {
                this.style.borderColor = '';
                this.style.boxShadow = '';
            }
        });
    }

    // Clear status when user starts typing
    const formFields = form.querySelectorAll('input, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', () => {
            if (status.textContent && status.style.color === '#d63031') {
                clearStatus();
            }
        });
    });
}

// ====== PROJECT DATA (Externalized for cleaner main function) ======
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