/**
 * =========================================
 * LYRA - Bot Premium AI & Beyond
 * Version 2.0 - WOW Edition
 * =========================================
 * 
 * Fonctionnalités :
 * - Design glassmorphism premium
 * - Support multilingue (FR/EN/PT)
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
      autoOpenDelay: null, // null = pas d'ouverture auto
      ...config
    };

    // État du bot
    this.isOpen = false;
    this.conversationHistory = [];
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

    // Détection de la langue
    this.lang = this.detectLanguage();

    // Services et tarifs
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

    // Messages multilingues
    this.messages = {
      fr: {
        welcome: `👋 Bonjour ! Je suis ${this.config.botName}, votre assistante IA chez ${this.config.companyName}.\n\nComment puis-je vous aider aujourd'hui ?`,
        quickReplies: {
          initial: ['Découvrir vos services', 'Obtenir un devis', 'Prendre rendez-vous'],
          services: ['Bots IA', 'Automatisation', 'RAG', 'Formation'],
          quote: ['Recevoir par email', 'Prendre RDV', "J'ai des questions"],
          thanks: ['Autre question', 'Prendre RDV', 'Contact']
        },
        greetings: {
          response: "Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?",
          keywords: ['bonjour', 'salut', 'hello', 'hey', 'coucou', 'bonsoir']
        },
        services: {
          title: "🚀 Nos Services IA",
          list: `Voici nos solutions pour transformer votre entreprise :\n\n🤖 **Bots IA** (2-8K€) - Assistants intelligents\n⚡ **Automatisation** (3-15K€) - Workflows optimisés\n🧠 **RAG Cloud** (1.5-10K€/mois) - IA sur vos données\n🖥️ **RAG Local** (8-25K€) - Solution 100% privée\n📚 **Formation** (0.8-3K€) - Prompt Engineering\n🔍 **Audit IA** (0.5-5K€) - Stratégie transformation`,
          keywords: ['service', 'proposez', 'offre', 'faites', 'quoi']
        },
        quote: {
          askEmail: "Parfait ! 📝 Pour vous envoyer un devis personnalisé, quel est votre email ?",
          askService: "Quel type de projet vous intéresse ?",
          keywords: ['devis', 'prix', 'coût', 'tarif', 'combien', 'budget', 'estimation']
        },
        bots: {
          response: `🤖 **Bots Conversationnels IA**\n\n• Support client 24/7 intelligent\n• Qualification automatique de leads\n• Prise de RDV et FAQ automatisées\n• Intégration WhatsApp, site web, CRM\n\n💰 **Tarifs** : 2 000€ - 8 000€`,
          keywords: ['bot', 'chatbot', 'assistant']
        },
        automation: {
          response: `⚡ **Automatisation Intelligente**\n\n• Emails et suivis automatiques\n• Connexion outils (CRM, ERP, APIs)\n• Reporting et alertes automatiques\n• Workflows sur mesure\n\n💰 **Tarifs** : 3 000€ - 15 000€`,
          keywords: ['automatisation', 'automatiser', 'workflow', 'automation']
        },
        rag: {
          response: `🧠 **RAG-as-a-Service**\n\n• IA avec accès à vos documents\n• Recherche intelligente instantanée\n• Base de connaissances IA\n• Conformité RGPD\n\n💰 **Tarifs** : 1 500€ - 10 000€/mois`,
          keywords: ['rag', 'données', 'documents', 'knowledge', 'recherche']
        },
        ragLocal: {
          response: `🖥️ **RAG Physique (On-Premise)**\n\n• Mac Studio/Mini dédié à votre entreprise\n• 100% local, données jamais dans le cloud\n• Installation + formation incluses\n• Maintenance et support\n\n💰 **Tarifs** : 8 000€ - 25 000€`,
          keywords: ['mac', 'studio', 'mini', 'local', 'physique', 'matériel', 'on-premise']
        },
        formation: {
          response: `📚 **Formation Prompt Engineering**\n\n• Techniques avancées de prompting\n• Cas pratiques adaptés à votre métier\n• Ateliers hands-on interactifs\n• Certification incluse\n\n💰 **Tarifs** : 800€ - 3 000€`,
          keywords: ['formation', 'former', 'apprendre', 'cours', 'training', 'prompt']
        },
        consulting: {
          response: `🔍 **Audit & Consulting IA**\n\n• Analyse de vos processus actuels\n• Identification opportunités IA\n• Roadmap transformation digitale\n• Accompagnement personnalisé\n\n💰 **Tarifs** : 500€ - 5 000€`,
          keywords: ['audit', 'conseil', 'consulting', 'stratégie']
        },
        meeting: {
          response: `📅 Excellent choix ! Je vous ouvre notre calendrier de réservation.\n\nChoisissez un créneau de 30 min pour un appel découverte gratuit.`,
          action: 'calendly',
          keywords: ['rendez-vous', 'rdv', 'appel', 'rencontrer', 'call', 'calendly', 'réserver']
        },
        whatsapp: {
          response: `📱 Je vous redirige vers WhatsApp pour discuter directement avec notre équipe.`,
          action: 'whatsapp',
          keywords: ['whatsapp', 'wa', 'téléphone', 'sms']
        },
        contact: {
          response: `📧 **Nos coordonnées :**\n\n📩 Email : contact@aiandbeyond.eu\n📱 WhatsApp : +351 920 833 889\n📅 Calendly : calendly.com/ai-and-beyond\n🌐 Site : aiandbeyond.eu`,
          keywords: ['contact', 'email', 'humain', 'personne', 'coordonnées']
        },
        thanks: {
          response: `Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions.`,
          keywords: ['merci', 'thanks', 'super', 'parfait', 'génial', 'excellent']
        },
        confirm: {
          askConfirm: "Je transmets votre demande à notre équipe ? Vous recevrez un retour sous 24-48h.",
          confirmed: `🎉 **Demande transmise !**\n\nNotre équipe vous contactera très rapidement à l'adresse {email}.\n\nMerci de votre confiance !`,
          keywords: ['oui', 'ok', "d'accord", 'yes', 'allons-y', 'envoyez', 'confirme']
        },
        decline: {
          response: `Pas de problème ! 😊 Je reste disponible si besoin. N'hésitez pas à revenir.`,
          keywords: ['non', 'pas maintenant', 'plus tard', 'annuler']
        },
        needEmail: "Pour continuer, j'aurais besoin de votre email 📧",
        default: "Je peux vous aider avec nos services IA. Que recherchez-vous exactement ?",
        placeholder: "Tapez votre message..."
      },
      en: {
        welcome: `👋 Hello! I'm ${this.config.botName}, your AI assistant at ${this.config.companyName}.\n\nHow can I help you today?`,
        quickReplies: {
          initial: ['Discover our services', 'Get a quote', 'Book a meeting'],
          services: ['AI Bots', 'Automation', 'RAG', 'Training'],
          quote: ['Receive by email', 'Book a call', 'I have questions'],
          thanks: ['Another question', 'Book a call', 'Contact']
        },
        greetings: {
          response: "Hello! 👋 How can I help you today?",
          keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon']
        },
        services: {
          title: "🚀 Our AI Services",
          list: `Here are our solutions to transform your business:\n\n🤖 **AI Bots** (€2-8K) - Smart assistants\n⚡ **Automation** (€3-15K) - Optimized workflows\n🧠 **RAG Cloud** (€1.5-10K/mo) - AI on your data\n🖥️ **RAG Local** (€8-25K) - 100% private solution\n📚 **Training** (€0.8-3K) - Prompt Engineering\n🔍 **AI Audit** (€0.5-5K) - Transformation strategy`,
          keywords: ['service', 'offer', 'provide', 'do you', 'what']
        },
        quote: {
          askEmail: "Perfect! 📝 To send you a personalized quote, what's your email?",
          askService: "What type of project interests you?",
          keywords: ['quote', 'price', 'cost', 'rate', 'how much', 'budget', 'estimate']
        },
        bots: {
          response: `🤖 **AI Conversational Bots**\n\n• 24/7 intelligent customer support\n• Automatic lead qualification\n• Appointment booking & FAQ\n• WhatsApp, website, CRM integration\n\n💰 **Pricing**: €2,000 - €8,000`,
          keywords: ['bot', 'chatbot', 'assistant']
        },
        automation: {
          response: `⚡ **Intelligent Automation**\n\n• Automatic emails and follow-ups\n• Tool integration (CRM, ERP, APIs)\n• Automatic reporting and alerts\n• Custom workflows\n\n💰 **Pricing**: €3,000 - €15,000`,
          keywords: ['automation', 'automate', 'workflow', 'process']
        },
        rag: {
          response: `🧠 **RAG-as-a-Service**\n\n• AI with access to your documents\n• Instant intelligent search\n• AI knowledge base\n• GDPR compliant\n\n💰 **Pricing**: €1,500 - €10,000/month`,
          keywords: ['rag', 'data', 'documents', 'knowledge', 'search']
        },
        ragLocal: {
          response: `🖥️ **Physical RAG (On-Premise)**\n\n• Dedicated Mac Studio/Mini for your company\n• 100% local, data never in the cloud\n• Installation + training included\n• Maintenance and support\n\n💰 **Pricing**: €8,000 - €25,000`,
          keywords: ['mac', 'studio', 'mini', 'local', 'physical', 'hardware', 'on-premise']
        },
        formation: {
          response: `📚 **Prompt Engineering Training**\n\n• Advanced prompting techniques\n• Practical cases for your industry\n• Interactive hands-on workshops\n• Certification included\n\n💰 **Pricing**: €800 - €3,000`,
          keywords: ['training', 'learn', 'course', 'prompt', 'workshop']
        },
        consulting: {
          response: `🔍 **AI Audit & Consulting**\n\n• Analysis of your current processes\n• AI opportunity identification\n• Digital transformation roadmap\n• Personalized support\n\n💰 **Pricing**: €500 - €5,000`,
          keywords: ['audit', 'consulting', 'strategy', 'advice']
        },
        meeting: {
          response: `📅 Excellent choice! I'm opening our booking calendar.\n\nChoose a 30-min slot for a free discovery call.`,
          action: 'calendly',
          keywords: ['meeting', 'appointment', 'call', 'book', 'calendly', 'schedule']
        },
        whatsapp: {
          response: `📱 I'm redirecting you to WhatsApp to chat directly with our team.`,
          action: 'whatsapp',
          keywords: ['whatsapp', 'wa', 'phone', 'sms']
        },
        contact: {
          response: `📧 **Our contact details:**\n\n📩 Email: contact@aiandbeyond.eu\n📱 WhatsApp: +351 920 833 889\n📅 Calendly: calendly.com/ai-and-beyond\n🌐 Website: aiandbeyond.eu`,
          keywords: ['contact', 'email', 'human', 'person', 'coordinates']
        },
        thanks: {
          response: `You're welcome! 😊 Feel free to ask if you have more questions.`,
          keywords: ['thanks', 'thank you', 'great', 'perfect', 'excellent', 'awesome']
        },
        confirm: {
          askConfirm: "Should I send your request to our team? You'll receive a response within 24-48h.",
          confirmed: `🎉 **Request submitted!**\n\nOur team will contact you very soon at {email}.\n\nThank you for your trust!`,
          keywords: ['yes', 'ok', 'sure', 'go ahead', 'send', 'confirm']
        },
        decline: {
          response: `No problem! 😊 I'm here if you need anything. Feel free to come back.`,
          keywords: ['no', 'not now', 'later', 'cancel']
        },
        needEmail: "To continue, I would need your email 📧",
        default: "I can help you with our AI services. What are you looking for exactly?",
        placeholder: "Type your message..."
      },
      pt: {
        welcome: `👋 Olá! Sou ${this.config.botName}, sua assistente de IA na ${this.config.companyName}.\n\nComo posso ajudá-lo hoje?`,
        quickReplies: {
          initial: ['Descobrir serviços', 'Pedir orçamento', 'Agendar reunião'],
          services: ['Bots IA', 'Automação', 'RAG', 'Formação'],
          quote: ['Receber por email', 'Agendar chamada', 'Tenho dúvidas'],
          thanks: ['Outra pergunta', 'Agendar chamada', 'Contacto']
        },
        greetings: {
          response: "Olá! 👋 Como posso ajudá-lo hoje?",
          keywords: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hey']
        },
        services: {
          title: "🚀 Nossos Serviços IA",
          list: `Aqui estão nossas soluções para transformar seu negócio:\n\n🤖 **Bots IA** (€2-8K) - Assistentes inteligentes\n⚡ **Automação** (€3-15K) - Workflows otimizados\n🧠 **RAG Cloud** (€1.5-10K/mês) - IA nos seus dados\n🖥️ **RAG Local** (€8-25K) - Solução 100% privada\n📚 **Formação** (€0.8-3K) - Prompt Engineering\n🔍 **Auditoria IA** (€0.5-5K) - Estratégia de transformação`,
          keywords: ['serviço', 'oferecem', 'fazem', 'o que']
        },
        quote: {
          askEmail: "Perfeito! 📝 Para enviar um orçamento personalizado, qual é o seu email?",
          askService: "Que tipo de projeto lhe interessa?",
          keywords: ['orçamento', 'preço', 'custo', 'tarifa', 'quanto', 'budget', 'estimativa']
        },
        bots: {
          response: `🤖 **Bots Conversacionais IA**\n\n• Suporte ao cliente 24/7 inteligente\n• Qualificação automática de leads\n• Agendamento e FAQ automatizados\n• Integração WhatsApp, site, CRM\n\n💰 **Preços**: €2.000 - €8.000`,
          keywords: ['bot', 'chatbot', 'assistente']
        },
        automation: {
          response: `⚡ **Automação Inteligente**\n\n• Emails e follow-ups automáticos\n• Integração de ferramentas (CRM, ERP, APIs)\n• Relatórios e alertas automáticos\n• Workflows personalizados\n\n💰 **Preços**: €3.000 - €15.000`,
          keywords: ['automação', 'automatizar', 'workflow', 'processo']
        },
        rag: {
          response: `🧠 **RAG-as-a-Service**\n\n• IA com acesso aos seus documentos\n• Pesquisa inteligente instantânea\n• Base de conhecimento IA\n• Conformidade RGPD\n\n💰 **Preços**: €1.500 - €10.000/mês`,
          keywords: ['rag', 'dados', 'documentos', 'conhecimento', 'pesquisa']
        },
        ragLocal: {
          response: `🖥️ **RAG Físico (On-Premise)**\n\n• Mac Studio/Mini dedicado à sua empresa\n• 100% local, dados nunca na nuvem\n• Instalação + formação incluídas\n• Manutenção e suporte\n\n💰 **Preços**: €8.000 - €25.000`,
          keywords: ['mac', 'studio', 'mini', 'local', 'físico', 'hardware', 'on-premise']
        },
        formation: {
          response: `📚 **Formação Prompt Engineering**\n\n• Técnicas avançadas de prompting\n• Casos práticos para seu setor\n• Workshops práticos interativos\n• Certificação incluída\n\n💰 **Preços**: €800 - €3.000`,
          keywords: ['formação', 'treinamento', 'aprender', 'curso', 'workshop']
        },
        consulting: {
          response: `🔍 **Auditoria & Consultoria IA**\n\n• Análise dos seus processos atuais\n• Identificação de oportunidades IA\n• Roadmap de transformação digital\n• Acompanhamento personalizado\n\n💰 **Preços**: €500 - €5.000`,
          keywords: ['auditoria', 'consultoria', 'estratégia', 'conselho']
        },
        meeting: {
          response: `📅 Excelente escolha! Estou abrindo nosso calendário de reservas.\n\nEscolha um horário de 30 min para uma chamada de descoberta gratuita.`,
          action: 'calendly',
          keywords: ['reunião', 'encontro', 'chamada', 'agendar', 'calendly', 'marcar']
        },
        whatsapp: {
          response: `📱 Estou redirecionando para o WhatsApp para conversar diretamente com nossa equipe.`,
          action: 'whatsapp',
          keywords: ['whatsapp', 'wa', 'telefone', 'sms']
        },
        contact: {
          response: `📧 **Nossos contactos:**\n\n📩 Email: contact@aiandbeyond.eu\n📱 WhatsApp: +351 920 833 889\n📅 Calendly: calendly.com/ai-and-beyond\n🌐 Site: aiandbeyond.eu`,
          keywords: ['contacto', 'email', 'humano', 'pessoa', 'coordenadas']
        },
        thanks: {
          response: `De nada! 😊 Não hesite se tiver mais perguntas.`,
          keywords: ['obrigado', 'obrigada', 'ótimo', 'perfeito', 'excelente', 'muito bom']
        },
        confirm: {
          askConfirm: "Devo enviar seu pedido para nossa equipe? Receberá uma resposta em 24-48h.",
          confirmed: `🎉 **Pedido enviado!**\n\nNossa equipe entrará em contacto muito em breve em {email}.\n\nObrigado pela confiança!`,
          keywords: ['sim', 'ok', 'claro', 'pode ser', 'enviar', 'confirmar']
        },
        decline: {
          response: `Sem problema! 😊 Estou aqui se precisar. Volte quando quiser.`,
          keywords: ['não', 'agora não', 'mais tarde', 'cancelar']
        },
        needEmail: "Para continuar, precisaria do seu email 📧",
        default: "Posso ajudá-lo com nossos serviços de IA. O que procura exatamente?",
        placeholder: "Digite sua mensagem..."
      }
    };

    // Initialisation
    this.init();
  }

  /**
   * Détection automatique de la langue
   */
  detectLanguage() {
    // 1. Vérifier l'URL
    const path = window.location.pathname;
    if (path.startsWith('/en/') || path.includes('/en/')) return 'en';
    if (path.startsWith('/pt/') || path.includes('/pt/')) return 'pt';
    
    // 2. Vérifier l'attribut lang du HTML
    const htmlLang = document.documentElement.lang;
    if (htmlLang) {
      if (htmlLang.startsWith('en')) return 'en';
      if (htmlLang.startsWith('pt')) return 'pt';
      if (htmlLang.startsWith('fr')) return 'fr';
    }
    
    // 3. Vérifier le localStorage
    const storedLang = localStorage.getItem('preferred-language');
    if (storedLang && ['fr', 'en', 'pt'].includes(storedLang)) {
      return storedLang;
    }
    
    // Par défaut : français
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

    // Log pour debug
    console.log(`🤖 Lyra initialized (${this.lang})`);
  }

  /**
   * Injection du CSS (fallback si fichier externe non chargé)
   */
  injectCSS() {
    // Vérifier si le CSS est déjà chargé
    const existingLink = document.querySelector('link[href*="lyra-premium.css"]');
    if (existingLink) return;

    // Sinon injecter le lien
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
      <!-- Bouton déclencheur -->
      <button id="lyra-trigger" class="pulse" aria-label="Open chat with ${this.config.botName}">
        ${this.config.showBadge ? '<span class="lyra-badge">1</span>' : ''}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>

      <!-- Conteneur Chat -->
      <div id="lyra-container" role="dialog" aria-label="Chat with ${this.config.botName}">
        <!-- Header -->
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

        <!-- Messages -->
        <div id="lyra-messages"></div>

        <!-- Input -->
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

        <!-- Powered by -->
        <div class="lyra-powered">
          Powered by <a href="https://aiandbeyond.eu" target="_blank">AI & Beyond</a>
        </div>
      </div>
    `;
    document.body.appendChild(widget);
  }

  /**
   * Attacher les événements
   */
  attachEventListeners() {
    // Toggle chat
    document.getElementById('lyra-trigger').addEventListener('click', () => this.toggleChat());
    document.getElementById('lyra-close').addEventListener('click', () => this.toggleChat());
    
    // Send message
    document.getElementById('lyra-send').addEventListener('click', () => this.handleSend());
    document.getElementById('lyra-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });

    // Fermer avec Escape
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
      
      // Masquer le badge après ouverture
      if (badge) badge.style.display = 'none';
      
      // Analytics
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
  processUserMessage(message) {
    this.addUserMessage(message);
    this.showTyping();
    
    // Extraction d'informations
    this.extractInfo(message);
    
    // Générer réponse avec délai réaliste
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
      this.hideTyping();
      const response = this.generateResponse(message);
      this.addBotMessage(response.message, response.quickReplies);
      
      // Actions spéciales
      if (response.action === 'calendly') {
        setTimeout(() => window.open(this.config.calendlyUrl, '_blank'), 800);
      }
      if (response.action === 'whatsapp') {
        setTimeout(() => window.open(`https://wa.me/${this.config.whatsapp.replace(/[^0-9]/g, '')}`, '_blank'), 800);
      }
    }, delay);
  }

  /**
   * Génération de la réponse
   */
  generateResponse(message) {
    const lower = message.toLowerCase();
    const msgs = this.messages[this.lang];

    // Salutations
    if (this.matchKeywords(lower, msgs.greetings.keywords)) {
      return { message: msgs.greetings.response, quickReplies: msgs.quickReplies.initial };
    }

    // Services
    if (this.matchKeywords(lower, msgs.services.keywords)) {
      return { message: msgs.services.list, quickReplies: msgs.quickReplies.services };
    }

    // Devis
    if (this.matchKeywords(lower, msgs.quote.keywords)) {
      if (!this.collectedInfo.email) {
        this.conversationStage = 'collecting_email';
        return { message: msgs.quote.askEmail, quickReplies: [] };
      }
      return { message: msgs.quote.askService, quickReplies: msgs.quickReplies.services };
    }

    // Bots
    if (this.matchKeywords(lower, msgs.bots.keywords)) {
      this.collectedInfo.service = 'bots';
      return { message: msgs.bots.response, quickReplies: ['Obtenir un devis', 'Prendre RDV'] };
    }

    // Automatisation
    if (this.matchKeywords(lower, msgs.automation.keywords)) {
      this.collectedInfo.service = 'automation';
      return { message: msgs.automation.response, quickReplies: ['Obtenir un devis', 'Prendre RDV'] };
    }

    // RAG
    if (this.matchKeywords(lower, msgs.rag.keywords)) {
      this.collectedInfo.service = 'rag';
      return { message: msgs.rag.response, quickReplies: ['Obtenir un devis', 'RAG Local'] };
    }

    // RAG Local
    if (this.matchKeywords(lower, msgs.ragLocal.keywords)) {
      this.collectedInfo.service = 'ragPhysique';
      return { message: msgs.ragLocal.response, quickReplies: ['Obtenir un devis', 'Prendre RDV'] };
    }

    // Formation
    if (this.matchKeywords(lower, msgs.formation.keywords)) {
      this.collectedInfo.service = 'formation';
      return { message: msgs.formation.response, quickReplies: ['Obtenir un devis', 'Programme'] };
    }

    // Consulting
    if (this.matchKeywords(lower, msgs.consulting.keywords)) {
      this.collectedInfo.service = 'consulting';
      return { message: msgs.consulting.response, quickReplies: ['Prendre RDV', 'Obtenir un devis'] };
    }

    // RDV / Meeting
    if (this.matchKeywords(lower, msgs.meeting.keywords)) {
      return { message: msgs.meeting.response, quickReplies: ['WhatsApp', 'Email'], action: 'calendly' };
    }

    // WhatsApp
    if (this.matchKeywords(lower, msgs.whatsapp.keywords)) {
      return { message: msgs.whatsapp.response, quickReplies: [], action: 'whatsapp' };
    }

    // Contact
    if (this.matchKeywords(lower, msgs.contact.keywords)) {
      return { message: msgs.contact.response, quickReplies: ['Calendly', 'WhatsApp'] };
    }

    // Merci
    if (this.matchKeywords(lower, msgs.thanks.keywords)) {
      return { message: msgs.thanks.response, quickReplies: msgs.quickReplies.thanks };
    }

    // Confirmation
    if (this.matchKeywords(lower, msgs.confirm.keywords)) {
      if (this.collectedInfo.email && this.conversationStage === 'closing') {
        this.sendLead();
        const confirmed = msgs.confirm.confirmed.replace('{email}', this.collectedInfo.email);
        return { message: confirmed, quickReplies: [] };
      }
      return { message: msgs.default, quickReplies: msgs.quickReplies.initial };
    }

    // Refus
    if (this.matchKeywords(lower, msgs.decline.keywords)) {
      this.conversationStage = 'initial';
      return { message: msgs.decline.response, quickReplies: msgs.quickReplies.initial };
    }

    // Email détecté
    if (this.containsEmail(message)) {
      const email = this.extractEmail(message);
      this.collectedInfo.email = email;
      this.conversationStage = 'qualifying';
      this.leadScore += 3;
      
      let response = this.lang === 'fr' ? `Parfait ! 📧 J'ai noté ${email}.\n\nQuel est votre besoin principal ?` :
                     this.lang === 'en' ? `Perfect! 📧 I've noted ${email}.\n\nWhat's your main need?` :
                     `Perfeito! 📧 Anotei ${email}.\n\nQual é sua principal necessidade?`;
      
      return { message: response, quickReplies: msgs.quickReplies.services };
    }

    // Collecte email en cours
    if (this.conversationStage === 'collecting_email') {
      return { message: msgs.needEmail, quickReplies: [] };
    }

    // Qualification en cours
    if (this.conversationStage === 'qualifying') {
      this.collectedInfo.need = message;
      this.conversationStage = 'closing';
      
      // Génération estimation si service sélectionné
      let estimate = '';
      if (this.collectedInfo.service && this.services[this.collectedInfo.service]) {
        const s = this.services[this.collectedInfo.service];
        const suffix = s.monthly ? '/mois' : '';
        estimate = `\n\n💼 Estimation : ${s.priceMin.toLocaleString()}€ - ${s.priceMax.toLocaleString()}€${suffix}`;
      }
      
      return { 
        message: (this.lang === 'fr' ? `Merci pour ces détails ! 📝${estimate}\n\n` : 
                  this.lang === 'en' ? `Thanks for these details! 📝${estimate}\n\n` :
                  `Obrigado por estes detalhes! 📝${estimate}\n\n`) + msgs.confirm.askConfirm,
        quickReplies: msgs.quickReplies.quote
      };
    }

    // Réponse par défaut
    return { message: msgs.default, quickReplies: msgs.quickReplies.initial };
  }

  /**
   * Vérifier si des mots-clés correspondent
   */
  matchKeywords(text, keywords) {
    if (!keywords) return false;
    return keywords.some(kw => text.includes(kw.toLowerCase()));
  }

  /**
   * Extraction d'informations du message
   */
  extractInfo(message) {
    // Email
    const email = this.extractEmail(message);
    if (email) {
      this.collectedInfo.email = email;
      this.leadScore += 3;
    }
    
    // Téléphone
    const phoneMatch = message.match(/(?:\+|00)?[0-9\s.\-()]{9,}/);
    if (phoneMatch) {
      this.collectedInfo.phone = phoneMatch[0].replace(/\s/g, '');
      this.leadScore += 2;
    }
    
    // Budget mentionné
    if (/\d+\s*[kK€$]|\d{4,}/.test(message)) {
      this.leadScore += 2;
    }
    
    // Urgence
    if (/urgent|rapidement|vite|asap|quickly|soon/i.test(message)) {
      this.leadScore += 1;
    }
  }

  /**
   * Vérifier si le message contient un email
   */
  containsEmail(text) {
    return /[\w.-]+@[\w.-]+\.\w{2,}/.test(text);
  }

  /**
   * Extraire l'email du message
   */
  extractEmail(text) {
    const match = text.match(/[\w.-]+@[\w.-]+\.\w{2,}/);
    return match ? match[0].toLowerCase() : null;
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
    
    // Historique
    this.conversationHistory.push({ role: 'user', content: text, timestamp: Date.now() });
  }

  /**
   * Ajouter un message bot
   */
  addBotMessage(text, quickReplies = []) {
    const container = document.getElementById('lyra-messages');
    
    // Message
    const div = document.createElement('div');
    div.className = 'lyra-message bot';
    div.innerHTML = this.formatMessage(text);
    container.appendChild(div);
    
    // Quick replies
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
    
    // Historique
    this.conversationHistory.push({ role: 'bot', content: text, timestamp: Date.now() });
  }

  /**
   * Formater le message (markdown simplifié)
   */
  formatMessage(text) {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
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
   * Envoi du lead
   */
  sendLead() {
    const data = {
      ...this.collectedInfo,
      leadScore: this.leadScore,
      language: this.lang,
      conversationHistory: this.conversationHistory,
      source: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    console.log('📧 Lead Lyra:', data);
    
    // Netlify Forms
    const formData = new URLSearchParams();
    formData.append('form-name', 'lyra-leads');
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && typeof value !== 'object') {
        formData.append(key, value);
      }
    });
    // Ajouter l'historique en JSON
    formData.append('conversation', JSON.stringify(this.conversationHistory));
    
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
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', eventName, {
        event_category: 'Lyra Chat',
        ...data
      });
    }
    
    // Console pour debug
    console.log(`📊 Event: ${eventName}`, data);
  }
}

// =========================================
// INITIALISATION AUTOMATIQUE
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  // Fusionner avec config externe si présente
  const config = window.LYRA_CONFIG || window.AI_BOT_CONFIG || {};
  
  // Créer l'instance
  window.lyra = new LyraChatBot(config);
});

// Export pour modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LyraChatBot;
}
