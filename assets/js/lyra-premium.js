/**
 * =========================================
 * LYRA - Bot Premium AI & Beyond
 * Version 2.1 - Claude AI Powered
 * =========================================
 * 
 * Fonctionnalités :
 * - Design glassmorphism premium
 * - Support multilingue (FR/EN/PT)
 * - Intelligence Claude AI (Haiku 3.5)
 * - Fallback intelligent si API indisponible
 * - Qualification intelligente de leads
 * - Génération de devis automatique
 * - Intégration Calendly/WhatsApp/Email
 * - Analytics tracking
 */

class LyraChatBot {
  constructor(config = {}) {
    // Configuration par défaut
    this.config = {
      botName: 'Lyra',
      botRole: 'AI Assistant',
      companyName: 'AI & Beyond',
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      accentColor: '#06b6d4',
      email: 'contact@aiandbeyond.eu',
      whatsapp: '+351920833889',
      calendlyUrl: 'https://calendly.com/ai-and-beyond',
      showBadge: true,
      autoOpenDelay: null,
      useClaudeAPI: true, // Activer l'API Claude
      apiEndpoint: '/.netlify/functions/lyra-chat',
      ...config
    };

    // État du bot
    this.isOpen = false;
    this.conversationHistory = [];
    this.apiConversationHistory = []; // Historique pour l'API Claude
    this.collectedInfo = {
      email: null,
      phone: null,
      name: null,
      company: null,
      need: null,
      service: null,
      budget: null,
      timeline: null
    };
    this.conversationStage = 'initial';
    this.leadScore = 0;
    this.useAPI = this.config.useClaudeAPI;

    // Détection de la langue
    this.lang = this.detectLanguage();

    // Services et tarifs (pour fallback et quick replies)
    this.services = {
      bots: { 
        priceMin: 2000, priceMax: 8000, 
        monthly: false,
        keywords: ['bot', 'chatbot', 'assistant', 'support', 'conversational']
      },
      automation: { 
        priceMin: 3000, priceMax: 15000, 
        monthly: false,
        keywords: ['automation', 'automatisation', 'workflow', 'process', 'automatização']
      },
      rag: { 
        priceMin: 1500, priceMax: 10000, 
        monthly: true,
        keywords: ['rag', 'document', 'knowledge', 'données', 'dados', 'search']
      },
      ragPhysique: { 
        priceMin: 8000, priceMax: 25000, 
        monthly: false,
        keywords: ['mac', 'studio', 'mini', 'local', 'hardware', 'physique', 'físico']
      },
      consulting: { 
        priceMin: 500, priceMax: 5000, 
        monthly: false,
        keywords: ['audit', 'conseil', 'consulting', 'strategy', 'consultoria']
      },
      formation: { 
        priceMin: 800, priceMax: 3000, 
        monthly: false,
        keywords: ['formation', 'training', 'cours', 'course', 'treinamento', 'formação']
      }
    };

    // Messages pour fallback et quick replies
    this.messages = this.initMessages();

    // Initialisation
    this.init();
  }

  /**
   * Initialisation des messages multilingues
   */
  initMessages() {
    return {
      fr: {
        welcome: `👋 Bonjour ! Je suis ${this.config.botName}, votre assistante IA chez ${this.config.companyName}.\n\nComment puis-je vous aider aujourd'hui ?`,
        quickReplies: {
          initial: ['Découvrir vos services', 'Obtenir un devis', 'Prendre rendez-vous'],
          services: ['Bots IA', 'Automatisation', 'RAG', 'Formation'],
          quote: ['Recevoir par email', 'Prendre RDV', "J'ai des questions"],
          thanks: ['Autre question', 'Prendre RDV', 'Contact'],
          afterResponse: ['En savoir plus', 'Obtenir un devis', 'Prendre RDV']
        },
        placeholder: "Tapez votre message...",
        thinking: "Lyra réfléchit..."
      },
      en: {
        welcome: `👋 Hello! I'm ${this.config.botName}, your AI assistant at ${this.config.companyName}.\n\nHow can I help you today?`,
        quickReplies: {
          initial: ['Discover our services', 'Get a quote', 'Book a meeting'],
          services: ['AI Bots', 'Automation', 'RAG', 'Training'],
          quote: ['Receive by email', 'Book a call', 'I have questions'],
          thanks: ['Another question', 'Book a call', 'Contact'],
          afterResponse: ['Learn more', 'Get a quote', 'Book a meeting']
        },
        placeholder: "Type your message...",
        thinking: "Lyra is thinking..."
      },
      pt: {
        welcome: `👋 Olá! Sou ${this.config.botName}, sua assistente de IA na ${this.config.companyName}.\n\nComo posso ajudá-lo hoje?`,
        quickReplies: {
          initial: ['Descobrir serviços', 'Pedir orçamento', 'Agendar reunião'],
          services: ['Bots IA', 'Automação', 'RAG', 'Formação'],
          quote: ['Receber por email', 'Agendar chamada', 'Tenho dúvidas'],
          thanks: ['Outra pergunta', 'Agendar chamada', 'Contacto'],
          afterResponse: ['Saber mais', 'Pedir orçamento', 'Agendar reunião']
        },
        placeholder: "Digite sua mensagem...",
        thinking: "Lyra está pensando..."
      }
    };
  }

  /**
   * Détection automatique de la langue
   */
  detectLanguage() {
    const path = window.location.pathname;
    if (path.startsWith('/en/') || path.includes('/en/')) return 'en';
    if (path.startsWith('/pt/') || path.includes('/pt/')) return 'pt';
    
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
      if (htmlLang.startsWith('en')) return 'en';
      if (htmlLang.startsWith('pt')) return 'pt';
      if (htmlLang.startsWith('fr')) return 'fr';
    }
    
    const storedLang = localStorage.getItem('preferred-language');
    if (storedLang && ['fr', 'en', 'pt'].includes(storedLang)) {
      return storedLang;
    }
    
    return 'fr';
  }

  /**
   * Récupérer les messages dans la bonne langue
   */
  t(key) {
    return this.messages[this.lang]?.[key] || this.messages['fr'][key] || '';
  }

  /**
   * Initialisation du bot
   */
  init() {
    this.injectCSS();
    this.injectHTML();
    this.attachEventListeners();
    
    // Message de bienvenue différé
    setTimeout(() => {
      this.addBotMessage(this.t('welcome'), this.t('quickReplies').initial);
    }, 1000);

    // Auto-ouverture si configuré
    if (this.config.autoOpenDelay) {
      setTimeout(() => {
        if (!this.isOpen) this.toggleChat();
      }, this.config.autoOpenDelay);
    }

    console.log(`🤖 Lyra v2.1 initialized (${this.lang}) - Claude API: ${this.useAPI ? 'enabled' : 'disabled'}`);
  }

  /**
   * Injection du CSS (fallback si fichier externe non chargé)
   */
  injectCSS() {
    const existingLink = document.querySelector('link[href*="lyra-premium.css"]');
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/css/lyra-premium.css';
    document.head.appendChild(link);
  }

  /**
   * Injection du HTML
   */
  injectHTML() {
    const widget = document.createElement('div');
    widget.id = 'lyra-widget';
    widget.innerHTML = `
      <button id="lyra-trigger" class="pulse" aria-label="Open chat with ${this.config.botName}">
        ${this.config.showBadge ? '<span class="lyra-badge">1</span>' : ''}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      <div id="lyra-container" role="dialog" aria-label="Chat with ${this.config.botName}">
        <div id="lyra-header">
          <div class="lyra-avatar-wrapper">
            <div class="lyra-avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span class="lyra-status"></span>
            </div>
            <div class="lyra-info">
              <div class="lyra-name">${this.config.botName}</div>
              <div class="lyra-role">${this.config.botRole}</div>
            </div>
          </div>
          <button id="lyra-close" aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div id="lyra-messages"></div>

        <div id="lyra-input-area">
          <input 
            type="text" 
            id="lyra-input" 
            placeholder="${this.t('placeholder')}" 
            autocomplete="off"
          />
          <button id="lyra-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>

        <div class="lyra-powered">
          Powered by <a href="https://aiandbeyond.eu" target="_blank">AI & Beyond</a> ✨ Claude AI
        </div>
      </div>
    `;
    document.body.appendChild(widget);
  }

  /**
   * Attacher les événements
   */
  attachEventListeners() {
    document.getElementById('lyra-trigger').addEventListener('click', () => this.toggleChat());
    document.getElementById('lyra-close').addEventListener('click', () => this.toggleChat());
    document.getElementById('lyra-send').addEventListener('click', () => this.handleSend());
    document.getElementById('lyra-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.toggleChat();
    });
  }

  /**
   * Toggle ouverture/fermeture du chat
   */
  toggleChat() {
    this.isOpen = !this.isOpen;
    const container = document.getElementById('lyra-container');
    const trigger = document.getElementById('lyra-trigger');
    const badge = trigger.querySelector('.lyra-badge');

    if (this.isOpen) {
      container.classList.add('active');
      trigger.style.display = 'none';
      document.getElementById('lyra-input').focus();
      if (badge) badge.style.display = 'none';
      this.trackEvent('chat_opened');
    } else {
      container.classList.add('closing');
      setTimeout(() => {
        container.classList.remove('active', 'closing');
        trigger.style.display = 'flex';
      }, 300);
    }
  }

  /**
   * Envoi d'un message utilisateur
   */
  handleSend() {
    const input = document.getElementById('lyra-input');
    const message = input.value.trim();
    
    if (message) {
      input.value = '';
      this.processUserMessage(message);
    }
  }

  /**
   * Traitement du message utilisateur
   */
  async processUserMessage(message) {
    this.addUserMessage(message);
    this.showTyping();
    
    // Extraction d'informations pour qualification
    this.extractInfo(message);
    
    // Ajouter à l'historique API
    this.apiConversationHistory.push({
      role: 'user',
      content: message
    });

    try {
      let response;
      
      if (this.useAPI) {
        // Appel à l'API Claude
        response = await this.callClaudeAPI(message);
      } else {
        // Mode fallback
        response = this.generateFallbackResponse(message);
      }
      
      this.hideTyping();
      
      // Ajouter la réponse à l'historique API
      if (response.message) {
        this.apiConversationHistory.push({
          role: 'assistant',
          content: response.message
        });
      }
      
      // Afficher le message avec quick replies contextuels
      const quickReplies = this.getContextualQuickReplies(message, response.message);
      this.addBotMessage(response.message, quickReplies);
      
      // Actions spéciales basées sur le contenu
      this.handleSpecialActions(response.message);
      
    } catch (error) {
      console.error('Error processing message:', error);
      this.hideTyping();
      
      // Fallback en cas d'erreur
      const fallbackResponse = this.generateFallbackResponse(message);
      this.addBotMessage(fallbackResponse.message, fallbackResponse.quickReplies);
    }
  }

  /**
   * Appel à l'API Claude via Netlify Function
   */
  async callClaudeAPI(message) {
    try {
      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
          conversationHistory: this.apiConversationHistory.slice(-10) // Limiter l'historique
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Si fallback activé côté serveur
      if (data.fallback) {
        console.log('API fallback activated');
        this.useAPI = false; // Désactiver temporairement l'API
        return { message: data.message, quickReplies: this.t('quickReplies').initial };
      }

      // Log usage pour monitoring
      if (data.usage) {
        console.log(`📊 Claude API usage - Input: ${data.usage.input_tokens}, Output: ${data.usage.output_tokens}`);
      }

      return { message: data.message };
      
    } catch (error) {
      console.error('Claude API error:', error);
      
      // Basculer vers fallback
      this.useAPI = false;
      return this.generateFallbackResponse(message);
    }
  }

  /**
   * Génération de réponse fallback (sans API)
   */
  generateFallbackResponse(message) {
    const lower = message.toLowerCase();
    const msgs = this.messages[this.lang];

    // Salutations
    if (/bonjour|salut|hello|hi|hey|olá|oi|bom dia/.test(lower)) {
      return { 
        message: this.lang === 'fr' ? "Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?" :
                 this.lang === 'en' ? "Hello! 👋 How can I help you today?" :
                 "Olá! 👋 Como posso ajudá-lo hoje?",
        quickReplies: msgs.quickReplies.initial 
      };
    }

    // Services
    if (/service|offre|propose|offer|serviço/.test(lower)) {
      const servicesMsg = this.lang === 'fr' 
        ? `🚀 **Nos Services IA :**\n\n🤖 Bots IA (2-8K€)\n⚡ Automatisation (3-15K€)\n🧠 RAG Cloud (1.5-10K€/mois)\n🖥️ RAG Local (8-25K€)\n📚 Formation (0.8-3K€)\n🔍 Audit (0.5-5K€)\n\nQuel service vous intéresse ?`
        : this.lang === 'en'
        ? `🚀 **Our AI Services:**\n\n🤖 AI Bots (€2-8K)\n⚡ Automation (€3-15K)\n🧠 RAG Cloud (€1.5-10K/mo)\n🖥️ RAG Local (€8-25K)\n📚 Training (€0.8-3K)\n🔍 Audit (€0.5-5K)\n\nWhich service interests you?`
        : `🚀 **Nossos Serviços IA:**\n\n🤖 Bots IA (€2-8K)\n⚡ Automação (€3-15K)\n🧠 RAG Cloud (€1.5-10K/mês)\n🖥️ RAG Local (€8-25K)\n📚 Formação (€0.8-3K)\n🔍 Auditoria (€0.5-5K)\n\nQual serviço lhe interessa?`;
      
      return { message: servicesMsg, quickReplies: msgs.quickReplies.services };
    }

    // Devis
    if (/devis|prix|quote|price|orçamento|preço|combien|how much|quanto/.test(lower)) {
      const quoteMsg = this.lang === 'fr'
        ? "Pour vous proposer un devis personnalisé, pourriez-vous me donner votre email et décrire brièvement votre projet ?"
        : this.lang === 'en'
        ? "To provide you with a personalized quote, could you give me your email and briefly describe your project?"
        : "Para fornecer um orçamento personalizado, pode dar-me o seu email e descrever brevemente o seu projeto?";
      
      return { message: quoteMsg, quickReplies: [] };
    }

    // RDV
    if (/rdv|rendez-vous|meeting|call|appointment|reunião|chamada|calendly/.test(lower)) {
      const rdvMsg = this.lang === 'fr'
        ? "📅 Parfait ! Réservez un créneau de 30 min pour un appel découverte gratuit.\n\n👉 calendly.com/ai-and-beyond"
        : this.lang === 'en'
        ? "📅 Perfect! Book a 30-min slot for a free discovery call.\n\n👉 calendly.com/ai-and-beyond"
        : "📅 Perfeito! Reserve um horário de 30 min para uma chamada de descoberta gratuita.\n\n👉 calendly.com/ai-and-beyond";
      
      return { message: rdvMsg, quickReplies: ['WhatsApp', 'Email'] };
    }

    // Contact
    if (/contact|email|whatsapp|téléphone|phone/.test(lower)) {
      const contactMsg = this.lang === 'fr'
        ? `📧 **Contact :**\n\n📩 contact@aiandbeyond.eu\n📱 WhatsApp: +351 920 833 889\n📅 calendly.com/ai-and-beyond`
        : this.lang === 'en'
        ? `📧 **Contact:**\n\n📩 contact@aiandbeyond.eu\n📱 WhatsApp: +351 920 833 889\n📅 calendly.com/ai-and-beyond`
        : `📧 **Contacto:**\n\n📩 contact@aiandbeyond.eu\n📱 WhatsApp: +351 920 833 889\n📅 calendly.com/ai-and-beyond`;
      
      return { message: contactMsg, quickReplies: ['Calendly', 'WhatsApp'] };
    }

    // Merci
    if (/merci|thanks|thank|obrigado|obrigada/.test(lower)) {
      const thanksMsg = this.lang === 'fr'
        ? "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions."
        : this.lang === 'en'
        ? "You're welcome! 😊 Feel free to ask if you have more questions."
        : "De nada! 😊 Não hesite se tiver mais perguntas.";
      
      return { message: thanksMsg, quickReplies: msgs.quickReplies.thanks };
    }

    // Réponse par défaut
    const defaultMsg = this.lang === 'fr'
      ? "Je peux vous aider avec nos services IA : bots, automatisation, RAG, formation... Que recherchez-vous ?"
      : this.lang === 'en'
      ? "I can help you with our AI services: bots, automation, RAG, training... What are you looking for?"
      : "Posso ajudá-lo com nossos serviços de IA: bots, automação, RAG, formação... O que procura?";

    return { message: defaultMsg, quickReplies: msgs.quickReplies.initial };
  }

  /**
   * Quick replies contextuels basés sur la conversation
   */
  getContextualQuickReplies(userMessage, botResponse) {
    const msgs = this.messages[this.lang];
    const lower = (userMessage + ' ' + botResponse).toLowerCase();

    // Si on parle de services spécifiques
    if (/bot|chatbot|assistant/.test(lower)) {
      return this.lang === 'fr' ? ['Obtenir un devis', 'Voir une démo', 'Prendre RDV'] :
             this.lang === 'en' ? ['Get a quote', 'See a demo', 'Book a call'] :
             ['Pedir orçamento', 'Ver demo', 'Agendar chamada'];
    }

    if (/rag|document|knowledge/.test(lower)) {
      return this.lang === 'fr' ? ['RAG Cloud', 'RAG Local', 'Obtenir un devis'] :
             this.lang === 'en' ? ['RAG Cloud', 'RAG Local', 'Get a quote'] :
             ['RAG Cloud', 'RAG Local', 'Pedir orçamento'];
    }

    if (/formation|training|cours/.test(lower)) {
      return this.lang === 'fr' ? ['Programme détaillé', 'Tarifs', 'Prendre RDV'] :
             this.lang === 'en' ? ['Detailed program', 'Pricing', 'Book a call'] :
             ['Programa detalhado', 'Preços', 'Agendar chamada'];
    }

    // Si email mentionné dans le bot response
    if (/email|contact@/.test(lower)) {
      return this.lang === 'fr' ? ['Prendre RDV', 'WhatsApp', 'Autre question'] :
             this.lang === 'en' ? ['Book a call', 'WhatsApp', 'Another question'] :
             ['Agendar chamada', 'WhatsApp', 'Outra pergunta'];
    }

    // Par défaut
    return msgs.quickReplies.afterResponse;
  }

  /**
   * Gérer les actions spéciales basées sur le contenu
   */
  handleSpecialActions(message) {
    const lower = message.toLowerCase();

    // Ouvrir Calendly si mentionné
    if (/calendly\.com|réservez un créneau|book a slot|reserve um horário/.test(lower)) {
      setTimeout(() => {
        if (confirm(this.lang === 'fr' ? 'Ouvrir Calendly pour réserver ?' : 
                    this.lang === 'en' ? 'Open Calendly to book?' : 
                    'Abrir Calendly para reservar?')) {
          window.open(this.config.calendlyUrl, '_blank');
        }
      }, 1500);
    }
  }

  /**
   * Extraction d'informations du message
   */
  extractInfo(message) {
    // Email
    const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
    if (emailMatch) {
      this.collectedInfo.email = emailMatch[0].toLowerCase();
      this.leadScore += 3;
    }
    
    // Téléphone
    const phoneMatch = message.match(/(?:\+|00)?[0-9\s.\-()]{9,}/);
    if (phoneMatch) {
      this.collectedInfo.phone = phoneMatch[0].replace(/\s/g, '');
      this.leadScore += 2;
    }
    
    // Budget mentionné
    if (/\d+\s*[kK€$]|\d{4,}|budget/.test(message)) {
      this.leadScore += 2;
    }
    
    // Urgence
    if (/urgent|rapidement|vite|asap|quickly|soon|urgente/.test(message.toLowerCase())) {
      this.leadScore += 1;
    }

    // Nom d'entreprise potentiel
    const companyMatch = message.match(/(?:chez|at|para|company|entreprise|empresa)\s+([A-Z][a-zA-Z]+)/);
    if (companyMatch) {
      this.collectedInfo.company = companyMatch[1];
    }

    // Si lead score élevé, envoyer notification
    if (this.leadScore >= 5 && this.collectedInfo.email) {
      this.sendLead();
    }
  }

  /**
   * Ajouter un message utilisateur
   */
  addUserMessage(text) {
    const container = document.getElementById('lyra-messages');
    const div = document.createElement('div');
    div.className = 'lyra-message user';
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    
    this.conversationHistory.push({ role: 'user', content: text, timestamp: Date.now() });
  }

  /**
   * Ajouter un message bot
   */
  addBotMessage(text, quickReplies = []) {
    const container = document.getElementById('lyra-messages');
    
    const div = document.createElement('div');
    div.className = 'lyra-message bot';
    div.innerHTML = this.formatMessage(text);
    container.appendChild(div);
    
    if (quickReplies && quickReplies.length > 0) {
      const qrDiv = document.createElement('div');
      qrDiv.className = 'lyra-quick-replies';
      
      quickReplies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'lyra-quick-reply';
        btn.textContent = reply;
        btn.onclick = () => {
          qrDiv.remove();
          this.processUserMessage(reply);
        };
        qrDiv.appendChild(btn);
      });
      
      container.appendChild(qrDiv);
    }
    
    container.scrollTop = container.scrollHeight;
    this.conversationHistory.push({ role: 'bot', content: text, timestamp: Date.now() });
  }

  /**
   * Formater le message (markdown simplifié + liens cliquables)
   */
  formatMessage(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/(calendly\.com\/[^\s<]+)/g, '<a href="https://$1" target="_blank" rel="noopener">$1</a>')
      .replace(/(\+351[\s\d]+)/g, '<a href="https://wa.me/351920833889" target="_blank" rel="noopener">$1</a>');
  }

  /**
   * Afficher l'indicateur de frappe
   */
  showTyping() {
    const container = document.getElementById('lyra-messages');
    const div = document.createElement('div');
    div.id = 'lyra-typing';
    div.className = 'lyra-typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  /**
   * Masquer l'indicateur de frappe
   */
  hideTyping() {
    const typing = document.getElementById('lyra-typing');
    if (typing) typing.remove();
  }

  /**
   * Envoi du lead vers Netlify Forms
   */
  sendLead() {
    const data = {
      ...this.collectedInfo,
      leadScore: this.leadScore,
      language: this.lang,
      source: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    console.log('📧 Lead Lyra:', data);
    
    const formData = new URLSearchParams();
    formData.append('form-name', 'lyra-leads');
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'object') {
        formData.append(key, value);
      }
    });
    formData.append('conversation', JSON.stringify(this.conversationHistory.slice(-20)));
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })
    .then(() => {
      console.log('✅ Lead envoyé via Netlify Forms');
      this.trackEvent('lead_submitted', data);
    })
    .catch(err => {
      console.error('❌ Erreur envoi lead:', err);
    });
  }

  /**
   * Tracking analytics
   */
  trackEvent(eventName, data = {}) {
    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        event_category: 'Lyra Chat',
        ...data
      });
    }
    console.log(`📊 Event: ${eventName}`, data);
  }
}

// =========================================
// INITIALISATION AUTOMATIQUE
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  const config = window.LYRA_CONFIG || window.AI_BOT_CONFIG || {};
  window.lyra = new LyraChatBot(config);
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = LyraChatBot;
}
