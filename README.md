# Majestor Kepseu - Portfolio

A premium, responsive portfolio website showcasing enterprise infrastructure and network engineering projects. Built with modern web technologies and a focus on elegant design, accessibility, and performance.

![Portfolio Preview](assets/preview.png)

---

## Live Demo

[View Portfolio](#) https://perrinio-dev.github.io/my-portfolio/index.html

---

## Features

### Design
- **Premium Dark/Light Theme** - Sophisticated dual-theme system with OS auto-detection and manual toggle
- **Atmospheric Backgrounds** - Subtle gradient orbs with depth and noise overlay
- **Distinctive Typography** - Sora (display) + DM Sans (body) font pairing
- **Minimal Animations** - Refined interactions without overwhelming effects
- **Fully Responsive** - Optimized for desktop, tablet, and mobile devices

### Content
- **Hero Section** - Professional introduction with stats, portrait, and call-to-action
- **About** - Background story with career motivation cards
- **Experience** - CAMTEL internship with achievement metrics
- **Projects** - 4 comprehensive enterprise projects with detailed case study pages
- **Skills** - Organized by domain (Identity, Virtualization, Networking, Security, etc.)
- **Education** - Vertical timeline showing academic progression
- **Certifications** - Roadmap with status indicators (In Progress, Planned, Later)
- **Contact** - Form with Formspree integration + direct contact info

### Technical
- **Semantic HTML5** - Accessible, SEO-friendly markup
- **CSS Custom Properties** - Centralized design tokens for easy theming
- **Vanilla JavaScript** - No framework dependencies, fast load times
- **Theme Persistence** - User preference saved to localStorage
- **Smooth Scrolling** - Native scroll behavior with offset compensation
- **Intersection Observer** - Performant scroll-triggered animations
- **Image Lightbox** - Click-to-expand gallery with keyboard navigation

---

## Project Structure

```
portfolio/
├── index.html              # Main portfolio page
├── style.css               # Main stylesheet (design system + components)
├── script.js               # Theme toggle, navigation, animations
├── project-styles.css      # Shared styles for project detail pages
├── README.md               # This file
│
├── assets/
│   ├── profile.jpg         # Professional headshot
│   ├── favicon.svg         # Site favicon
│   ├── Majestor_Kepseu_Resume.pdf  # Downloadable resume
│   └── projects/           # Project screenshots and diagrams
│       ├── capstone/
│       ├── vsphere/
│       ├── exchange/
│       └── network/
│
└── projects/
    ├── capstone-platform.html       # Unified Collaboration Platform
    ├── virtualization-cluster.html  # VMware vSphere Infrastructure
    ├── exchange-server-dag.html     # Exchange Server 2019 with DAG
    └── multi-site-network.html      # Multi-Site Enterprise Network
```

---

## Setup & Deployment

### Prerequisites
- A web browser (Chrome, Firefox, Safari, Edge)
- A web server or hosting platform (GitHub Pages, Netlify, Vercel, etc.)

### Local Development

1. **Clone or download** the repository
   ```bash
   git clone https://github.com/PERRINIO-dev/my-portfolio
   cd my-portfolio
   ```

2. **Add your assets**
   - Place your professional photo as `assets/profile.jpg`
   - Add your resume as `assets/Majestor_Kepseu_Resume.pdf`
   - Add project screenshots to `assets/projects/`

3. **Serve locally** (choose one method)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Using VS Code
   # Install "Live Server" extension and click "Go Live"
   ```

4. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deployment

#### GitHub Pages
1. Push code to a GitHub repository
2. Go to Settings > Pages
3. Select branch (main) and folder (root)
4. Your site will be live at `https://username.github.io/repository`

#### Netlify
1. Connect your GitHub repository
2. Build command: *(leave empty)*
3. Publish directory: `.` or `/`
4. Deploy!

#### Custom Domain
Add a `CNAME` file with your domain name, then configure DNS settings with your registrar.

---

## Customization

### Colors
Edit CSS variables in `style.css` under `:root`:

```css
:root {
    /* Dark Theme (default) */
    --bg-deep: #08090c;
    --bg-primary: #0c0d12;
    --accent: #22d3d3;
    --accent-dim: #1ab3b3;
    /* ... */
}

[data-theme="light"] {
    /* Light Theme */
    --bg-deep: #f8f9fb;
    --bg-primary: #ffffff;
    --accent: #0d9488;
    /* ... */
}
```

### Typography
Change fonts in `style.css`:

```css
:root {
    --font-display: 'Sora', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
}
```

Update the Google Fonts link in `<head>` to match.

### Content
- **Personal Info** - Edit `index.html` directly
- **Projects** - Modify files in `/projects/` folder
- **Contact Form** - Replace Formspree endpoint in `index.html`

---

## Adding Project Images

### Architecture Diagrams
Images are placed in the architecture section:

```html
<div class="architecture-image" data-lightbox="architecture" data-caption="Your Caption">
    <img src="../assets/projects/vsphere/architecture.png" alt="Architecture Diagram">
</div>
```

### Gallery Images
```html
<div class="gallery-item" data-lightbox="gallery" data-caption="Screenshot Description">
    <img src="../assets/projects/vsphere/screenshot.png" alt="Screenshot">
    <span class="gallery-caption">Label</span>
</div>
```

### Recommended Image Sizes
| Type | Dimensions | Format |
|------|------------|--------|
| Profile Photo | 400x400px | JPG/WebP |
| Architecture Diagram | 1200x800px | PNG |
| Gallery Screenshots | Keep native resolution | PNG/WebP |
| Preview/OG Image | 1200x630px | PNG |

---

## Contact Form Setup

The contact form uses [Formspree](https://formspree.io/) for backend processing.

1. Create a free account at formspree.io
2. Create a new form and copy the endpoint
3. Update the form action in `index.html`:

```html
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

---

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

---

## Featured Projects

### 1. Unified Collaboration & Management Platform
**Type:** Enterprise IT Integration | **Team:** 5 members

Capstone project delivering AD-integrated platform with Zimbra, Zabbix, Zammad, Headwind MDM, Docker gateway, and enterprise PKI.

### 2. VMware vSphere Enterprise Infrastructure
**Type:** Virtualization | **Individual Project**

Production-grade virtualized datacenter with nested ESXi hosts, vCenter, DRS automation, HA failover, and Fault Tolerance.

### 3. Exchange Server 2019 with DAG
**Type:** Messaging & Collaboration | **Individual Project**

Highly available enterprise messaging with Database Availability Group, automated failover, and full AD integration.

### 4. Multi-Site Enterprise Network
**Type:** Core Networking & Security | **Team:** 4 members

Secure network connecting Toronto, Vancouver, and Tokyo with EIGRP routing, VLANs, ACLs, and centralized management.

---

## License

This portfolio is personal work. Feel free to use it as inspiration, but please don't copy content directly.

---

## Author

**Majestor Perrincio Kaptue Kepseu**

- Network & Infrastructure Engineer
- Cloud Security Engineer
- M.Eng Network Security | Post-Graduate Certificate, Applied Network Infrastructure

Location: Kitchener, Ontario, Canada

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/majestor-kepseu)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/PERRINIO-dev)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:majestorkepseu@gmail.com)

---

<p align="center">
  <sub>Built with precision and passion. © 2025 Majestor Kepseu</sub>
</p>
