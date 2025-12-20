// Update the copyright year automatically
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Simple smooth scroll for navigation links (optional)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ====== Projects Section Interactivity ======

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {

    // Get the main elements
    const projectsGrid = document.getElementById('projects-grid');
    const projectDetail = document.getElementById('project-detail');
    const backButton = document.getElementById('back-to-projects');
    const detailContent = document.getElementById('detail-content');

    // Function to SHOW the project detail view
    function showProjectDetail(projectId) {
        // In a real scenario, you would fetch data for this specific projectId
        // For now, we just show a placeholder message
        detailContent.innerHTML = `
            <h2>Project Details</h2>
            <p><strong>Project ID:</strong> ${projectId}</p>
            <p>This is where the full technical description for the selected project will appear.</p>
            <p>You will populate this area with:</p>
            <ul>
                <li><strong>Project Overview</strong></li>
                <li><strong>Architecture & Implementation</strong> (bulleted list)</li>
                <li><strong>Results & Validation</strong></li>
                <li><strong>Skills & Technologies Used</strong></li>
                <li>Embedded screenshots and documentation links.</li>
            </ul>
            <p>All content will follow the structure you specified.</p>
        `;

        // Switch views: hide grid, show detail
        projectsGrid.style.display = 'none';
        projectDetail.style.display = 'block';

        // Scroll the detail view into a comfortable view
        projectDetail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Function to HIDE the project detail view (go back to grid)
    function hideProjectDetail() {
        projectDetail.style.display = 'none';
        projectsGrid.style.display = 'grid';
        // Optionally scroll the grid back into view
        projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 1. Add click event to ALL project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', function () {
            const projectId = this.getAttribute('data-project-id');
            showProjectDetail(projectId);
        });
    });

    // 2. Add click event to the "Back to Projects" button
    backButton.addEventListener('click', hideProjectDetail);

});