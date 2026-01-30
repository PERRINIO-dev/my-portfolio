// ====== SHARED LIGHTBOX ======
// Reusable lightbox with keyboard nav and mobile swipe support
document.addEventListener('DOMContentLoaded', function() {
(function() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCaption = document.getElementById('lightbox-caption');
    var lightboxCounter = document.getElementById('lightbox-counter');
    var closeBtn = lightbox.querySelector('.lightbox-close');
    var prevBtn = lightbox.querySelector('.lightbox-prev');
    var nextBtn = lightbox.querySelector('.lightbox-next');

    var galleryImages = [];
    var currentIndex = 0;

    // Collect all lightbox triggers
    var triggers = document.querySelectorAll('[data-lightbox]');

    triggers.forEach(function(trigger) {
        var img = trigger.querySelector('img');
        if (img) {
            galleryImages.push({
                src: img.src,
                caption: trigger.dataset.caption || img.alt
            });

            trigger.addEventListener('click', function() {
                currentIndex = galleryImages.findIndex(function(item) { return item.src === img.src; });
                openLightbox(currentIndex);
            });
        }
    });

    function openLightbox(index) {
        currentIndex = index;
        var image = galleryImages[currentIndex];
        lightboxImg.src = image.src;
        lightboxImg.alt = image.caption;
        lightboxCaption.textContent = image.caption;
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + galleryImages.length;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentIndex);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        openLightbox(currentIndex);
    }

    // Button listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Click outside to close
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe support for mobile
    var touchStartX = 0;
    var touchStartY = 0;
    var touchEndX = 0;
    var touchEndY = 0;
    var swiping = false;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        touchEndX = touchStartX;
        touchEndY = touchStartY;
        swiping = true;
    }, { passive: true });

    lightbox.addEventListener('touchmove', function(e) {
        if (!swiping) return;
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', function() {
        if (!swiping) return;
        swiping = false;

        var diffX = touchStartX - touchEndX;
        var diffY = touchStartY - touchEndY;
        var minSwipeDistance = 50;

        // Only act on horizontal swipes (ignore vertical scroll)
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
            if (diffX > 0) {
                showNext();
            } else {
                showPrev();
            }
        }
    }, { passive: true });
})();
});
