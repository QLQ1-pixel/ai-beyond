/**
 * =========================================
 * LYRA - Netlify Function pour API Claude
 * AI & Beyond - Bot Intelligent
 * =========================================
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// System prompt pour Lyra
const LYRA_SYSTEM_PROMPT = `Tu es Lyra, l'assistante IA d'AI & Beyond, une agence de consulting spécialisée en Intelligence Artificielle basée en Europe.

## Ta personnalité
- Professionnelle mais chaleureuse et accessible
- Experte en IA, automatisation et Prompt Engineering
- Tu tutoies les visiteurs de manière naturelle
- Tu utilises des emojis avec parcimonie pour rester pro
- Tu es concise (2-4 phrases max par réponse sauf si on te demande des détails)

## Services AI & Beyond (tarifs indicatifs)
1. **Bots IA Conversationnels** (2 000€ - 8 000€)
   - Support client 24/7, qualification de leads, FAQ automatisées
   - Intégration WhatsApp, site web, CRM

2. **Automatisation de Workflows** (3 000€ - 15 000€)
   - Automatisation emails, CRM, reporting
   - Connexion d'outils via APIs (Make, Zapier, n8n)

3. **RAG-as-a-Service Cloud** (1 500€ - 10 000€/mois)
   - IA avec accès aux documents de l'entreprise
   - Recherche intelligente, base de connaissances IA

4. **RAG Physique / On-Premise** (8 000€ - 25 000€)
   - Mac Studio/Mini dédié, 100% local
   - Données jamais dans le cloud, RGPD++

5. **Formation Prompt Engineering** (800€ - 3 000€)
   - Techniques avancées, cas pratiques métier
   - Ateliers hands-on, certification

6. **Audit & Consulting IA** (500€ - 5 000€)
   - Analyse des processus, opportunités IA
   - Roadmap transformation digitale

## Ton objectif
1. Comprendre le besoin du visiteur
2. Proposer la solution adaptée
3. Qualifier le lead (email, entreprise, budget, timeline)
4. Proposer un RDV découverte gratuit de 30 min

## Informations de contact
- Email : contact@aiandbeyond.eu
- WhatsApp : +351 920 833 889
- Calendly : calendly.com/ai-and-beyond
- Site : aiandbeyond.eu

## Règles importantes
- Ne jamais inventer de fonctionnalités ou services qui n'existent pas
- Toujours proposer un appel découverte pour les projets complexes
- Si tu ne sais pas répondre, propose de transférer à un humain
- Adapte ta langue (FR/EN/PT) selon celle du visiteur
- Ne jamais donner de prix exact, toujours des fourchettes`;

// Détection de la langue
function detectLanguage(messages) {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  if (!lastUserMessage) return 'fr';
  
  const text = lastUserMessage.content.toLowerCase();
  
  // Portugais
  if (/\b(olá|obrigado|como|você|está|bem|preciso|gostaria|serviços|orçamento)\b/.test(text)) {
    return 'pt';
  }
  
  // Anglais
  if (/\b(hello|hi|thanks|how|you|need|would|like|services|quote|price)\b/.test(text)) {
    return 'en';
  }
  
  // Français par défaut
  return 'fr';
}

// Handler principal
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST allowed
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, conversationHistory = [] } = JSON.parse(event.body);
    
    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Messages array required' })
      };
    }

    // Récupérer la clé API depuis les variables d'environnement
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'API not configured',
          fallback: true,
          message: "Je suis temporairement en mode limité. Contactez-nous directement à contact@aiandbeyond.eu ou via WhatsApp +351 920 833 889."
        })
      };
    }

    // Détecter la langue
    const lang = detectLanguage(messages);
    
    // Construire le prompt système avec la langue
    let systemPrompt = LYRA_SYSTEM_PROMPT;
    if (lang === 'en') {
      systemPrompt += '\n\nIMPORTANT: The visitor is speaking English. Respond in English.';
    } else if (lang === 'pt') {
      systemPrompt += '\n\nIMPORTANT: O visitante está falando português. Responda em português.';
    } else {
      systemPrompt += '\n\nIMPORTANT: Le visiteur parle français. Réponds en français.';
    }

    // Limiter l'historique pour économiser les tokens (derniers 10 messages)
    const limitedHistory = conversationHistory.slice(-10);
    
    // Construire les messages pour l'API
    const apiMessages = [
      ...limitedHistory,
      ...messages
    ];

    // Appel à l'API Claude
    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 500,
        system: systemPrompt,
        messages: apiMessages
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', response.status, errorData);
      
      // Fallback en cas d'erreur API
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          fallback: true,
          message: lang === 'en' 
            ? "I'm experiencing a temporary issue. Please contact us at contact@aiandbeyond.eu or WhatsApp +351 920 833 889."
            : lang === 'pt'
            ? "Estou com um problema temporário. Entre em contato conosco em contact@aiandbeyond.eu ou WhatsApp +351 920 833 889."
            : "Je rencontre un problème temporaire. Contactez-nous à contact@aiandbeyond.eu ou WhatsApp +351 920 833 889."
        })
      };
    }

    const data = await response.json();
    
    // Extraire la réponse
    const assistantMessage = data.content[0]?.text || "Je n'ai pas pu générer de réponse.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: assistantMessage,
        usage: data.usage,
        lang: lang
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        fallback: true,
        message: "Une erreur s'est produite. Contactez-nous à contact@aiandbeyond.eu"
      })
    };
  }
};
