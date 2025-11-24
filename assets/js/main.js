// AI & Beyond - JavaScript Principal

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      
      // Update ARIA for accessibility
      mobileMenuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
    
    // Close menu when clicking on links
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
  
  // Initialize AI Chat Bot (si présent)
  if (typeof initAIChatBot === 'function') {
    initAIChatBot();
  }
});

// Form Validation Enhancement
function enhanceFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.classList.add('border-red-500');
      
      // Add error message
      let errorMsg = this.parentElement.querySelector('.error-message');
      if (!errorMsg) {
        errorMsg = document.createElement('p');
        errorMsg.className = 'error-message text-red-500 text-sm mt-1';
        this.parentElement.appendChild(errorMsg);
      }
      
      if (this.validity.valueMissing) {
        errorMsg.textContent = 'Ce champ est requis';
      } else if (this.validity.typeMismatch) {
        errorMsg.textContent = 'Format invalide';
      }
    });
    
    input.addEventListener('input', function() {
      this.classList.remove('border-red-500');
      const errorMsg = this.parentElement.querySelector('.error-message');
      if (errorMsg) {
        errorMsg.remove();
      }
    });
  });
}

// Initialize form validation on contact forms
document.addEventListener('DOMContentLoaded', function() {
  enhanceFormValidation('contact-form');
  enhanceFormValidation('newsletter-form');
});
