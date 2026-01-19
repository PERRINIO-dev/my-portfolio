/**
 * Professional Image Lightbox
 * Features: Click to enlarge, keyboard navigation, ESC to close, accessible
 * Version: 1.0
 */

class ProjectLightbox {
    constructor() {
        this.modal = null;
        this.images = [];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        // Create lightbox modal
        this.createModal();
        
        // Find all gallery images
        this.setupGalleryImages();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Lightbox initialized with', this.images.length, 'images');
    }

    createModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="lightbox-modal" id="lightbox-modal" role="dialog" aria-modal="true" aria-label="Image viewer">
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close lightbox" title="Close (ESC)">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="lightbox-nav lightbox-prev" aria-label="Previous image" title="Previous (←)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <img class="lightbox-img" src="" alt="" />
                    <div class="lightbox-caption"></div>
                    <button class="lightbox-nav lightbox-next" aria-label="Next image" title="Next (→)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;

        // Add to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Get modal reference
        this.modal = document.getElementById('lightbox-modal');
        
        // Get elements
        this.modalImg = this.modal.querySelector('.lightbox-img');
        this.modalCaption = this.modal.querySelector('.lightbox-caption');
        this.closeBtn = this.modal.querySelector('.lightbox-close');
        this.prevBtn = this.modal.querySelector('.lightbox-prev');
        this.nextBtn = this.modal.querySelector('.lightbox-next');
    }

    setupGalleryImages() {
        // Find all gallery items
        const galleryItems = document.querySelectorAll('.project-gallery-item');
        
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('.project-gallery-img');
            const caption = item.querySelector('.project-gallery-caption');
            
            if (img) {
                // Store image data
                this.images.push({
                    src: img.src,
                    alt: img.alt,
                    caption: caption ? caption.textContent : img.alt
                });
                
                // Add click handler
                item.addEventListener('click', () => this.openLightbox(index));
                
                // Add keyboard support (Enter/Space)
                item.setAttribute('tabindex', '0');
                item.setAttribute('role', 'button');
                item.setAttribute('aria-label', `View image: ${img.alt}`);
                
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.openLightbox(index);
                    }
                });
            }
        });
    }

    setupEventListeners() {
        // Close button
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.showPrevImage());
        this.nextBtn.addEventListener('click', () => this.showNextImage());
        
        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    this.showPrevImage();
                    break;
                case 'ArrowRight':
                    this.showNextImage();
                    break;
            }
        });
        
        // Prevent body scroll when lightbox is open
        this.modal.addEventListener('transitionend', () => {
            if (this.modal.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    openLightbox(index) {
        if (this.images.length === 0) return;
        
        this.currentIndex = index;
        this.showImage(index);
        
        // Show modal
        this.modal.classList.add('active');
        
        // Focus close button for accessibility
        setTimeout(() => this.closeBtn.focus(), 100);
        
        // Hide nav buttons if only one image
        if (this.images.length === 1) {
            this.prevBtn.style.display = 'none';
            this.nextBtn.style.display = 'none';
        } else {
            this.prevBtn.style.display = 'flex';
            this.nextBtn.style.display = 'flex';
        }
    }

    closeLightbox() {
        this.modal.classList.remove('active');
        
        // Return focus to the gallery item that was clicked
        const galleryItems = document.querySelectorAll('.project-gallery-item');
        if (galleryItems[this.currentIndex]) {
            galleryItems[this.currentIndex].focus();
        }
    }

    showImage(index) {
        if (index < 0 || index >= this.images.length) return;
        
        const image = this.images[index];
        
        // Update image
        this.modalImg.src = image.src;
        this.modalImg.alt = image.alt;
        
        // Update caption
        this.modalCaption.textContent = image.caption;
        
        // Update current index
        this.currentIndex = index;
        
        // Update navigation button states
        this.updateNavButtons();
    }

    showPrevImage() {
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) {
            newIndex = this.images.length - 1; // Loop to end
        }
        this.showImage(newIndex);
    }

    showNextImage() {
        let newIndex = this.currentIndex + 1;
        if (newIndex >= this.images.length) {
            newIndex = 0; // Loop to start
        }
        this.showImage(newIndex);
    }

    updateNavButtons() {
        // Disable/enable buttons based on position
        // (Optional: remove if you want infinite loop navigation)
        
        // For now, navigation loops, so buttons are always enabled
        // You can modify this if you prefer linear navigation
    }
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if there's a gallery on the page
    const hasGallery = document.querySelector('.project-gallery');
    
    if (hasGallery) {
        window.projectLightbox = new ProjectLightbox();
    }
});

// Make lightbox available globally for manual control if needed
window.ProjectLightbox = ProjectLightbox;
