// ====== THEME MANAGER ======
// Handles light/dark theme switching with persistence

class ThemeManager {
    constructor() {
        this.theme = null;
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.prefersLight = window.matchMedia('(prefers-color-scheme: light)');
        
        // Initialize
        this.init();
    }
    
    init() {
        // Check for saved theme preference
        this.loadTheme();
        
        // Create theme toggle button
        this.createThemeToggle();
        
        // Listen for system theme changes
        this.setupMediaQueryListeners();
        
        // Apply theme to HTML
        this.applyTheme();
        
        console.log('🎨 Theme Manager initialized');
    }
    
    loadTheme() {
        // Try to get saved theme from localStorage
        const savedTheme = localStorage.getItem('portfolio-theme');
        
        if (savedTheme) {
            this.theme = savedTheme;
        } else {
            // No saved theme, use system preference
            this.theme = this.prefersDark.matches ? 'dark' : 'light';
        }
    }
    
    saveTheme() {
        localStorage.setItem('portfolio-theme', this.theme);
    }
    
    getTheme() {
        return this.theme;
    }
    
    setTheme(newTheme) {
        if (!['light', 'dark'].includes(newTheme)) {
            console.error('Invalid theme:', newTheme);
            return;
        }
        
        // Don't do anything if theme is already set
        if (this.theme === newTheme) return;
        
        // Update theme
        const oldTheme = this.theme;
        this.theme = newTheme;
        
        // Save to localStorage
        this.saveTheme();
        
        // Apply theme with transition
        this.applyThemeWithTransition(oldTheme, newTheme);
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent();
        
        console.log(`🎨 Theme changed: ${oldTheme} → ${newTheme}`);
    }
    
    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    applyTheme() {
        // Remove any existing theme attributes
        document.documentElement.removeAttribute('data-theme');
        
        // Add the current theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor();
        
        // Add theme class for transitions
        document.documentElement.classList.add(`theme-${this.theme}`);
        document.documentElement.classList.remove(`theme-${this.theme === 'light' ? 'dark' : 'light'}`);
    }
    
    applyThemeWithTransition(oldTheme, newTheme) {
        // Add transition class
        document.documentElement.classList.add('theme-transition');
        
        // Apply theme change
        this.applyTheme();
        
        // Remove transition class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transition');
        }, 300);
    }
    
    updateMetaThemeColor() {
        // Update theme-color meta tag for mobile browsers
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        let metaThemeColorLight = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]');
        
        if (this.theme === 'light') {
            // Update main theme-color
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', '#F8F9FA');
            }
            
            // Update light-specific theme-color
            if (metaThemeColorLight) {
                metaThemeColorLight.setAttribute('content', '#20D3D3');
            }
        } else {
            // Dark theme
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', '#070A0D');
            }
            
            if (metaThemeColorLight) {
                metaThemeColorLight.setAttribute('content', '#20D3D3');
            }
        }
    }
    
    createThemeToggle() {
        // Check if toggle already exists
        if (document.querySelector('.theme-switcher')) return;
        
        // Create theme switcher container
        const themeSwitcher = document.createElement('div');
        themeSwitcher.className = 'theme-switcher';
        themeSwitcher.setAttribute('aria-label', 'Theme switcher');
        
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle theme');
        toggleButton.setAttribute('title', 'Switch between light and dark theme');
        
        // Add icons
        const sunIcon = document.createElement('i');
        sunIcon.className = 'fas fa-sun sun-icon';
        
        const moonIcon = document.createElement('i');
        moonIcon.className = 'fas fa-moon moon-icon';
        
        toggleButton.appendChild(sunIcon);
        toggleButton.appendChild(moonIcon);
        
        // Add click event
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleTheme();
            this.animateToggleButton(toggleButton);
        });
        
        // Add keyboard support
        toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleTheme();
                this.animateToggleButton(toggleButton);
            }
        });
        
        themeSwitcher.appendChild(toggleButton);
        document.body.appendChild(themeSwitcher);
        
        console.log('🎨 Theme toggle created');
    }
    
    animateToggleButton(button) {
        // Add animation class
        button.classList.add('theme-toggling');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            button.classList.remove('theme-toggling');
        }, 300);
    }
    
    setupMediaQueryListeners() {
        // Listen for system theme changes (only if user hasn't set a preference)
        this.prefersDark.addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                this.applyTheme();
                console.log('🎨 System theme changed to:', this.theme);
            }
        });
    }
    
    dispatchThemeChangeEvent() {
        // Dispatch custom event for other parts of the app to listen to
        const event = new CustomEvent('themechange', {
            detail: { theme: this.theme }
        });
        document.documentElement.dispatchEvent(event);
    }
    
    // Public API
    static getInstance() {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }
}

// ====== INITIALIZE THEME MANAGER ======
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme manager
    const themeManager = ThemeManager.getInstance();
    
    // Make theme manager available globally for debugging
    window.themeManager = themeManager;
    
    // Log current theme
    console.log(`🎨 Current theme: ${themeManager.getTheme()}`);
    
    // Add theme change listener for analytics
    document.documentElement.addEventListener('themechange', (e) => {
        console.log('🎨 Theme change detected:', e.detail.theme);
        
        // Track theme changes if analytics are enabled
        if (window.gtag) {
            gtag('event', 'theme_change', {
                'theme': e.detail.theme
            });
        }
    });
});

// ====== THEME UTILITY FUNCTIONS ======
const ThemeUtils = {
    // Check if current theme is dark
    isDark() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    },
    
    // Check if current theme is light
    isLight() {
        return document.documentElement.getAttribute('data-theme') === 'light';
    },
    
    // Get current theme
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    },
    
    // Toggle theme (public API)
    toggle() {
        ThemeManager.getInstance().toggleTheme();
    },
    
    // Set specific theme (public API)
    set(theme) {
        ThemeManager.getInstance().setTheme(theme);
    },
    
    // Reset to system preference
    resetToSystem() {
        localStorage.removeItem('portfolio-theme');
        ThemeManager.getInstance().loadTheme();
        ThemeManager.getInstance().applyTheme();
    }
};

// Make ThemeUtils available globally
window.ThemeUtils = ThemeUtils;
