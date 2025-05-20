document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const form = document.getElementById('estimate-form');
  const submitBtn = document.getElementById('submit-btn');
  const resultDiv = document.getElementById('estimate-result');
  const successMessage = document.getElementById('success-message');
  const heroButton = document.querySelector('.hero-button');
  
  // Smooth scroll for hero button
  if (heroButton) {
    heroButton.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: 'smooth'
        });
        
        // Focus on first form field after scrolling
        setTimeout(() => {
          const firstInput = form.querySelector('select, input');
          if (firstInput) firstInput.focus();
        }, 800);
      }
    });
  }
  
  // Animations on scroll
  const animateOnScroll = function() {
    const elements = document.querySelectorAll('.fade-in');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 50) {
        element.style.opacity = 1;
        element.style.transform = 'translateY(0)';
      }
    });
  };
  
  // Run animation on page load
  animateOnScroll();
  window.addEventListener('scroll', animateOnScroll);
  
  // Input validation
  const inputs = form.querySelectorAll('input, select');
  inputs.forEach(input => {
    input.addEventListener('change', validateInput);
    input.addEventListener('input', validateInput);
  });
  
  function validateInput(e) {
    const input = e.target;
    
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.classList.add('error');
    } else {
      input.classList.remove('error');
    }
    
    // Special validation for email
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.classList.add('error');
      }
    }
    
    // Special validation for phone
    if (input.id === 'phone' && input.value) {
      const phoneRegex = /^0[1-9]([-. ]?[0-9]{2}){4}$/;
      if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
        input.classList.add('error');
      }
    }
    
    checkFormValidity();
  }
  
  function checkFormValidity() {
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (input.classList.contains('error') || !input.value.trim()) {
        isValid = false;
      }
    });
    
    submitBtn.disabled = !isValid;
  }
  
  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traitement en cours...';
    
    // Get form data
    const formData = {
      type: document.getElementById('type').value,
      surface: document.getElementById('surface').value,
      location: document.getElementById('location').value,
      rooms: document.getElementById('rooms').value || 'Non spécifié',
      floor: document.getElementById('floor').value || 'Non spécifié',
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value
    };
    
    // Simulate API call with a timeout
    setTimeout(() => {
      // Calculate an estimated price (this is a simple formula for demo purposes)
      let basePrice = 0;
      
      switch(formData.location.toLowerCase()) {
        case 'paris':
          basePrice = 10000;
          break;
        case 'lyon':
          basePrice = 4500;
          break;
        case 'marseille':
          basePrice = 3500;
          break;
        case 'bordeaux':
          basePrice = 4000;
          break;
        default:
          basePrice = 3000;
      }
      
      let multiplier = 1;
      switch(formData.type) {
        case 'Appartement':
          multiplier = 1;
          break;
        case 'Maison':
          multiplier = 1.2;
          break;
        case 'Villa':
          multiplier = 1.5;
          break;
      }
      
      // Calculate estimated price
      const estimatedPrice = basePrice * multiplier * formData.surface;
      const formattedPrice = new Intl.NumberFormat('fr-FR', { 
        style: 'currency', 
        currency: 'EUR',
        maximumFractionDigits: 0
      }).format(estimatedPrice);
      
      // Display result and success message
      resultDiv.textContent = `Estimation: ${formattedPrice}`;
      resultDiv.style.display = 'block';
      
      // Show success message after 1 second
      setTimeout(() => {
        successMessage.style.display = 'block';
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-calculator"></i> Obtenir mon estimation';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 1000);
      
    }, 2000); // Simulate 2 second API delay
  });
  
  // Add focus effects to inputs
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
      this.parentElement.classList.remove('focused');
    });
  });
});
  