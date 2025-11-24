// AI & Beyond - Configuration du Bot IA "Lyra"
// Fichier de configuration centralisé - Facile à personnaliser

window.AI_BOT_CONFIG = {
  // ===== IDENTITÉ DU BOT =====
  botName: 'Lyra',
  botRole: 'Assistante IA',
  companyName: 'AI & Beyond',
  
  // ===== APPARENCE =====
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#06b6d4',
  
  // ===== COMPORTEMENT =====
  autoOpen: false, // Ouvrir automatiquement après X secondes
  autoOpenDelay: 5000, // 5 secondes
  showWelcomeMessage: true,
  welcomeDelay: 1000, // 1 seconde
  
  // ===== INTÉGRATIONS =====
  integrations: {
    // Email
    email: {
      enabled: true,
      to: 'contact@aiandbeyond.eu',
      from: 'lyra@aiandbeyond.eu'
    },
    
    // WhatsApp Business (à configurer)
    whatsapp: {
      enabled: false,
      number: null, // Format : '+33612345678'
      apiKey: null, // API Key Twilio/360dialog
      webhook: null // URL webhook WhatsApp API
    },
    
    // Zapier (optionnel)
    zapier: {
      enabled: false,
      webhook: null // URL webhook Zapier
    },
    
    // Make.com (optionnel)
    make: {
      enabled: false,
      webhook: null // URL webhook Make
    },
    
    // Calendly
    calendly: {
      enabled: true,
      url: 'https://calendly.com/ai-and-beyond'
    },
    
    // Google Analytics (tracking events bot)
    analytics: {
      enabled: true,
      trackConversations: true,
      trackLeads: true
    }
  },
  
  // ===== QUALIFICATION DES LEADS =====
  leadScoring: {
    emailProvided: 3,
    phoneProvided: 2,
    budgetMentioned: 2,
    urgentKeywords: 1,
    detailedMessage: 1,
    minScoreForNotification: 4, // Score minimum pour notification WhatsApp
    minScoreForPriority: 7 // Score pour "Haute priorité"
  },
  
  // ===== SERVICES & PRICING =====
  services: {
    bots: {
      name: "Bots Conversationnels",
      priceMin: 2000,
      priceMax: 8000,
      currency: "€",
      description: "Assistants IA pour support client, qualification leads, réservations",
      keywords: ["bot", "chatbot", "assistant", "support", "client"]
    },
    automatisation: {
      name: "Automatisation Workflows",
      priceMin: 3000,
      priceMax: 15000,
      currency: "€",
      description: "Automatisation tâches répétitives : emails, CRM, reporting",
      keywords: ["automatisation", "workflow", "automatique", "automation"]
    },
    rag: {
      name: "RAG-as-a-Service",
      priceMin: 1500,
      priceMax: 10000,
      currency: "€/mois",
      monthly: true,
      description: "IA avec accès à vos données propriétaires",
      keywords: ["rag", "données", "documents", "base de données", "recherche"]
    },
    ragPhysique: {
      name: "RAG Physique (Matériel + Setup)",
      priceMin: 8000,
      priceMax: 25000,
      currency: "€",
      description: "Solution RAG complète clé en main : Mac Studio/Mini + installation + formation",
      keywords: ["mac", "studio", "mini", "matériel", "hardware", "physique", "serveur", "local"]
    },
    consulting: {
      name: "Consulting & Audit IA",
      priceMin: 500,
      priceMax: 5000,
      currency: "€",
      description: "Audit, roadmap, formation Prompt Engineering",
      keywords: ["audit", "conseil", "consulting", "stratégie"]
    },
    formation: {
      name: "Formation Prompt Engineering",
      priceMin: 800,
      priceMax: 3000,
      currency: "€",
      description: "Formation équipes au Prompt Engineering",
      keywords: ["formation", "training", "apprendre", "cours"]
    }
  },
  
  // ===== MESSAGES PRÉDÉFINIS =====
  messages: {
    welcome: `👋 Bonjour ! Je suis {botName}, votre assistante IA chez {companyName}.

Je peux vous aider à :
• Découvrir nos services IA
• Obtenir un devis personnalisé
• Répondre à vos questions
• Planifier un rendez-vous

Par quoi souhaitez-vous commencer ?`,
    
    noEmail: "Pour vous envoyer le devis, j'aurais besoin de votre email. Pouvez-vous me le communiquer ?",
    
    thankYou: "Merci ! J'ai bien transmis vos informations à notre équipe. Vous recevrez un retour sous 24-48h maximum. 🎉",
    
    error: "Désolé, j'ai rencontré une erreur technique. Pouvez-vous nous contacter directement à {email} ?",
    
    afterHours: "Nous sommes actuellement fermés. Laissez-moi vos coordonnées et nous vous recontacterons dès demain ! 📧"
  },
  
  // ===== QUICK REPLIES PAR DÉFAUT =====
  defaultQuickReplies: {
    initial: [
      'Obtenir un devis',
      'Découvrir vos services',
      'Poser une question',
      'Planifier un RDV'
    ],
    afterQuestion: [
      'C\'est clair, merci !',
      'J\'ai une autre question',
      'Je veux un devis'
    ],
    afterQuote: [
      'Recevoir le devis par email',
      'Planifier un appel',
      'J\'ai besoin de plus d\'infos'
    ]
  },
  
  // ===== HORAIRES (pour message after-hours) =====
  businessHours: {
    enabled: false, // Désactivé par défaut
    timezone: 'Europe/Paris',
    schedule: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: null, // Fermé
      sunday: null // Fermé
    }
  },
  
  // ===== FEATURES AVANCÉES =====
  features: {
    multiLanguage: false, // Support multi-langues (future)
    voiceInput: false, // Entrée vocale (future)
    fileUpload: false, // Upload fichiers (future)
    screenShare: false, // Partage d'écran (future)
    videoCall: false // Appel vidéo (future)
  }
};

// Helper function pour remplacer les variables dans les messages
function formatMessage(template, variables = {}) {
  let message = template;
  const defaults = {
    botName: window.AI_BOT_CONFIG.botName,
    companyName: window.AI_BOT_CONFIG.companyName,
    email: window.AI_BOT_CONFIG.integrations.email.to
  };
  
  const allVars = { ...defaults, ...variables };
  
  Object.keys(allVars).forEach(key => {
    message = message.replace(new RegExp(`{${key}}`, 'g'), allVars[key]);
  });
  
  return message;
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AI_BOT_CONFIG, formatMessage };
}
