// AI & Beyond - Chat Bot Lyra (Version Complète)
// Interface + Intelligence intégrées

class AIChatBot {
  constructor(config = {}) {
    this.config = {
      botName: config.botName || 'Lyra',
      botRole: config.botRole || 'Assistante IA',
      companyName: config.companyName || 'AI & Beyond',
      primaryColor: config.primaryColor || '#6366f1',
      whatsappNumber: '+351920833889',
      ...config
    };
    
    this.isOpen = false;
    this.conversationHistory = [];
    
    // Intelligence du bot
    this.services = {
      bots: { name: "Bots Conversationnels", prix_min: 2000, prix_max: 8000 },
      automatisation: { name: "Automatisation Workflows", prix_min: 3000, prix_max: 15000 },
      rag: { name: "RAG-as-a-Service", prix_min: 1500, prix_max: 10000, monthly: true },
      ragPhysique: { name: "RAG Physique", prix_min: 8000, prix_max: 25000 },
      consulting: { name: "Consulting & Audit IA", prix_min: 500, prix_max: 5000 },
      formation: { name: "Formation Prompt Engineering", prix_min: 800, prix_max: 3000 }
    };
    
    this.collectedInfo = { email: null, phone: null, need: null, service: null, budget: null };
    this.conversationStage = 'initial';
    
    this.init();
  }
  
  init() {
    this.injectStyles();
    this.injectHTML();
    this.attachEventListeners();
    this.showWelcomeMessage();
  }
  
  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #ai-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Inter', sans-serif; }
      #chat-button { width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; border: none; cursor: pointer; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4); transition: transform 0.3s ease; display: flex; align-items: center; justify-content: center; }
      #chat-button:hover { transform: scale(1.1); }
      #chat-container { display: none; position: fixed; bottom: 90px; right: 20px; width: 380px; max-width: calc(100vw - 40px); height: 500px; max-height: calc(100vh - 120px); background: white; border-radius: 16px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); overflow: hidden; flex-direction: column; }
      #chat-container.active { display: flex; }
      #chat-header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 16px; display: flex; align-items: center; justify-content: space-between; }
      #chat-header .bot-info { display: flex; align-items: center; gap: 12px; }
      #chat-header .bot-avatar { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
      #chat-header .bot-name { font-weight: 600; }
      #chat-header .bot-role { font-size: 12px; opacity: 0.9; }
      #chat-close { background: none; border: none; color: white; cursor: pointer; padding: 8px; border-radius: 50%; }
      #chat-close:hover { background: rgba(255,255,255,0.2); }
      #chat-messages { flex: 1; overflow-y: auto; padding: 16px; background: #f8fafc; display: flex; flex-direction: column; gap: 12px; }
      .message { max-width: 85%; padding: 12px 16px; border-radius: 16px; line-height: 1.5; font-size: 14px; }
      .message.bot { background: white; align-self: flex-start; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-bottom-left-radius: 4px; }
      .message.user { background: #6366f1; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
      .quick-replies { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
      .quick-reply { background: white; border: 2px solid #6366f1; color: #6366f1; padding: 8px 16px; border-radius: 20px; font-size: 13px; cursor: pointer; transition: all 0.2s; }
      .quick-reply:hover { background: #6366f1; color: white; }
      #chat-input-container { padding: 16px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; }
      #chat-input { flex: 1; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 24px; outline: none; font-size: 14px; }
      #chat-input:focus { border-color: #6366f1; }
      #chat-send { width: 44px; height: 44px; border-radius: 50%; background: #6366f1; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
      #chat-send:hover { background: #5558e3; }
      .typing { display: flex; gap: 4px; padding: 12px 16px; }
      .typing span { width: 8px; height: 8px; background: #94a3b8; border-radius: 50%; animation: bounce 1.4s infinite; }
      .typing span:nth-child(2) { animation-delay: 0.2s; }
      .typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-8px); } }
    `;
    document.head.appendChild(style);
  }
  
  injectHTML() {
    const widget = document.createElement('div');
    widget.id = 'ai-chat-widget';
    widget.innerHTML = `
      <button id="chat-button" aria-label="Ouvrir le chat">
        <svg width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      <div id="chat-container">
        <div id="chat-header">
          <div class="bot-info">
            <div class="bot-avatar">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <div>
              <div class="bot-name">${this.config.botName}</div>
              <div class="bot-role">${this.config.botRole}</div>
            </div>
          </div>
          <button id="chat-close" aria-label="Fermer">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div id="chat-messages"></div>
        <div id="chat-input-container">
          <input type="text" id="chat-input" placeholder="Tapez votre message..." autocomplete="off" />
          <button id="chat-send" aria-label="Envoyer">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(widget);
  }
  
  attachEventListeners() {
    document.getElementById('chat-button').addEventListener('click', () => this.toggleChat());
    document.getElementById('chat-close').addEventListener('click', () => this.toggleChat());
    document.getElementById('chat-send').addEventListener('click', () => this.handleSend());
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.handleSend();
    });
  }
  
  toggleChat() {
    this.isOpen = !this.isOpen;
    const container = document.getElementById('chat-container');
    const button = document.getElementById('chat-button');
    if (this.isOpen) {
      container.classList.add('active');
      button.style.display = 'none';
      document.getElementById('chat-input').focus();
    } else {
      container.classList.remove('active');
      button.style.display = 'flex';
    }
  }
  
  showWelcomeMessage() {
    setTimeout(() => {
      this.addBotMessage(
        `👋 Bonjour ! Je suis ${this.config.botName}, votre assistante IA chez ${this.config.companyName}.\n\nComment puis-je vous aider ?`,
        ['Découvrir vos services', 'Obtenir un devis', 'Prendre rendez-vous']
      );
    }, 800);
  }
  
  handleSend() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
      input.value = '';
      this.processUserMessage(message);
    }
  }
  
  processUserMessage(message) {
    this.addUserMessage(message);
    this.showTyping();
    
    setTimeout(() => {
      this.hideTyping();
      const response = this.generateResponse(message);
      this.addBotMessage(response.message, response.quickReplies);
      
      if (response.action === 'open_calendly') {
        setTimeout(() => window.open('https://calendly.com/ai-and-beyond', '_blank'), 500);
      }
      if (response.action === 'open_whatsapp') {
        setTimeout(() => window.open('https://wa.me/351920833889', '_blank'), 500);
      }
    }, 800);
  }
  
  generateResponse(message) {
    const lower = message.toLowerCase();
    this.extractInfo(message);
    
    // Salutations
    if (this.match(lower, ['bonjour', 'salut', 'hello', 'bonsoir', 'hey', 'coucou'])) {
      return { message: `Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?`, quickReplies: ['Découvrir vos services', 'Obtenir un devis', 'Prendre rendez-vous'] };
    }
    
    // Services
    if (this.match(lower, ['service', 'proposez', 'offre', 'faites', 'quoi'])) {
      return { message: `Nos services IA :\n\n🤖 Bots IA (2-8K€)\n⚡ Automatisation (3-15K€)\n🧠 RAG Cloud (1.5-10K€/mois)\n🖥️ RAG Local (8-25K€)\n📚 Formation (0.8-3K€)\n🔍 Audit IA (0.5-5K€)\n\nQuel service vous intéresse ?`, quickReplies: ['Bots IA', 'Automatisation', 'RAG', 'Formation'] };
    }
    
    // Devis
    if (this.match(lower, ['devis', 'prix', 'coût', 'tarif', 'combien', 'budget', 'estimation'])) {
      if (!this.collectedInfo.email) {
        this.conversationStage = 'collecting_email';
        return { message: `Avec plaisir ! 📝 Pour vous envoyer un devis personnalisé, quel est votre email ?`, quickReplies: [] };
      }
      return { message: `Quel type de projet vous intéresse ?`, quickReplies: ['Bot IA', 'Automatisation', 'RAG', 'Audit'] };
    }
    
    // Bots
    if (this.match(lower, ['bot', 'chatbot', 'assistant'])) {
      this.collectedInfo.service = 'bots';
      return { message: `🤖 Nos Bots IA :\n\n• Support client 24/7\n• Qualification de leads\n• Prise de RDV automatique\n\n💰 Tarifs : 2 000€ - 8 000€`, quickReplies: ['Obtenir un devis', 'Prendre RDV'] };
    }
    
    // Automatisation
    if (this.match(lower, ['automatisation', 'automatiser', 'workflow', 'automation'])) {
      this.collectedInfo.service = 'automatisation';
      return { message: `⚡ Automatisation :\n\n• Emails et suivis auto\n• Connexion CRM/outils\n• Reporting automatique\n\n💰 Tarifs : 3 000€ - 15 000€`, quickReplies: ['Obtenir un devis', 'Prendre RDV'] };
    }
    
    // RAG
    if (this.match(lower, ['rag', 'données', 'documents', 'knowledge'])) {
      this.collectedInfo.service = 'rag';
      return { message: `🧠 RAG-as-a-Service :\n\n• IA sur vos documents\n• Recherche intelligente\n• Base de connaissances IA\n\n💰 Tarifs : 1 500€ - 10 000€/mois`, quickReplies: ['Obtenir un devis', 'RAG Local'] };
    }
    
    // RAG Physique
    if (this.match(lower, ['mac', 'studio', 'mini', 'local', 'physique', 'matériel'])) {
      this.collectedInfo.service = 'ragPhysique';
      return { message: `🖥️ RAG Physique :\n\n• Mac Studio/Mini dédié\n• 100% local, RGPD++\n• Installation + formation\n\n💰 Tarifs : 8 000€ - 25 000€`, quickReplies: ['Obtenir un devis', 'Prendre RDV'] };
    }
    
    // Formation
    if (this.match(lower, ['formation', 'former', 'apprendre', 'cours', 'training'])) {
      this.collectedInfo.service = 'formation';
      return { message: `📚 Formation Prompt Engineering :\n\n• Techniques avancées\n• Cas pratiques métier\n• Atelier hands-on\n\n💰 Tarifs : 800€ - 3 000€`, quickReplies: ['Obtenir un devis', 'Programme'] };
    }
    
    // Consulting
    if (this.match(lower, ['audit', 'conseil', 'consulting', 'stratégie'])) {
      this.collectedInfo.service = 'consulting';
      return { message: `🔍 Audit & Consulting IA :\n\n• Analyse de vos processus\n• Opportunités IA\n• Roadmap transformation\n\n💰 Tarifs : 500€ - 5 000€`, quickReplies: ['Prendre RDV', 'Obtenir un devis'] };
    }
    
    // Rendez-vous
    if (this.match(lower, ['rendez-vous', 'rdv', 'appel', 'rencontrer', 'call', 'calendly'])) {
      return { message: `📅 Réservez un créneau de 30 min !\n\nJe vous ouvre Calendly...`, quickReplies: ['WhatsApp', 'Email'], action: 'open_calendly' };
    }
    
    // WhatsApp
    if (this.match(lower, ['whatsapp', 'wa', 'téléphone'])) {
      return { message: `📱 Je vous redirige vers WhatsApp...`, quickReplies: [], action: 'open_whatsapp' };
    }
    
    // Contact humain
    if (this.match(lower, ['humain', 'personne', 'quelqu\'un', 'contact', 'email'])) {
      return { message: `📧 Email : contact@aiandbeyond.eu\n📱 WhatsApp : +351 920 833 889\n📅 Calendly : calendly.com/ai-and-beyond`, quickReplies: ['Calendly', 'WhatsApp'] };
    }
    
    // Merci
    if (this.match(lower, ['merci', 'thanks', 'super', 'parfait', 'génial'])) {
      return { message: `Avec plaisir ! 😊 À bientôt !`, quickReplies: ['Autre question', 'Prendre RDV'] };
    }
    
    // Email détecté
    if (this.containsEmail(lower)) {
      const email = this.extractEmail(message);
      this.collectedInfo.email = email;
      this.conversationStage = 'qualifying';
      return { message: `Parfait ! 📧 J'ai noté ${email}.\n\nQuel est votre besoin principal ?`, quickReplies: ['Bot IA', 'Automatisation', 'RAG', 'Formation'] };
    }
    
    // Oui / Confirmation
    if (this.match(lower, ['oui', 'ok', 'd\'accord', 'yes', 'allons-y', 'envoyez'])) {
      if (this.collectedInfo.email && this.conversationStage === 'closing') {
        this.sendLead();
        return { message: `🎉 Demande transmise !\n\nNotre équipe vous contactera sous 24-48h à ${this.collectedInfo.email}.\n\nMerci !`, quickReplies: [] };
      }
      return { message: `Que souhaitez-vous faire ?`, quickReplies: ['Obtenir un devis', 'Prendre RDV', 'Voir les services'] };
    }
    
    // Non
    if (this.match(lower, ['non', 'pas maintenant', 'plus tard'])) {
      return { message: `Pas de problème ! 😊 Je reste disponible si besoin.`, quickReplies: ['Voir les services', 'Contact'] };
    }
    
    // Collecte email en cours
    if (this.conversationStage === 'collecting_email') {
      return { message: `Pour continuer, j'ai besoin de votre email 📧`, quickReplies: [] };
    }
    
    // Qualification en cours
    if (this.conversationStage === 'qualifying') {
      this.collectedInfo.need = message;
      this.conversationStage = 'closing';
      let estimate = '';
      if (this.collectedInfo.service && this.services[this.collectedInfo.service]) {
        const s = this.services[this.collectedInfo.service];
        estimate = `\n\n💼 ${s.name} : ${s.prix_min.toLocaleString()}€ - ${s.prix_max.toLocaleString()}€${s.monthly ? '/mois' : ''}`;
      }
      return { message: `Merci ! 📝${estimate}\n\nJe transmets votre demande ? Notre équipe vous contactera sous 24-48h.`, quickReplies: ['Oui, envoyez !', 'J\'ai des questions'] };
    }
    
    // Réponse par défaut
    return { message: `Je peux vous aider avec nos services IA. Que recherchez-vous ?`, quickReplies: ['Voir les services', 'Obtenir un devis', 'Contact humain'] };
  }
  
  match(text, keywords) {
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
  }
  
  addUserMessage(text) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'message user';
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }
  
  addBotMessage(text, quickReplies = []) {
    const container = document.getElementById('chat-messages');
    
    const div = document.createElement('div');
    div.className = 'message bot';
    div.innerHTML = text.replace(/\n/g, '<br>');
    container.appendChild(div);
    
    if (quickReplies.length > 0) {
      const qrDiv = document.createElement('div');
      qrDiv.className = 'quick-replies';
      quickReplies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply';
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
  }
  
  showTyping() {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.id = 'typing';
    div.className = 'message bot typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }
  
  hideTyping() {
    const typing = document.getElementById('typing');
    if (typing) typing.remove();
  }
  
  sendLead() {
    const data = { ...this.collectedInfo, timestamp: new Date().toISOString() };
    console.log('📧 Lead Lyra:', data);
    
    // Netlify Forms
    const formData = new URLSearchParams();
    formData.append('form-name', 'lyra-leads');
    Object.keys(data).forEach(key => formData.append(key, data[key] || ''));
    
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() })
      .then(() => console.log('✅ Lead envoyé'))
      .catch(err => console.error('❌ Erreur:', err));
  }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
  window.aiChatBot = new AIChatBot(window.AI_BOT_CONFIG || {});
});
