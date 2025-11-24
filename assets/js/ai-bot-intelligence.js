// AI & Beyond - Bot Intelligence avec Claude API
// Partie 2 : Logique métier, qualification leads, génération devis

class AIBotIntelligence {
  constructor() {
    this.services = {
      bots: {
        name: "Bots Conversationnels",
        prix_min: 2000,
        prix_max: 8000,
        description: "Assistants IA pour support client, qualification leads, réservations",
        facteurs: ["complexité", "intégrations", "volume"]
      },
      automatisation: {
        name: "Automatisation Workflows",
        prix_min: 3000,
        prix_max: 15000,
        description: "Automatisation tâches répétitives : emails, CRM, reporting",
        facteurs: ["nombre_workflows", "outils", "complexité"]
      },
      rag: {
        name: "RAG-as-a-Service",
        prix_min: 1500,
        prix_max: 10000,
        prix_mensuel: true,
        description: "IA avec accès à vos données propriétaires",
        facteurs: ["volume_données", "requêtes_mensuelles", "intégrations"]
      },
      consulting: {
        name: "Consulting & Audit IA",
        prix_min: 500,
        prix_max: 5000,
        description: "Audit, roadmap, formation Prompt Engineering",
        facteurs: ["durée", "équipe_size", "expertise"]
      },
      formation: {
        name: "Formation Prompt Engineering",
        prix_min: 800,
        prix_max: 3000,
        description: "Formation équipes au Prompt Engineering",
        facteurs: ["participants", "durée", "niveau"]
      }
    };
    
    this.conversationState = {
      stage: 'initial', // initial, qualifying, quoting, closing
      intent: null,
      collectedInfo: {},
      leadScore: 0
    };
  }
  
  // Analyser l'intention de l'utilisateur
  analyzeIntent(message) {
    const lower = message.toLowerCase();
    
    // Intentions de devis
    if (lower.includes('devis') || lower.includes('prix') || lower.includes('coût') || lower.includes('tarif')) {
      return 'quote';
    }
    
    // Intentions de découverte
    if (lower.includes('service') || lower.includes('proposez') || lower.includes('faites')) {
      return 'discover';
    }
    
    // Intentions de rendez-vous
    if (lower.includes('rendez-vous') || lower.includes('rdv') || lower.includes('appel') || lower.includes('rencontrer')) {
      return 'meeting';
    }
    
    // Intentions de questions
    if (lower.includes('?') || lower.includes('comment') || lower.includes('pourquoi') || lower.includes('c\'est quoi')) {
      return 'question';
    }
    
    return 'general';
  }
  
  // Générer le prompt système pour Claude
  getSystemPrompt() {
    return `Tu es Lyra, l'assistante IA virtuelle d'AI & Beyond, une entreprise spécialisée dans les services d'intelligence artificielle pour PME.

MISSION : Qualifier les visiteurs du site et les aider à trouver le service adapté à leurs besoins.

SERVICES PROPOSÉS :
${Object.entries(this.services).map(([key, service]) => 
  `- ${service.name} : ${service.description} (${service.prix_min}€ - ${service.prix_max}€${service.prix_mensuel ? '/mois' : ''})`
).join('\n')}

TON STYLE :
- Professionnel mais accessible
- Concis et direct (max 3-4 phrases par réponse)
- Orienté action et résultats
- Utilise des emojis avec parcimonie (1 par message max)

PROCESSUS DE QUALIFICATION :
1. Comprendre le besoin du client
2. Identifier le ou les services pertinents
3. Poser 2-3 questions pour qualifier (budget, timeline, volume)
4. Proposer un devis estimé OU un rendez-vous

RÈGLES IMPORTANTES :
- Ne jamais inventer de prix : utilise les fourchettes fournies
- Toujours qualifier avant de proposer un prix
- Si le besoin est complexe, propose un appel avec l'équipe
- Reste dans le périmètre des services AI & Beyond

INFORMATIONS À COLLECTER (par ordre de priorité) :
1. Nom et email
2. Entreprise et secteur
3. Besoin spécifique
4. Budget approximatif
5. Timeline souhaitée

Si l'utilisateur demande quelque chose hors périmètre, redirige poliment vers contact@aiandbeyond.eu.`;
  }
  
  // Construire le prompt pour Claude avec contexte
  buildPrompt(userMessage, conversationHistory) {
    const context = `
CONTEXTE CONVERSATION :
- Stage actuel : ${this.conversationState.stage}
- Intent détecté : ${this.conversationState.intent || 'non défini'}
- Infos collectées : ${JSON.stringify(this.conversationState.collectedInfo)}
- Score lead : ${this.conversationState.leadScore}/10

HISTORIQUE :
${conversationHistory.slice(-6).map(msg => 
  `${msg.role === 'user' ? 'Client' : 'Lyra'}: ${msg.content}`
).join('\n')}

NOUVEAU MESSAGE CLIENT : ${userMessage}

INSTRUCTIONS :
Réponds au client en fonction du contexte ci-dessus. Si tu as assez d'informations pour proposer un devis, inclus "ACTION:QUOTE" à la fin de ta réponse. Si tu veux planifier un RDV, inclus "ACTION:MEETING". Si tu as besoin d'informations critiques (email, nom), demande-les directement.`;
    
    return context;
  }
  
  // Appeler l'API Claude (côté client)
  async getClaudeResponse(userMessage, conversationHistory) {
    const systemPrompt = this.getSystemPrompt();
    const userPrompt = this.buildPrompt(userMessage, conversationHistory);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          system: systemPrompt,
          messages: [
            ...conversationHistory.slice(-5), // Derniers 5 messages pour contexte
            { role: "user", content: userPrompt }
          ]
        })
      });
      
      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude API error:', error);
      throw error;
    }
  }
  
  // Parser la réponse de Claude pour extraire les actions
  parseResponse(claudeResponse) {
    let message = claudeResponse;
    let action = null;
    let quickReplies = [];
    
    // Extraire les actions
    if (message.includes('ACTION:QUOTE')) {
      action = 'send_quote';
      message = message.replace('ACTION:QUOTE', '').trim();
      quickReplies = ['Recevoir le devis', 'J\'ai d\'autres questions'];
    } else if (message.includes('ACTION:MEETING')) {
      action = 'schedule_meeting';
      message = message.replace('ACTION:MEETING', '').trim();
      quickReplies = ['Planifier un rendez-vous', 'Pas maintenant'];
    } else if (message.includes('ACTION:COLLECT_EMAIL')) {
      action = 'collect_email';
      message = message.replace('ACTION:COLLECT_EMAIL', '').trim();
    }
    
    // Générer des quick replies contextuels si aucune action spécifique
    if (!action && this.conversationState.stage === 'initial') {
      quickReplies = ['Obtenir un devis', 'En savoir plus', 'Planifier un appel'];
    }
    
    return {
      message,
      action,
      quickReplies
    };
  }
  
  // Mettre à jour le state de la conversation
  updateConversationState(userMessage) {
    const intent = this.analyzeIntent(userMessage);
    this.conversationState.intent = intent;
    
    // Incrémenter le score lead selon les signaux
    if (userMessage.toLowerCase().includes('budget') || userMessage.toLowerCase().includes('€')) {
      this.conversationState.leadScore += 2;
    }
    if (userMessage.toLowerCase().includes('urgent') || userMessage.toLowerCase().includes('rapidement')) {
      this.conversationState.leadScore += 1;
    }
    if (userMessage.length > 100) { // Message détaillé = plus engagé
      this.conversationState.leadScore += 1;
    }
    
    // Progresser dans les stages
    if (this.conversationState.stage === 'initial' && intent !== 'general') {
      this.conversationState.stage = 'qualifying';
    }
    if (Object.keys(this.conversationState.collectedInfo).length >= 3) {
      this.conversationState.stage = 'quoting';
    }
  }
  
  // Extraire les informations du message
  extractInformation(message) {
    const lower = message.toLowerCase();
    const info = {};
    
    // Extraire email
    const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
    const emailMatch = message.match(emailRegex);
    if (emailMatch) {
      info.email = emailMatch[0];
    }
    
    // Extraire budget (approximatif)
    const budgetRegex = /(\d+)\s*(?:€|euros?|k€)/i;
    const budgetMatch = message.match(budgetRegex);
    if (budgetMatch) {
      info.budget = parseInt(budgetMatch[1]);
      if (lower.includes('k€') || lower.includes('k ')) {
        info.budget *= 1000;
      }
    }
    
    // Extraire entreprise
    if (lower.includes('entreprise') || lower.includes('société') || lower.includes('boîte')) {
      const words = message.split(' ');
      const index = words.findIndex(w => 
        w.toLowerCase().includes('entreprise') || 
        w.toLowerCase().includes('société')
      );
      if (index !== -1 && words[index + 1]) {
        info.entreprise = words[index + 1];
      }
    }
    
    return info;
  }
  
  // Générer un devis estimé
  generateQuote(collectedInfo) {
    // Analyser quel service est le plus pertinent
    let selectedService = null;
    let estimatedPrice = { min: 0, max: 0 };
    
    // Logique simple pour l'instant (peut être améliorée avec Claude)
    if (collectedInfo.mention_bot || collectedInfo.mention_chatbot) {
      selectedService = this.services.bots;
    } else if (collectedInfo.mention_automatisation) {
      selectedService = this.services.automatisation;
    } else if (collectedInfo.mention_rag || collectedInfo.mention_données) {
      selectedService = this.services.rag;
    } else if (collectedInfo.mention_formation) {
      selectedService = this.services.formation;
    }
    
    if (selectedService) {
      estimatedPrice = {
        min: selectedService.prix_min,
        max: selectedService.prix_max,
        service: selectedService.name
      };
      
      // Ajuster selon budget si fourni
      if (collectedInfo.budget) {
        if (collectedInfo.budget < selectedService.prix_min) {
          estimatedPrice.note = "Budget inférieur au minimum, nous pouvons discuter d'options";
        } else if (collectedInfo.budget > selectedService.prix_max) {
          estimatedPrice.note = "Budget confortable pour un projet avancé";
        }
      }
    }
    
    return estimatedPrice;
  }
}

// Intégrer l'intelligence au bot principal
if (typeof AIChatBot !== 'undefined') {
  // Étendre le bot avec l'intelligence
  AIChatBot.prototype.botIntelligence = new AIBotIntelligence();
  
  // Remplacer la fonction callBotAPI
  AIChatBot.prototype.callBotAPI = async function(message) {
    // Mettre à jour l'état de la conversation
    this.botIntelligence.updateConversationState(message);
    
    // Extraire les informations
    const extractedInfo = this.botIntelligence.extractInformation(message);
    Object.assign(this.botIntelligence.conversationState.collectedInfo, extractedInfo);
    
    // Appeler Claude pour obtenir une réponse intelligente
    const claudeResponse = await this.botIntelligence.getClaudeResponse(
      message, 
      this.conversationHistory
    );
    
    // Parser la réponse
    const parsed = this.botIntelligence.parseResponse(claudeResponse);
    
    // Si on a assez d'infos et qu'une action de devis est demandée
    if (parsed.action === 'send_quote') {
      const quote = this.botIntelligence.generateQuote(
        this.botIntelligence.conversationState.collectedInfo
      );
      
      if (quote.service) {
        parsed.message += `\n\n💼 Estimation pour ${quote.service} : ${quote.min}€ - ${quote.max}€`;
        if (quote.note) {
          parsed.message += `\n\n📌 ${quote.note}`;
        }
      }
      
      // Envoyer les données par webhook
      this.sendToWebhook('quote', {
        quote,
        collectedInfo: this.botIntelligence.conversationState.collectedInfo,
        leadScore: this.botIntelligence.conversationState.leadScore
      });
    }
    
    return parsed;
  };
}

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIBotIntelligence;
}
