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
  
  // Plus besoin de gestion conditionnelle - formulaire simplifié
  
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
  
  // Désactiver le bouton par défaut
  submitBtn.disabled = true;
  
  // Vérifier la validité du formulaire au chargement
  setTimeout(() => {
    checkFormValidity();
  }, 100);

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
      const phoneRegex = /^[0-9\s\-\.\(\)]+$/;
      if (!phoneRegex.test(input.value) || input.value.length < 8) {
        input.classList.add('error');
      }
    }
    
    checkFormValidity();
  }
  
  function checkFormValidity() {
    const requiredInputs = form.querySelectorAll('[required]');
    let isValid = true;
    
    console.log('=== Vérification de validité du formulaire ===');
    
    // Vérifier tous les champs requis
    requiredInputs.forEach(input => {
      const hasError = input.classList.contains('error');
      const isEmpty = !input.value.trim();
      
      console.log(`Champ ${input.id}: valeur="${input.value}", erreur=${hasError}, vide=${isEmpty}`);
      
      if (hasError || isEmpty) {
        isValid = false;
      }
    });
    
    console.log(`Formulaire valide: ${isValid}`);
    submitBtn.disabled = !isValid;
    
    if (isValid) {
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
    } else {
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    }
  }
  
  // Fonction pour envoyer les données via l'API backend
  async function sendToAirtable(formData) {
    try {
      console.log('=== ENVOI DES DONNÉES AU SERVEUR ===');
      console.log('Données envoyées:', formData);
      
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données:', error);
      throw error;
    }
  }
  
  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    console.log('=== SOUMISSION DU FORMULAIRE DÉCLENCHÉE ===');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    
    // Get form data - formulaire simplifié
    const formData = {
      type: document.getElementById('type').value,
      location: document.getElementById('location').value,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      countryCode: document.getElementById('country-code').value
    };
    
    try {
      // Envoyer les données à Airtable via l'API backend
      await sendToAirtable(formData);
      
      // Track Facebook Pixel Lead event
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
          content_name: 'Estimation immobilière',
          content_category: 'Real Estate',
          value: 0,
          currency: 'EUR'
        });
      }
      
      // Masquer l'estimation factice et le message de succès
      resultDiv.style.display = 'none';
      successMessage.style.display = 'none';
      
      // Afficher la popup de confirmation
      showModal();
      
      // Reset form after successful submission
      setTimeout(() => {
        form.reset();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-phone"></i> Être contacté par nos experts';
        checkFormValidity();
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      
      // En cas d'erreur, afficher un message d'erreur
      alert('Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.');
      
      // Reset button
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-phone"></i> Être contacté par nos experts';
      checkFormValidity();
    }
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

// Fonctions pour gérer la popup
function showModal() {
  const modal = document.getElementById('confirmation-modal');
  modal.style.display = 'block';
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('confirmation-modal');
  modal.style.display = 'none';
  
  // Restore body scroll
  document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('confirmation-modal');
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal with ESC key
window.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});
  