// AI & Beyond - Système d'Intégrations
// Webhooks pour Email, WhatsApp Business, CRM

class IntegrationManager {
  constructor(config = {}) {
    this.config = {
      // Endpoints des différentes intégrations
      emailWebhook: config.emailWebhook || '/api/send-email',
      whatsappWebhook: config.whatsappWebhook || '/api/whatsapp',
      crmWebhook: config.crmWebhook || '/api/crm',
      zapierWebhook: config.zapierWebhook || null, // URL Zapier si utilisé
      makeWebhook: config.makeWebhook || null, // URL Make.com si utilisé
      
      // Configuration email
      emailFrom: config.emailFrom || 'bot@aiandbeyond.eu',
      emailTo: config.emailTo || 'contact@aiandbeyond.eu',
      
      // Configuration WhatsApp Business
      whatsappNumber: config.whatsappNumber || null,
      whatsappApiKey: config.whatsappApiKey || null,
      
      ...config
    };
  }
  
  // Formater les données de conversation pour envoi
  formatConversationData(type, data, conversationHistory) {
    const timestamp = new Date().toISOString();
    const locale = new Date().toLocaleString('fr-FR');
    
    return {
      type,
      timestamp,
      locale_timestamp: locale,
      conversation_id: data.conversationId || 'unknown',
      
      // Informations du lead
      lead: {
        email: data.collectedInfo?.email || 'Non fourni',
        nom: data.collectedInfo?.nom || 'Non fourni',
        entreprise: data.collectedInfo?.entreprise || 'Non fourni',
        telephone: data.collectedInfo?.telephone || 'Non fourni',
        budget: data.collectedInfo?.budget || 'Non spécifié',
        timeline: data.collectedInfo?.timeline || 'Non spécifié'
      },
      
      // Score et qualification
      qualification: {
        score: data.leadScore || 0,
        stage: data.stage || 'initial',
        intent: data.intent || 'unknown',
        priorite: this.calculatePriority(data.leadScore)
      },
      
      // Devis si applicable
      quote: data.quote || null,
      
      // Historique de conversation (5 derniers messages)
      conversation: conversationHistory.slice(-5).map(msg => ({
        role: msg.role === 'user' ? 'Client' : 'Assistant',
        message: msg.content,
        timestamp: msg.timestamp || timestamp
      })),
      
      // Métadonnées
      metadata: {
        page_source: window.location.href,
        referrer: document.referrer || 'Direct',
        device: this.detectDevice(),
        browser: this.detectBrowser()
      }
    };
  }
  
  calculatePriority(leadScore) {
    if (leadScore >= 7) return 'Haute';
    if (leadScore >= 4) return 'Moyenne';
    return 'Basse';
  }
  
  detectDevice() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  }
  
  detectBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }
  
  // Envoyer vers email (via Netlify Forms ou API)
  async sendToEmail(data, conversationHistory) {
    const formattedData = this.formatConversationData('email', data, conversationHistory);
    
    // Créer un email formaté
    const emailBody = this.createEmailTemplate(formattedData);
    
    try {
      // Option 1 : Via Netlify Functions
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: this.config.emailTo,
          from: this.config.emailFrom,
          subject: `🤖 Nouveau lead qualifié : ${formattedData.lead.email} (Score: ${formattedData.qualification.score}/10)`,
          html: emailBody
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Email send error:', error);
      
      // Option 2 : Fallback vers Zapier ou Make
      if (this.config.zapierWebhook) {
        return await this.sendToZapier(formattedData);
      }
      
      throw error;
    }
  }
  
  // Template email HTML
  createEmailTemplate(data) {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }
    .section { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #6366f1; }
    .score { display: inline-block; padding: 5px 15px; background: #10b981; color: white; border-radius: 20px; font-weight: bold; }
    .priority-high { background: #ef4444; }
    .priority-medium { background: #f59e0b; }
    .priority-low { background: #6b7280; }
    .conversation { background: #f1f5f9; padding: 10px; margin: 5px 0; border-radius: 4px; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🤖 Nouveau Lead depuis le Chat Bot IA</h1>
      <p>Score de qualification : <span class="score">${data.qualification.score}/10</span></p>
      <p>Priorité : <span class="score priority-${data.qualification.priorite.toLowerCase()}">${data.qualification.priorite}</span></p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>👤 Informations du Lead</h2>
        <p><strong>Email :</strong> ${data.lead.email}</p>
        <p><strong>Nom :</strong> ${data.lead.nom}</p>
        <p><strong>Entreprise :</strong> ${data.lead.entreprise}</p>
        <p><strong>Téléphone :</strong> ${data.lead.telephone}</p>
        <p><strong>Budget :</strong> ${data.lead.budget}</p>
        <p><strong>Timeline :</strong> ${data.lead.timeline}</p>
      </div>
      
      ${data.quote ? `
      <div class="section">
        <h2>💼 Devis Généré</h2>
        <p><strong>Service :</strong> ${data.quote.service || 'N/A'}</p>
        <p><strong>Fourchette :</strong> ${data.quote.min}€ - ${data.quote.max}€</p>
        ${data.quote.note ? `<p><strong>Note :</strong> ${data.quote.note}</p>` : ''}
      </div>
      ` : ''}
      
      <div class="section">
        <h2>💬 Extrait de Conversation</h2>
        ${data.conversation.map(msg => `
          <div class="conversation">
            <strong>${msg.role} :</strong> ${msg.message}
          </div>
        `).join('')}
      </div>
      
      <div class="section">
        <h2>📊 Métadonnées</h2>
        <p><strong>Source :</strong> ${data.metadata.page_source}</p>
        <p><strong>Device :</strong> ${data.metadata.device}</p>
        <p><strong>Browser :</strong> ${data.metadata.browser}</p>
        <p><strong>Date :</strong> ${data.locale_timestamp}</p>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <a href="mailto:${data.lead.email}" style="display: inline-block; padding: 12px 30px; background: #6366f1; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Répondre au Lead
        </a>
      </div>
    </div>
  </div>
</body>
</html>
    `;
  }
  
  // Envoyer vers WhatsApp Business
  async sendToWhatsApp(data, conversationHistory) {
    if (!this.config.whatsappNumber || !this.config.whatsappApiKey) {
      console.warn('WhatsApp non configuré');
      return null;
    }
    
    const formattedData = this.formatConversationData('whatsapp', data, conversationHistory);
    
    // Message WhatsApp formaté
    const message = `
🤖 *Nouveau Lead Chat Bot*

👤 *Contact*
${formattedData.lead.nom} - ${formattedData.lead.email}
${formattedData.lead.entreprise}

📊 *Score*: ${formattedData.qualification.score}/10
🎯 *Priorité*: ${formattedData.qualification.priorite}

${formattedData.quote ? `💼 *Devis*: ${formattedData.quote.service}
${formattedData.quote.min}€ - ${formattedData.quote.max}€` : ''}

🔗 Conversation ID: ${formattedData.conversation_id}
    `.trim();
    
    try {
      // API WhatsApp Business (ex: Twilio, 360dialog, etc.)
      const response = await fetch(this.config.whatsappWebhook, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.whatsappApiKey}`
        },
        body: JSON.stringify({
          to: this.config.whatsappNumber,
          message: message,
          data: formattedData
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('WhatsApp send error:', error);
      throw error;
    }
  }
  
  // Envoyer vers Zapier
  async sendToZapier(data) {
    if (!this.config.zapierWebhook) {
      console.warn('Zapier webhook non configuré');
      return null;
    }
    
    try {
      const response = await fetch(this.config.zapierWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Zapier webhook error:', error);
      throw error;
    }
  }
  
  // Envoyer vers Make.com
  async sendToMake(data) {
    if (!this.config.makeWebhook) {
      console.warn('Make webhook non configuré');
      return null;
    }
    
    try {
      const response = await fetch(this.config.makeWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Make webhook error:', error);
      throw error;
    }
  }
  
  // Fonction principale d'envoi (orchestre toutes les intégrations)
  async send(type, data, conversationHistory) {
    const results = {
      email: null,
      whatsapp: null,
      zapier: null,
      make: null,
      errors: []
    };
    
    // Envoyer vers email
    try {
      results.email = await this.sendToEmail(data, conversationHistory);
    } catch (error) {
      results.errors.push({ integration: 'email', error: error.message });
    }
    
    // Envoyer vers WhatsApp si configuré
    if (this.config.whatsappNumber && data.leadScore >= 5) { // Seulement leads qualifiés
      try {
        results.whatsapp = await this.sendToWhatsApp(data, conversationHistory);
      } catch (error) {
        results.errors.push({ integration: 'whatsapp', error: error.message });
      }
    }
    
    // Envoyer vers Zapier si configuré
    if (this.config.zapierWebhook) {
      try {
        results.zapier = await this.sendToZapier(
          this.formatConversationData(type, data, conversationHistory)
        );
      } catch (error) {
        results.errors.push({ integration: 'zapier', error: error.message });
      }
    }
    
    // Envoyer vers Make si configuré
    if (this.config.makeWebhook) {
      try {
        results.make = await this.sendToMake(
          this.formatConversationData(type, data, conversationHistory)
        );
      } catch (error) {
        results.errors.push({ integration: 'make', error: error.message });
      }
    }
    
    return results;
  }
}

// Intégrer au bot principal
if (typeof AIChatBot !== 'undefined') {
  AIChatBot.prototype.integrationManager = new IntegrationManager();
  
  // Remplacer la fonction sendToWebhook
  AIChatBot.prototype.sendToWebhook = async function(type, data) {
    try {
      const results = await this.integrationManager.send(
        type,
        {
          ...data,
          conversationId: this.conversationId,
          stage: this.botIntelligence?.conversationState?.stage,
          leadScore: this.botIntelligence?.conversationState?.leadScore,
          collectedInfo: this.botIntelligence?.conversationState?.collectedInfo
        },
        this.conversationHistory
      );
      
      console.log('Integration results:', results);
      
      // Si tout s'est bien passé
      if (results.errors.length === 0) {
        this.addMessage('bot', 
          "✅ Parfait ! J'ai transmis vos informations à notre équipe. Vous recevrez un retour sous 24h maximum."
        );
      } else {
        // Certaines intégrations ont échoué mais on continue
        console.warn('Some integrations failed:', results.errors);
      }
    } catch (error) {
      console.error('Webhook error:', error);
    }
  };
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntegrationManager;
}
