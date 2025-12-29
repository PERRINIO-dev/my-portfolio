// ====== MAIN INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function () {
    console.log('Portfolio initialized');

    // 1. Initialize Smooth Scrolling
    initSmoothScroll();

    // 2. Initialize Mobile Navigation
    initMobileNav();

    // 3. Initialize Skills Accordion
    initSkillsAccordion();

    // 4. Initialize Projects Section
    initProjects();

    // 5. Initialize Contact Form
    initContactForm();

    // 6. Update Copyright Year
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

    // Safety check: elements might not exist if nav HTML wasn't updated
    if (!hamburger || !navLinks) {
        console.warn('Mobile navigation elements not found. Did you update the HTML?');
        return;
    }

    const navItems = document.querySelectorAll('.nav-link');

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        console.log('Hamburger clicked');
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

        header.addEventListener('click', () => {
            const isAlreadyActive = item.classList.contains('active');

            // Close all accordion items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.accordion-content');
                if (otherContent) otherContent.style.maxHeight = null;
            });

            // If it wasn't active, open the clicked one
            if (!isAlreadyActive) {
                item.classList.add('active');
                const content = item.querySelector('.accordion-content');
                if (content) content.style.maxHeight = content.scrollHeight + 'px';
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

    // Check if elements exist
    if (!projectsGrid || !projectDetail || !backButton || !detailContent) {
        console.warn('Projects section elements not found.');
        return;
    }

    // Project data (same as your original)
    const projectsData = {
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

    // Function to render project detail
    function renderProjectDetail(projectId) {
        const project = projectsData[projectId];
        if (!project) return;

        let html = `
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
        `;

        project.images.forEach((imgName, index) => {
            html += `
                <div class="image-item">
                    <div class="image-wrapper">
                        <img src="assets/images/${imgName}" alt="Project Image ${index + 1}" class="project-image">
                        <div class="image-caption">${imgName.replace(/\.[^/.]+$/, "").replace(/-/g, " ")}</div>
                    </div>
                </div>`;
        });

        html += `</div>
                <p class="image-note"><small>To add your screenshots, save them in the <code>/assets/images/</code> folder with the filenames listed in the project data.</small></p>
            </section>`;

        detailContent.innerHTML = html;
        projectsGrid.style.display = 'none';
        projectDetail.style.display = 'block';
        projectDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Click event for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // Click/tap support
        card.addEventListener('click', function () {
            const projectId = this.getAttribute('data-project-id');
            renderProjectDetail(projectId);
        });

        // Keyboard support (Enter/Space)
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent space from scrolling
                const projectId = this.getAttribute('data-project-id');
                renderProjectDetail(projectId);
            }
        });
    });

    // Click event for back button
    backButton.addEventListener('click', function () {
        projectDetail.style.display = 'none';
        projectsGrid.style.display = 'grid';
        projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ====== 5. CONTACT FORM ======
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    if (!form) {
        console.warn('Contact form not found.');
        return;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (!status) return;

        status.textContent = 'Sending...';
        status.style.color = '#0984e3';

        const formData = new FormData(event.target);

        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                status.textContent = 'Thanks for your message! I’ll get back to you soon.';
                status.style.color = '#00b894';
                form.reset();
            } else {
                const errorData = await response.json();
                status.textContent = errorData.error || 'Oops! There was a problem sending your message.';
                status.style.color = '#d63031';
            }
        } catch (error) {
            status.textContent = 'Oops! There was a network error. Please try again.';
            status.style.color = '#d63031';
            console.error('Form submission error:', error);
        }
    }

    form.addEventListener('submit', handleSubmit);
}
