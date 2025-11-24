// Google Analytics 4 - AI & Beyond
// Configuration optimisée pour tracking complet

(function() {
  'use strict';
  
  // Configuration GA4
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // À remplacer par votre ID GA4
  
  // Chargement asynchrone de gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  
  // Configuration GA4
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  
  // Configuration de base
  gtag('config', GA_MEASUREMENT_ID, {
    'send_page_view': true,
    'anonymize_ip': true,  // RGPD compliance
    'cookie_flags': 'SameSite=None;Secure'
  });
  
  // Events personnalisés
  
  // Track clicks sur CTA
  document.addEventListener('DOMContentLoaded', function() {
    // Track tous les boutons de contact
    const contactButtons = document.querySelectorAll('[href="#contact"], .cta-button, .contact-button');
    contactButtons.forEach(button => {
      button.addEventListener('click', function() {
        gtag('event', 'cta_click', {
          'event_category': 'engagement',
          'event_label': this.textContent.trim(),
          'value': 1
        });
      });
    });
    
    // Track soumission formulaire
    const forms = document.querySelectorAll('form[name="contact"]');
    forms.forEach(form => {
      form.addEventListener('submit', function() {
        gtag('event', 'form_submit', {
          'event_category': 'lead_generation',
          'event_label': 'contact_form',
          'value': 10
        });
      });
    });
    
    // Track navigation vers pages services
    const serviceLinks = document.querySelectorAll('a[href*="services"], a[href*="rag"], a[href*="bots"]');
    serviceLinks.forEach(link => {
      link.addEventListener('click', function() {
        gtag('event', 'service_view', {
          'event_category': 'engagement',
          'event_label': this.getAttribute('href'),
          'value': 1
        });
      });
    });
    
    // Track téléchargement de ressources
    const downloadLinks = document.querySelectorAll('a[href*=".pdf"], a[href*="download"]');
    downloadLinks.forEach(link => {
      link.addEventListener('click', function() {
        gtag('event', 'file_download', {
          'event_category': 'engagement',
          'event_label': this.getAttribute('href'),
          'value': 5
        });
      });
    });
    
    // Track ouverture chat bot
    const chatBotButton = document.querySelector('#ai-chat-button');
    if (chatBotButton) {
      chatBotButton.addEventListener('click', function() {
        gtag('event', 'chatbot_open', {
          'event_category': 'engagement',
          'event_label': 'ai_assistant',
          'value': 3
        });
      });
    }
    
    // Track scroll depth
    let maxScroll = 0;
    let scrollCheckpoints = [25, 50, 75, 100];
    
    window.addEventListener('scroll', function() {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      scrollCheckpoints.forEach(checkpoint => {
        if (scrollPercent >= checkpoint && maxScroll < checkpoint) {
          maxScroll = checkpoint;
          gtag('event', 'scroll_depth', {
            'event_category': 'engagement',
            'event_label': checkpoint + '%',
            'value': checkpoint
          });
        }
      });
    });
    
    // Track temps passé sur la page
    let startTime = Date.now();
    
    window.addEventListener('beforeunload', function() {
      const timeSpent = Math.round((Date.now() - startTime) / 1000); // en secondes
      
      gtag('event', 'time_on_page', {
        'event_category': 'engagement',
        'event_label': document.title,
        'value': timeSpent
      });
    });
  });
  
  // Fonction pour tracker les erreurs JS (optionnel)
  window.addEventListener('error', function(e) {
    gtag('event', 'exception', {
      'description': e.message,
      'fatal': false
    });
  });
  
})();

// Export pour utilisation dans d'autres scripts
window.trackEvent = function(eventName, params) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, params);
  }
};

console.log('📊 Google Analytics 4 chargé et configuré');
