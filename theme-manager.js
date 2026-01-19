// ====== ENHANCED THEME MANAGER v5.3.1 ======
// Three-way theme support: Auto (System) / Light / Dark
// Fixes theme persistence and system preference interaction

class ThemeManager {
    constructor() {
        this.theme = null; // Current active theme: 'light' or 'dark'
        this.userPreference = null; // User choice: 'auto', 'light', or 'dark'
        this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.prefersLight = window.matchMedia('(prefers-color-scheme: light)');
        
        // Initialize
        this.init();
    }
    
    init() {
        // Load user preference and determine theme
        this.loadTheme();
        
        // Create theme toggle button
        this.createThemeToggle();
        
        // Listen for system theme changes
        this.setupMediaQueryListeners();
        
        // Apply theme to HTML
        this.applyTheme();
        
        console.log('🎨 Enhanced Theme Manager initialized');
        console.log(`   User Preference: ${this.userPreference}`);
        console.log(`   Active Theme: ${this.theme}`);
    }
    
    loadTheme() {
        // Try to get saved user preference from localStorage
        const savedPreference = localStorage.getItem('portfolio-theme-preference');
        
        if (savedPreference && ['auto', 'light', 'dark'].includes(savedPreference)) {
            this.userPreference = savedPreference;
        } else {
            // No saved preference - default to 'auto' (system)
            this.userPreference = 'auto';
        }
        
        // Determine actual theme based on preference
        this.theme = this.determineTheme();
    }
    
    determineTheme() {
        if (this.userPreference === 'auto') {
            // Use system preference
            return this.prefersDark.matches ? 'dark' : 'light';
        } else {
            // Use explicit user choice
            return this.userPreference;
        }
    }
    
    savePreference() {
        localStorage.setItem('portfolio-theme-preference', this.userPreference);
    }
    
    getTheme() {
        return this.theme;
    }
    
    getUserPreference() {
        return this.userPreference;
    }
    
    setTheme(newPreference) {
        // Validate input
        if (!['auto', 'light', 'dark'].includes(newPreference)) {
            console.error('Invalid theme preference:', newPreference);
            return;
        }
        
        // Update preference
        const oldPreference = this.userPreference;
        const oldTheme = this.theme;
        this.userPreference = newPreference;
        this.theme = this.determineTheme();
        
        // Save to localStorage
        this.savePreference();
        
        // Apply theme with transition if theme actually changed
        if (oldTheme !== this.theme) {
            this.applyThemeWithTransition(oldTheme, this.theme);
        } else {
            // Just update the toggle button state
            this.updateToggleButton();
        }
        
        // Dispatch theme change event
        this.dispatchThemeChangeEvent();
        
        console.log(`🎨 Preference changed: ${oldPreference} → ${this.userPreference}`);
        console.log(`   Theme applied: ${this.theme}`);
    }
    
    cycleTheme() {
        // Three-way cycle: auto → light → dark → auto
        const cycle = {
            'auto': 'light',
            'light': 'dark',
            'dark': 'auto'
        };
        
        const newPreference = cycle[this.userPreference];
        this.setTheme(newPreference);
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
        
        // Update toggle button
        this.updateToggleButton();
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
        
        if (this.theme === 'light') {
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', '#F8F9FA');
            }
        } else {
            // Dark theme
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', '#070A0D');
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
        toggleButton.setAttribute('aria-label', 'Cycle theme: Auto, Light, Dark');
        
        // Add icons for all three modes
        const autoIcon = document.createElement('i');
        autoIcon.className = 'fas fa-circle-half-stroke auto-icon';
        autoIcon.setAttribute('title', 'Auto (System)');
        
        const sunIcon = document.createElement('i');
        sunIcon.className = 'fas fa-sun sun-icon';
        sunIcon.setAttribute('title', 'Light');
        
        const moonIcon = document.createElement('i');
        moonIcon.className = 'fas fa-moon moon-icon';
        moonIcon.setAttribute('title', 'Dark');
        
        toggleButton.appendChild(autoIcon);
        toggleButton.appendChild(sunIcon);
        toggleButton.appendChild(moonIcon);
        
        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'theme-tooltip';
        toggleButton.appendChild(tooltip);
        
        // Add click event
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.cycleTheme();
            this.animateToggleButton(toggleButton);
        });
        
        // Add keyboard support
        toggleButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.cycleTheme();
                this.animateToggleButton(toggleButton);
            }
        });
        
        themeSwitcher.appendChild(toggleButton);
        document.body.appendChild(themeSwitcher);
        
        // Set initial button state
        this.updateToggleButton();
        
        console.log('🎨 Three-way theme toggle created');
    }
    
    updateToggleButton() {
        const toggleButton = document.querySelector('.theme-toggle');
        if (!toggleButton) return;
        
        const tooltip = toggleButton.querySelector('.theme-tooltip');
        
        // Remove all mode classes
        toggleButton.classList.remove('mode-auto', 'mode-light', 'mode-dark');
        
        // Add current mode class
        toggleButton.classList.add(`mode-${this.userPreference}`);
        
        // Update tooltip text
        const tooltipText = {
            'auto': `Auto (System: ${this.theme === 'dark' ? 'Dark' : 'Light'})`,
            'light': 'Light',
            'dark': 'Dark'
        };
        
        if (tooltip) {
            tooltip.textContent = tooltipText[this.userPreference];
        }
        
        // Update aria-label
        const nextMode = {
            'auto': 'Light',
            'light': 'Dark',
            'dark': 'Auto'
        };
        toggleButton.setAttribute('aria-label', `Current: ${tooltipText[this.userPreference]}. Click for ${nextMode[this.userPreference]}`);
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
        // Listen for system theme changes (only matters when in 'auto' mode)
        this.prefersDark.addEventListener('change', (e) => {
            if (this.userPreference === 'auto') {
                // User is in auto mode - update theme to match system
                const newTheme = e.matches ? 'dark' : 'light';
                if (this.theme !== newTheme) {
                    this.theme = newTheme;
                    this.applyThemeWithTransition(this.theme === 'dark' ? 'light' : 'dark', this.theme);
                    console.log('🎨 System theme changed to:', this.theme);
                }
            }
        });
    }
    
    dispatchThemeChangeEvent() {
        // Dispatch custom event for other parts of the app to listen to
        const event = new CustomEvent('themechange', {
            detail: { 
                theme: this.theme,
                preference: this.userPreference
            }
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
    
    // Log current state
    console.log(`🎨 Theme System Ready`);
    console.log(`   Preference: ${themeManager.getUserPreference()}`);
    console.log(`   Active Theme: ${themeManager.getTheme()}`);
    
    // Add theme change listener for analytics
    document.documentElement.addEventListener('themechange', (e) => {
        console.log('🎨 Theme changed:', e.detail);
        
        // Track theme changes if analytics are enabled
        if (window.gtag) {
            gtag('event', 'theme_change', {
                'preference': e.detail.preference,
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
    
    // Check if in auto mode
    isAuto() {
        const manager = ThemeManager.getInstance();
        return manager.getUserPreference() === 'auto';
    },
    
    // Get current theme
    getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    },
    
    // Get user preference
    getUserPreference() {
        const manager = ThemeManager.getInstance();
        return manager.getUserPreference();
    },
    
    // Cycle through themes (public API)
    cycle() {
        ThemeManager.getInstance().cycleTheme();
    },
    
    // Set specific preference (public API)
    set(preference) {
        ThemeManager.getInstance().setTheme(preference);
    },
    
    // Set to auto (system) mode
    setAuto() {
        ThemeManager.getInstance().setTheme('auto');
    },
    
    // Set to light mode
    setLight() {
        ThemeManager.getInstance().setTheme('light');
    },
    
    // Set to dark mode
    setDark() {
        ThemeManager.getInstance().setTheme('dark');
    }
};

// Make ThemeUtils available globally
window.ThemeUtils = ThemeUtils;

// ====== CONSOLE HELPER ======
// Useful commands you can run in browser console:
// ThemeUtils.setAuto()   - Switch to auto (system) mode
// ThemeUtils.setLight()  - Force light mode
// ThemeUtils.setDark()   - Force dark mode
// ThemeUtils.cycle()     - Cycle through modes
// ThemeUtils.getUserPreference()  - Check current preference
// ThemeUtils.getCurrentTheme()    - Check active theme
