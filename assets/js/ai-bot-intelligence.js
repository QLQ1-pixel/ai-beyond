// AI & Beyond - Bot Intelligence (Version Gratuite)
// Système de réponses intelligentes basé sur des règles

class AIBotIntelligence {
  constructor() {
    this.services = {
      bots: {
        name: "Bots Conversationnels",
        prix_min: 2000,
        prix_max: 8000,
        description: "Assistants IA pour support client, qualification leads, réservations automatisées"
      },
      automatisation: {
        name: "Automatisation Workflows",
        prix_min: 3000,
        prix_max: 15000,
        description: "Automatisation de vos tâches répétitives : emails, CRM, reporting, onboarding"
      },
      rag: {
        name: "RAG-as-a-Service",
        prix_min: 1500,
        prix_max: 10000,
        monthly: true,
        description: "IA avec accès à vos données propriétaires pour des réponses contextuelles"
      },
      ragPhysique: {
        name: "RAG Physique (Mac Studio/Mini)",
        prix_min: 8000,
        prix_max: 25000,
        description: "Solution IA locale complète : matériel + installation + formation"
      },
      consulting: {
        name: "Consulting & Audit IA",
        prix_min: 500,
        prix_max: 5000,
        description: "Audit de vos processus, roadmap IA, recommandations stratégiques"
      },
      formation: {
        name: "Formation Prompt Engineering",
        prix_min: 800,
        prix_max: 3000,
        description: "Formation de vos équipes aux techniques avancées de Prompt Engineering"
      }
    };
    
    this.collectedInfo = {
      name: null,
      email: null,
      phone: null,
      company: null,
      need: null,
      budget: null,
      service: null
    };
    
    this.conversationStage = 'initial';
    this.whatsappNumber = '+351920833889';
  }

  processMessage(message) {
    const lower = message.toLowerCase().trim();
    this.extractInfo(message);
    const intent = this.detectIntent(lower);
    return this.generateResponse(intent, lower, message);
  }

  detectIntent(lower) {
    if (this.matchKeywords(lower, ['bonjour', 'salut', 'hello', 'bonsoir', 'hey', 'coucou'])) {
      return 'greeting';
    }
    if (this.matchKeywords(lower, ['devis', 'prix', 'coût', 'tarif', 'combien', 'budget', 'estimation'])) {
      return 'quote';
    }
    if (this.matchKeywords(lower, ['service', 'proposez', 'offre', 'faites', 'quoi', 'activité'])) {
      return 'services';
    }
    if (this.matchKeywords(lower, ['bot', 'chatbot', 'assistant'])) {
      return 'bots';
    }
    if (this.matchKeywords(lower, ['automatisation', 'automatiser', 'workflow', 'automation'])) {
      return 'automation';
    }
    if (this.matchKeywords(lower, ['rag', 'données', 'documents', 'knowledge', 'base de connaissance'])) {
      return 'rag';
    }
    if (this.matchKeywords(lower, ['mac', 'studio', 'mini', 'local', 'serveur', 'physique', 'matériel'])) {
      return 'rag_physical';
    }
    if (this.matchKeywords(lower, ['formation', 'former', 'apprendre', 'cours', 'training'])) {
      return 'training';
    }
    if (this.matchKeywords(lower, ['audit', 'conseil', 'consulting', 'stratégie'])) {
      return 'consulting';
    }
    if (this.matchKeywords(lower, ['rendez-vous', 'rdv', 'appel', 'rencontrer', 'discuter', 'call', 'calendly'])) {
      return 'meeting';
    }
    if (this.matchKeywords(lower, ['whatsapp', 'wa', 'téléphone', 'appeler'])) {
      return 'whatsapp';
    }
    if (this.matchKeywords(lower, ['humain', 'personne', 'quelqu\'un', 'parler à', 'contact', 'email'])) {
      return 'human';
    }
    if (this.matchKeywords(lower, ['merci', 'thanks', 'super', 'parfait', 'génial', 'excellent'])) {
      return 'thanks';
    }
    if (this.matchKeywords(lower, ['oui', 'ok', 'd\'accord', 'yes', 'allons-y', 'on y va', 'envoyez', 'envoyer'])) {
      return 'confirm';
    }
    if (this.matchKeywords(lower, ['non', 'pas maintenant', 'plus tard', 'no'])) {
      return 'decline';
    }
    if (this.containsEmail(lower)) {
      return 'email_provided';
    }
    return 'general';
  }

  generateResponse(intent, lower, originalMessage) {
    let response = { message: '', quickReplies: [], action: null };

    switch(intent) {
      case 'greeting':
        response.message = `Bonjour ! 👋 Je suis Lyra, votre assistante IA chez AI & Beyond.\n\nComment puis-je vous aider ?`;
        response.quickReplies = ['Découvrir vos services', 'Obtenir un devis', 'Prendre rendez-vous'];
        break;

      case 'services':
        response.message = `Chez AI & Beyond, nous proposons :\n\n🤖 **Bots IA** (2-8K€)\n⚡ **Automatisation** (3-15K€)\n🧠 **RAG Cloud** (1.5-10K€/mois)\n🖥️ **RAG Local** (8-25K€)\n📚 **Formation** (0.8-3K€)\n🔍 **Audit IA** (0.5-5K€)\n\nQuel service vous intéresse ?`;
        response.quickReplies = ['Bots IA', 'Automatisation', 'RAG', 'Formation'];
        break;

      case 'quote':
        if (!this.collectedInfo.email) {
          this.conversationStage = 'collecting';
          response.message = `Avec plaisir ! 📝 Pour vous envoyer un devis, j'ai besoin de votre **email**.`;
        } else {
          response.message = `Quel type de projet vous intéresse ?`;
          response.quickReplies = ['Bot IA', 'Automatisation', 'RAG', 'Audit IA'];
        }
        break;

      case 'bots':
        this.collectedInfo.service = 'bots';
        response.message = `🤖 **Bots Conversationnels** :\n\n• Support client 24/7\n• Qualification de leads\n• Prise de RDV automatique\n\n**Tarifs : 2 000€ - 8 000€**\n\nVoulez-vous un devis ?`;
        response.quickReplies = ['Obtenir un devis', 'Plus d\'infos', 'Prendre RDV'];
        break;

      case 'automation':
        this.collectedInfo.service = 'automatisation';
        response.message = `⚡ **Automatisation** :\n\n• Emails et suivis auto\n• Connexion CRM/outils\n• Reporting automatique\n\n**Tarifs : 3 000€ - 15 000€**\n\nQu'aimeriez-vous automatiser ?`;
        response.quickReplies = ['Obtenir un devis', 'Prendre RDV'];
        break;

      case 'rag':
        this.collectedInfo.service = 'rag';
        response.message = `🧠 **RAG-as-a-Service** :\n\n• IA sur vos documents\n• Recherche intelligente\n• Base de connaissances IA\n\n**Tarifs : 1 500€ - 10 000€/mois**\n\nIntéressé par le RAG local aussi ?`;
        response.quickReplies = ['Obtenir un devis', 'RAG Local/Physique'];
        break;

      case 'rag_physical':
        this.collectedInfo.service = 'ragPhysique';
        response.message = `🖥️ **RAG Physique** (Mac Studio/Mini) :\n\n• 100% local, vos données chez vous\n• RGPD compliant\n• Installation + formation incluses\n\n**Tarifs : 8 000€ - 25 000€**\n\nIdéal pour données sensibles !`;
        response.quickReplies = ['Obtenir un devis', 'Prendre RDV'];
        break;

      case 'training':
        this.collectedInfo.service = 'formation';
        response.message = `📚 **Formation Prompt Engineering** :\n\n• Techniques avancées\n• Cas pratiques métier\n• Atelier hands-on\n\n**Tarifs : 800€ - 3 000€**`;
        response.quickReplies = ['Obtenir un devis', 'Programme détaillé'];
        break;

      case 'consulting':
        this.collectedInfo.service = 'consulting';
        response.message = `🔍 **Audit & Consulting IA** :\n\n• Analyse de vos processus\n• Opportunités IA\n• Roadmap transformation\n\n**Tarifs : 500€ - 5 000€**`;
        response.quickReplies = ['Prendre RDV', 'Obtenir un devis'];
        break;

      case 'meeting':
        response.message = `📅 Réservez un créneau de 30 min :\n\n👉 **Calendly** : calendly.com/ai-and-beyond\n\nOu contactez-nous sur WhatsApp !`;
        response.quickReplies = ['Ouvrir Calendly', 'WhatsApp', 'Email'];
        response.action = 'show_calendly';
        break;

      case 'whatsapp':
        response.message = `📱 Contactez-nous sur WhatsApp :\n\n👉 Cliquez ici : wa.me/${this.whatsappNumber.replace('+', '')}\n\nNous répondons rapidement !`;
        response.action = 'show_whatsapp';
        break;

      case 'human':
        response.message = `📧 **Email** : contact@aiandbeyond.eu\n📱 **WhatsApp** : wa.me/${this.whatsappNumber.replace('+', '')}\n📅 **Calendly** : calendly.com/ai-and-beyond\n\nNous répondons sous 24h !`;
        response.action = 'show_contact';
        break;

      case 'email_provided':
        const email = this.extractEmail(originalMessage);
        if (email) {
          this.collectedInfo.email = email;
          response.message = `Parfait ! 📧 J'ai noté **${email}**.\n\nDécrivez-moi votre projet ou besoin ?`;
          this.conversationStage = 'qualifying';
        }
        break;

      case 'thanks':
        response.message = `Avec plaisir ! 😊 À bientôt !`;
        response.quickReplies = ['Autre question', 'Prendre RDV'];
        break;

      case 'confirm':
        if (this.conversationStage === 'closing' && this.collectedInfo.email) {
          response.message = `🎉 Demande transmise à notre équipe !\n\nVous recevrez une réponse sous 24-48h à **${this.collectedInfo.email}**.\n\nMerci !`;
          response.action = 'send_lead';
        } else {
          response.message = `Que souhaitez-vous faire ?`;
          response.quickReplies = ['Obtenir un devis', 'Prendre RDV'];
        }
        break;

      case 'decline':
        response.message = `Pas de problème ! 😊 Je reste dispo si besoin.`;
        break;

      default:
        if (this.conversationStage === 'collecting' && !this.collectedInfo.email) {
          response.message = `Pour continuer, j'ai besoin de votre **email** 📧`;
        } else if (this.conversationStage === 'qualifying') {
          this.collectedInfo.need = originalMessage;
          this.conversationStage = 'closing';
          
          let estimate = '';
          if (this.collectedInfo.service && this.services[this.collectedInfo.service]) {
            const s = this.services[this.collectedInfo.service];
            estimate = `\n\n💼 **${s.name}** : ${s.prix_min.toLocaleString()}€ - ${s.prix_max.toLocaleString()}€${s.monthly ? '/mois' : ''}`;
          }
          
          response.message = `Merci ! 📝${estimate}\n\nJe transmets votre demande ? Notre équipe vous contactera sous 24-48h.`;
          response.quickReplies = ['Oui, envoyez !', 'J\'ai des questions'];
        } else {
          response.message = `Je peux vous aider avec nos services IA. Que recherchez-vous ?`;
          response.quickReplies = ['Voir les services', 'Obtenir un devis', 'Parler à un humain'];
        }
    }

    return response;
  }

  matchKeywords(text, keywords) {
    return keywords.some(kw => text.includes(kw));
  }

  containsEmail(text) {
    return /[\w.-]+@[\w.-]+\.\w+/.test(text);
  }

  extractEmail(text) {
    const match = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    return match ? match[0] : null;
  }

  extractInfo(message) {
    const email = this.extractEmail(message);
    if (email) this.collectedInfo.email = email;
    
    const phoneMatch = message.match(/(?:\+|00)?[0-9\s.-]{9,}/);
    if (phoneMatch) this.collectedInfo.phone = phoneMatch[0].trim();
    
    const budgetMatch = message.match(/(\d+)\s*(?:€|euros?|k€|k\s*€)/i);
    if (budgetMatch) {
      let budget = parseInt(budgetMatch[1]);
      if (message.toLowerCase().includes('k')) budget *= 1000;
      this.collectedInfo.budget = budget;
    }
  }

  prepareLeadData() {
    return {
      ...this.collectedInfo,
      timestamp: new Date().toISOString(),
      source: 'chatbot_lyra'
    };
  }

  reset() {
    this.collectedInfo = { name: null, email: null, phone: null, company: null, need: null, budget: null, service: null };
    this.conversationStage = 'initial';
  }
}

// Intégrer au bot principal
function attachIntelligence() {
  if (typeof AIChatBot !== 'undefined') {
    // Ajouter au prototype
    AIChatBot.prototype.botIntelligence = new AIBotIntelligence();
    
    AIChatBot.prototype.callBotAPI = async function(message) {
      // Initialiser l'intelligence si pas encore fait
      if (!this.botIntelligence) {
        this.botIntelligence = new AIBotIntelligence();
      }
      
      const response = this.botIntelligence.processMessage(message);
      
      if (response.action === 'send_lead') {
        const leadData = this.botIntelligence.prepareLeadData();
        this.sendLeadNotification(leadData);
      }
      
      if (response.action === 'show_calendly') {
        setTimeout(() => window.open('https://calendly.com/ai-and-beyond', '_blank'), 500);
      }
      
      if (response.action === 'show_whatsapp') {
        setTimeout(() => window.open('https://wa.me/351920833889', '_blank'), 500);
      }
      
      return response;
    };
    
    AIChatBot.prototype.sendLeadNotification = function(leadData) {
      console.log('📧 Nouveau lead Lyra:', leadData);
      
      const form = document.createElement('form');
      form.setAttribute('name', 'lyra-leads');
      form.setAttribute('method', 'POST');
      form.setAttribute('data-netlify', 'true');
      form.setAttribute('hidden', 'true');
      
      const fields = ['email', 'phone', 'service', 'need', 'budget', 'timestamp'];
      fields.forEach(field => {
        const input = document.createElement('input');
        input.setAttribute('name', field);
        input.setAttribute('value', leadData[field] || '');
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      
      const formData = new FormData(form);
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      }).then(() => {
        console.log('✅ Lead envoyé à Netlify Forms');
        form.remove();
      }).catch(err => {
        console.error('❌ Erreur envoi lead:', err);
        form.remove();
      });
    };
    
    // IMPORTANT: Mettre à jour l'instance existante si elle existe
    if (window.aiChatBot) {
      window.aiChatBot.botIntelligence = new AIBotIntelligence();
      window.aiChatBot.callBotAPI = AIChatBot.prototype.callBotAPI;
      window.aiChatBot.sendLeadNotification = AIChatBot.prototype.sendLeadNotification;
      console.log('✅ Lyra Intelligence activée !');
    }
  }
}

// Exécuter immédiatement et aussi après le chargement complet
attachIntelligence();
document.addEventListener('DOMContentLoaded', attachIntelligence);
window.addEventListener('load', attachIntelligence);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIBotIntelligence;
}
