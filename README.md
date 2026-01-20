# Portfolio - Majestor Kepseu

> A modern, professional portfolio showcasing cybersecurity and cloud infrastructure expertise.

![Portfolio Version](https://img.shields.io/badge/version-6.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-production-success)

## 🌐 Live Demo

**[View Portfolio](https://perrinio-dev.github.io/my-portfolio)**

---

## ✨ Features

- **Dual Theme System** - Auto/Light/Dark modes with seamless switching
- **Professional Project Pages** - Detailed case studies with image lightbox
- **Responsive Design** - Mobile-first approach with touch-optimized interactions
- **PWA Support** - Installable with offline capabilities
- **Performance Optimized** - Lighthouse score 95+
- **Accessible** - WCAG 2.1 AA compliant with keyboard navigation

---

## 🛠️ Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript (ES6+)
- CSS Grid & Flexbox
- CSS Custom Properties

**Libraries**
- Font Awesome 6 (Icons)
- Google Fonts (Poppins, Roboto Mono)
- Formspree (Contact form)

**Features**
- Service Worker (PWA)
- Intersection Observer (Animations)
- LocalStorage (Theme persistence)

---

## 📁 Project Structure

```
my-portfolio/
├── index.html                 # Main homepage
├── style.css                  # Core styles
├── light-theme.css            # Light theme styles
├── animations.css             # Animation utilities
├── theme-manager.js           # Theme switching logic
├── script.js                  # Main JavaScript
├── lightbox.js                # Image viewer
├── sw.js                      # Service worker
├── manifest.json              # PWA manifest
│
├── assets/
│   ├── profile.jpg            # Professional photo
│   ├── icon-192.png           # PWA icon
│   ├── icon-512.png           # PWA icon
│   └── images/                # Project screenshots
│
└── projects/
    ├── project-styles.css     # Shared project styles
    ├── virtualization-cluster.html
    ├── exchange-server-dag.html
    ├── multi-region-network.html
    └── secure-enterprise-network.html
```

---

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PERRINIO-dev/my-portfolio.git
   cd portfolio
   ```

2. **Run locally**
   
   Using Python:
   ```bash
   python -m http.server 8000
   ```
   
   Using Node.js:
   ```bash
   npx http-server
   ```
   
   Or simply open `index.html` in your browser.

3. **View the site**
   ```
   http://localhost:8000
   ```

---

## 🎨 Customization

### Personal Information

Edit `index.html` and update:
- Name and professional title (Hero section)
- Social media links
- Contact information
- About me content
- Work experience
- Skills and certifications

### Profile Photo

Replace `assets/profile.jpg` with your professional photo (recommended: 420x420px).

### Theme Colors

Modify CSS variables in `style.css`:
```css
:root {
    --accent: #20D3D3;           /* Primary accent color */
    --bg-primary: #070A0D;       /* Dark theme background */
    /* ... more variables ... */
}
```

### Adding Projects

1. Create new HTML file in `projects/` folder (copy existing as template)
2. Add project images to `assets/images/`
3. Add project card to `index.html` projects section
4. Update project details in the new HTML file

---

## 🌓 Theme System

The portfolio supports three theme modes:

- **Auto** - Follows system preference (default)
- **Light** - Manual light mode
- **Dark** - Manual dark mode

Click the theme toggle button (bottom-right) to cycle through modes.

Theme preference is saved in `localStorage` and persists across sessions.

---

## 🖼️ Image Lightbox

Gallery images are clickable and open in a full-screen lightbox viewer.

**Controls:**
- Click image to enlarge
- ESC to close
- ← → Arrow keys to navigate
- Click outside to close

---

## 📱 PWA Features

The portfolio is installable as a Progressive Web App:

**Desktop:**
1. Click the install icon in the browser address bar
2. Follow the prompts

**Mobile:**
1. Open menu (three dots)
2. Select "Add to Home Screen"
3. The portfolio will install as an app

---

## 🧪 Testing

Ensure the following work correctly:

**Theme System:**
- [ ] Auto mode follows system preference
- [ ] Manual modes override system
- [ ] Theme persists after refresh
- [ ] All elements properly themed

**Responsive Design:**
- [ ] Mobile navigation works
- [ ] Content readable on all screen sizes
- [ ] Touch targets 48px minimum
- [ ] Images load properly

**Lightbox:**
- [ ] Images enlarge on click
- [ ] Keyboard navigation works
- [ ] Mobile controls accessible

---

## 📊 Performance

Current metrics:
- First Contentful Paint: ~1.2s
- Largest Contentful Paint: ~1.8s
- Cumulative Layout Shift: 0.05
- Lighthouse Score: 95+

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Majestor Perrincio Kaptue Kepseu**

- Email: majestork@gmail.com
- LinkedIn: [Majestor Kepseu](https://www.linkedin.com/in/majestor-kepseu)
- GitHub: [@PERRINIO-dev](https://github.com/PERRINIO-dev)
- Portfolio: [perrinio-dev.github.io/portfolio](https://perrinio-dev.github.io/my-portfolio)

---

## 🙏 Acknowledgments

- **Design Inspiration**: Modern IT portfolios and Material Design
- **Icons**: [Font Awesome](https://fontawesome.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)
- **Form Handling**: [Formspree](https://formspree.io/)

---

## 📝 Version History

**v6.0** (Current) - Professional Enhancement
- Enhanced project pages with lightbox functionality
- Improved typography and spacing
- Mobile optimization (17-18px body text, 48px touch targets)
- Navigation branding consistency
- Complete theme system refinement

**v5.3** - Theme System
- Dual theme support with auto/light/dark modes
- Theme persistence with localStorage
- Mobile animations and touch feedback
- PWA features with service worker

**v5.0** - Architecture Redesign
- Individual HTML project pages
- Simplified codebase
- Enhanced SEO and performance

---

<div align="center">

**Built with ❤️ using HTML, CSS & JavaScript**

[![GitHub](https://img.shields.io/badge/GitHub-PERRINIO--dev-181717?logo=github)](https://github.com/PERRINIO-dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Majestor_Kepseu-0077B5?logo=linkedin)](https://www.linkedin.com/in/majestor-kepseu)

</div>