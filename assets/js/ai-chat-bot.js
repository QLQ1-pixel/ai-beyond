// AI & Beyond - Chat Bot Intelligent
// Partie 1 : Interface utilisateur et gestion du widget

class AIChatBot {
  constructor(config = {}) {
    this.config = {
      apiEndpoint: config.apiEndpoint || '/api/chat',
      botName: config.botName || 'Lyra',
      botRole: config.botRole || 'Assistante IA',
      companyName: config.companyName || 'AI & Beyond',
      primaryColor: config.primaryColor || '#6366f1',
      ...config
    };
    
    this.isOpen = false;
    this.conversationId = this.generateConversationId();
    this.conversationHistory = [];
    this.userInfo = {};
    
    this.init();
  }
  
  generateConversationId() {
    return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  init() {
    this.injectStyles();
    this.injectHTML();
    this.attachEventListeners();
    this.showWelcomeMessage();
  }
  
  injectStyles() {
    // Les styles sont déjà dans main.css, mais on peut ajouter des overrides dynamiques
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      
      #chat-container.active {
        animation: slideIn 0.3s ease-out;
      }
      
      .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 12px;
      }
      
      .typing-indicator span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #94a3b8;
        animation: typing 1.4s infinite;
      }
      
      .typing-indicator span:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .typing-indicator span:nth-child(3) {
        animation-delay: 0.4s;
      }
      
      @keyframes typing {
        0%, 60%, 100% {
          transform: translateY(0);
        }
        30% {
          transform: translateY(-10px);
        }
      }
      
      .quick-reply {
        display: inline-block;
        margin: 4px;
        padding: 8px 16px;
        background: white;
        border: 2px solid ${this.config.primaryColor};
        color: ${this.config.primaryColor};
        border-radius: 20px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
      }
      
      .quick-reply:hover {
        background: ${this.config.primaryColor};
        color: white;
      }
    `;
    document.head.appendChild(style);
  }
  
  injectHTML() {
    const widget = document.createElement('div');
    widget.id = 'ai-chat-widget';
    widget.innerHTML = `
      <button id="chat-button" aria-label="Ouvrir le chat d'assistance IA">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      </button>
      
      <div id="chat-container">
        <div id="chat-header">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
              </div>
              <div>
                <div class="font-semibold">${this.config.botName}</div>
                <div class="text-xs opacity-90">${this.config.botRole}</div>
              </div>
            </div>
            <button id="chat-close" class="text-white hover:bg-white/20 rounded-full p-2" aria-label="Fermer le chat">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div id="chat-messages"></div>
        
        <div id="chat-input-container">
          <form id="chat-form" class="flex gap-2">
            <input 
              type="text" 
              id="chat-input" 
              placeholder="Tapez votre message..."
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autocomplete="off"
            />
            <button 
              type="submit" 
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
              aria-label="Envoyer le message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    `;
    
    document.body.appendChild(widget);
  }
  
  attachEventListeners() {
    const chatButton = document.getElementById('chat-button');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    
    chatButton.addEventListener('click', () => this.toggleChat());
    chatClose.addEventListener('click', () => this.toggleChat());
    
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = chatInput.value.trim();
      if (message) {
        this.sendMessage(message);
        chatInput.value = '';
      }
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
      this.addMessage('bot', `
        👋 Bonjour ! Je suis ${this.config.botName}, votre assistante IA chez ${this.config.companyName}.
        
        Je peux vous aider à :
        • Découvrir nos services IA
        • Obtenir un devis personnalisé
        • Répondre à vos questions
        • Planifier un rendez-vous
        
        Par quoi souhaitez-vous commencer ?
      `, [
        'Obtenir un devis',
        'Découvrir vos services',
        'Poser une question',
        'Planifier un RDV'
      ]);
    }, 1000);
  }
  
  addMessage(sender, text, quickReplies = []) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    // Format le texte avec retours à la ligne
    const formattedText = text.trim().replace(/\n/g, '<br>');
    messageDiv.innerHTML = formattedText;
    
    messagesContainer.appendChild(messageDiv);
    
    // Ajouter les quick replies si présents
    if (quickReplies.length > 0) {
      const quickRepliesDiv = document.createElement('div');
      quickRepliesDiv.className = 'message bot';
      quickRepliesDiv.style.background = 'transparent';
      quickRepliesDiv.style.boxShadow = 'none';
      
      quickReplies.forEach(reply => {
        const button = document.createElement('button');
        button.className = 'quick-reply';
        button.textContent = reply;
        button.onclick = () => {
          this.sendMessage(reply);
          quickRepliesDiv.remove();
        };
        quickRepliesDiv.appendChild(button);
      });
      
      messagesContainer.appendChild(quickRepliesDiv);
    }
    
    // Scroll vers le bas
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Sauvegarder dans l'historique
    this.conversationHistory.push({
      role: sender === 'bot' ? 'assistant' : 'user',
      content: text.trim()
    });
  }
  
  showTypingIndicator() {
    const messagesContainer = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message bot typing-indicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
  
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }
  
  async sendMessage(message) {
    // Afficher le message utilisateur
    this.addMessage('user', message);
    
    // Afficher l'indicateur de saisie
    this.showTypingIndicator();
    
    try {
      // Appeler l'API du bot (sera implémenté dans la partie 2)
      const response = await this.callBotAPI(message);
      
      this.hideTypingIndicator();
      
      // Afficher la réponse du bot
      this.addMessage('bot', response.message, response.quickReplies || []);
      
      // Gérer les actions spéciales (collecte d'infos, webhooks, etc.)
      if (response.action) {
        this.handleBotAction(response.action, response.data);
      }
    } catch (error) {
      this.hideTypingIndicator();
      this.addMessage('bot', 
        "Désolé, j'ai rencontré une erreur. Pouvez-vous réessayer ou me contacter directement à contact@aiandbeyond.eu ?"
      );
      console.error('Bot error:', error);
    }
  }
  
  async callBotAPI(message) {
    // Cette fonction sera complétée dans la partie 2
    // Pour l'instant, simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "Je traite votre demande...",
          quickReplies: []
        });
      }, 1000);
    });
  }
  
  handleBotAction(action, data) {
    switch(action) {
      case 'collect_email':
        // Ouvrir un formulaire de collecte d'email
        break;
      case 'schedule_meeting':
        // Ouvrir Calendly
        window.open('https://calendly.com/ai-and-beyond', '_blank');
        break;
      case 'send_quote':
        // Envoyer le devis par webhook
        this.sendToWebhook('quote', data);
        break;
      case 'qualify_lead':
        // Qualifier et envoyer le lead
        this.sendToWebhook('lead', data);
        break;
    }
  }
  
  async sendToWebhook(type, data) {
    try {
      await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          conversationId: this.conversationId,
          data,
          userInfo: this.userInfo,
          history: this.conversationHistory,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }
}

// Fonction d'initialisation
function initAIChatBot(config = {}) {
  window.aiChatBot = new AIChatBot(config);
}

// Auto-initialisation si le script est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initAIChatBot());
} else {
  initAIChatBot();
}
