# 🤖 LYRA - Bot Premium AI & Beyond

## Version 2.0 - WOW Edition

Lyra est le bot conversationnel premium d'AI & Beyond, conçu pour qualifier les leads et générer des devis automatiques avec une expérience utilisateur exceptionnelle.

---

## ✨ Fonctionnalités

### Design Premium
- **Glassmorphism** : Interface moderne avec effet verre dépoli
- **Animations fluides** : Transitions CSS et effets de pulsation
- **Avatar animé** : Effet "respiration" avec status online
- **Responsive** : Optimisé mobile-first

### Intelligence
- **Qualification de leads** : Score automatique basé sur les interactions
- **Génération de devis** : Estimations personnalisées en temps réel
- **Reconnaissance d'intentions** : Comprend les besoins utilisateur
- **Collecte d'informations** : Email, téléphone, entreprise, besoins

### Multilingue
- **Français** (défaut)
- **Anglais**
- **Portugais**
- Détection automatique basée sur l'URL ou langue du navigateur

### Intégrations
- **Netlify Forms** : Envoi automatique des leads
- **Calendly** : Prise de RDV intégrée
- **WhatsApp** : Redirection directe
- **Google Analytics** : Tracking des événements

---

## 📁 Fichiers

```
assets/
├── css/
│   └── lyra-premium.css   # Styles du bot
└── js/
    └── lyra-premium.js    # Logique du bot
```

---

## 🚀 Installation

### 1. Inclure les fichiers

```html
<!-- CSS -->
<link rel="stylesheet" href="assets/css/lyra-premium.css">

<!-- Configuration -->
<script>
    window.LYRA_CONFIG = {
        botName: 'Lyra',
        botRole: 'Assistante IA',
        companyName: 'AI & Beyond',
        email: 'contact@aiandbeyond.eu',
        whatsapp: '+351920833889',
        calendlyUrl: 'https://calendly.com/ai-and-beyond',
        showBadge: true,
        autoOpenDelay: null // ou délai en ms
    };
</script>

<!-- JavaScript -->
<script src="assets/js/lyra-premium.js"></script>
```

### 2. Formulaire Netlify (si utilisé)

Ajouter dans le `<body>` :

```html
<form name="lyra-leads" netlify netlify-honeypot="bot-field" hidden>
    <input type="text" name="bot-field" />
    <input type="email" name="email" />
    <input type="tel" name="phone" />
    <input type="text" name="name" />
    <input type="text" name="company" />
    <input type="text" name="service" />
    <input type="text" name="need" />
    <input type="number" name="leadScore" />
    <input type="text" name="language" />
    <input type="text" name="source" />
    <textarea name="conversation"></textarea>
    <input type="text" name="timestamp" />
</form>
```

---

## ⚙️ Configuration

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `botName` | string | `'Lyra'` | Nom affiché du bot |
| `botRole` | string | `'Assistante IA'` | Rôle affiché |
| `companyName` | string | `'AI & Beyond'` | Nom de l'entreprise |
| `email` | string | - | Email de contact |
| `whatsapp` | string | - | Numéro WhatsApp |
| `calendlyUrl` | string | - | URL Calendly |
| `showBadge` | boolean | `true` | Afficher badge notification |
| `autoOpenDelay` | number/null | `null` | Délai avant ouverture auto (ms) |

---

## 🎯 Services et Tarifs

Le bot gère automatiquement ces services :

| Service | Prix Min | Prix Max | Mensuel |
|---------|----------|----------|---------|
| Bots IA | 2 000€ | 8 000€ | Non |
| Automatisation | 3 000€ | 15 000€ | Non |
| RAG Cloud | 1 500€ | 10 000€ | Oui |
| RAG Local | 8 000€ | 25 000€ | Non |
| Formation | 800€ | 3 000€ | Non |
| Consulting | 500€ | 5 000€ | Non |

---

## 📊 Lead Scoring

Points attribués automatiquement :
- Email fourni : +3 points
- Téléphone fourni : +2 points
- Budget mentionné : +2 points
- Urgence détectée : +1 point

---

## 🔧 Personnalisation

### Modifier les couleurs

Dans `lyra-premium.css`, modifier les variables CSS :

```css
:root {
  --lyra-primary: #6366f1;
  --lyra-secondary: #8b5cf6;
  --lyra-accent: #06b6d4;
  --lyra-neon-cyan: #00f5ff;
  --lyra-neon-purple: #bf5af2;
}
```

### Ajouter des messages

Dans `lyra-premium.js`, ajouter dans l'objet `messages` :

```javascript
fr: {
  newFeature: {
    response: "Votre message ici",
    keywords: ['mot', 'clé']
  }
}
```

---

## 🐛 Debugging

Ouvrir la console du navigateur pour voir :
- `🤖 Lyra initialized (fr/en/pt)` - Confirmation d'initialisation
- `📧 Lead Lyra: {...}` - Détails du lead envoyé
- `📊 Event: ...` - Événements trackés

---

## 📱 Responsive

Le bot s'adapte automatiquement :
- **Desktop** : Fenêtre flottante 400x550px
- **Mobile** : Plein écran avec marges

---

## 🔜 Roadmap

- [ ] Intégration API Claude pour réponses intelligentes
- [ ] Mode vocal (speech-to-text)
- [ ] Upload de fichiers
- [ ] Historique de conversation persistant
- [ ] A/B testing des messages

---

## 📞 Support

Pour toute question ou personnalisation :
- 📧 contact@aiandbeyond.eu
- 🌐 https://aiandbeyond.eu
- 📱 +351 920 833 889

---

*Version 2.0 - Novembre 2024*
*© AI & Beyond - Tous droits réservés*
