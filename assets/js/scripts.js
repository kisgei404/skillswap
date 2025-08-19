// SkillSwap JavaScript Functions

// Enhanced file extension validation for image uploads
function validateImageFile(input) {
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const file = input.files[0];
    const errorElement = document.getElementById('image-error');
    
    if (file) {
        const fileName = file.name.toLowerCase();
        const fileExtension = fileName.split('.').pop();
        
        // Check file extension
        if (!allowedExtensions.includes(fileExtension)) {
            showError(errorElement, 'Please select a valid image file (jpg, jpeg, png, gif, webp)');
            input.classList.add('is-invalid');
            return false;
        }
        
        // Check file size
        if (file.size > maxFileSize) {
            showError(errorElement, 'File size must be less than 5MB');
            input.classList.add('is-invalid');
            return false;
        }
        
        hideError(errorElement);
        input.classList.remove('is-invalid');
        
        // Show file preview
        showImagePreview(file, input);
        return true;
    }
    return true;
}

// Show error message with animation
function showError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    errorElement.style.animation = 'fadeInUp 0.3s ease-out';
}

// Hide error message
function hideError(errorElement) {
    errorElement.style.display = 'none';
    errorElement.style.animation = '';
}

// Show image preview
function showImagePreview(file, input) {
    const reader = new FileReader();
    reader.onload = function(e) {
        let preview = document.getElementById('image-preview');
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'image-preview';
            preview.className = 'mt-2';
            input.parentNode.appendChild(preview);
        }
        
        preview.innerHTML = `
            <div class="image-preview-container" style="position: relative; display: inline-block;">
                <img src="${e.target.result}" alt="Preview" style="max-width: 200px; max-height: 150px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <button type="button" class="btn btn-sm btn-danger" onclick="removeImagePreview()" style="position: absolute; top: -5px; right: -5px; border-radius: 50%; width: 25px; height: 25px; padding: 0; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
        `;
    };
    reader.readAsDataURL(file);
}

// Remove image preview
function removeImagePreview() {
    const preview = document.getElementById('image-preview');
    const imageInput = document.getElementById('image');
    if (preview) {
        preview.remove();
    }
    if (imageInput) {
        imageInput.value = '';
    }
}

// Enhanced form validation with real-time feedback
function validateForm() {
    let isValid = true;
    const requiredFields = ['title', 'category', 'description', 'rate', 'level', 'image'];
    
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const errorElement = document.getElementById(fieldName + '-error');
        
        if (!field.value.trim() || (fieldName === 'level' && field.value === '')) {
            showError(errorElement, 'This field is required');
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            hideError(errorElement);
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });
    
    // Special validation for rate field
    const rateField = document.getElementById('rate');
    if (rateField && rateField.value) {
        const rate = parseFloat(rateField.value);
        if (rate < 1 || rate > 1000) {
            showError(document.getElementById('rate-error'), 'Rate must be between $1 and $1000');
            rateField.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    // Special validation for image file
    const imageInput = document.getElementById('image');
    if (imageInput && imageInput.files.length > 0) {
        if (!validateImageFile(imageInput)) {
            isValid = false;
        }
    }
    
    return isValid;
}

// Enhanced gallery modal functionality with keyboard navigation
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    
    if (galleryItems.length > 0 && modal) {
        let currentImageIndex = 0;
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                currentImageIndex = index;
                showModalImage(index);
            });
            
            // Add keyboard accessibility
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `View ${item.querySelector('img').alt} in full size`);
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentImageIndex = index;
                    showModalImage(index);
                }
            });
        });
        
        // Keyboard navigation in modal
        document.addEventListener('keydown', function(e) {
            if (modal.classList.contains('show')) {
                if (e.key === 'ArrowLeft') {
                    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
                    showModalImage(currentImageIndex);
                } else if (e.key === 'ArrowRight') {
                    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
                    showModalImage(currentImageIndex);
                }
            }
        });
        
        function showModalImage(index) {
            const img = galleryItems[index].querySelector('img');
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalTitle.textContent = img.alt || `Skill Image ${index + 1}`;
            
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
        }
    }
}

// Smooth scroll to top functionality
function addScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<span class="material-icons">keyboard_arrow_up</span>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-orange), var(--gradient-pink));
        border: none;
        color: white;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(scrollButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
        }
    });
    
    scrollButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Loading animation for images
function addImageLoadingEffects() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.style.opacity = '0';
            img.addEventListener('load', function() {
                this.style.transition = 'opacity 0.3s ease';
                this.style.opacity = '1';
            });
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize gallery modals
    initializeGallery();
    
    // Add scroll to top button
    addScrollToTop();
    
    // Add image loading effects
    addImageLoadingEffects();
    
    // Add form validation if on add.html page
    const addForm = document.getElementById('addSkillForm');
    if (addForm) {
        // Real-time validation for image file
        const imageInput = document.getElementById('image');
        if (imageInput) {
            imageInput.addEventListener('change', function() {
                validateImageFile(this);
            });
        }
        
        // Form submission validation with enhanced feedback
        addForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // Show success animation
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<span class="material-icons">check</span> Success!';
                submitBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                
                setTimeout(() => {
                    alert('Skill added successfully!');
                    addForm.reset();
                    
                    // Clear any error states
                    const errorElements = document.querySelectorAll('.error-message');
                    errorElements.forEach(error => error.style.display = 'none');
                    const invalidFields = document.querySelectorAll('.is-invalid, .is-valid');
                    invalidFields.forEach(field => {
                        field.classList.remove('is-invalid', 'is-valid');
                    });
                    
                    // Remove image preview
                    const preview = document.getElementById('image-preview');
                    if (preview) preview.remove();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 1000);
            } else {
                // Shake animation for invalid form
                addForm.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    addForm.style.animation = '';
                }, 500);
            }
        });
        
        // Real-time validation for all fields
        const formFields = addForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
        
        function validateField(field) {
            const errorElement = document.getElementById(field.id + '-error');
            
            if (!field.value.trim() || (field.id === 'level' && field.value === '')) {
                showError(errorElement, 'This field is required');
                field.classList.add('is-invalid');
                field.classList.remove('is-valid');
            } else {
                hideError(errorElement);
                field.classList.remove('is-invalid');
                field.classList.add('is-valid');
            }
        }
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only prevent default for anchor links within the same page
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Enhanced hover effects for skill cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });
    });
    
    // Add CSS for shake animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
});

// Enhanced search functionality (placeholder - not fully implemented as per requirements)
function handleSearch(event) {
    event.preventDefault();
    const searchTerm = document.querySelector('.search-form input').value;
    if (searchTerm.trim()) {
        // Add visual feedback
        const searchIcon = document.querySelector('.search-form .material-icons');
        searchIcon.style.animation = 'pulse 0.5s ease-in-out';
        
        setTimeout(() => {
            alert(`Search functionality is not implemented yet. You searched for: "${searchTerm}"`);
            searchIcon.style.animation = '';
        }, 500);
    }
}

// Add search event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
});

