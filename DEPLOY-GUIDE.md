# 🚀 Guide de Déploiement V17 - Lyra avec API Claude

## Étape 1 : Extraire et préparer les fichiers

```bash
# Extraire l'archive
tar -xzf ai-beyond-v17-lyra.tar.gz

# Remplacer le contenu de ton repo
cd ai-beyond-v17-lyra
```

## Étape 2 : Configurer la clé API Claude sur Netlify

### Via l'interface Netlify (recommandé)

1. Va sur [app.netlify.com](https://app.netlify.com)
2. Sélectionne ton site **ai-and-beyond** ou **aiandbeyond**
3. **Site settings** → **Environment variables**
4. Clique sur **Add a variable**
5. Ajoute :
   - **Key** : `ANTHROPIC_API_KEY`
   - **Value** : `sk-ant-api03-...` (ta clé API)
6. Clique sur **Create variable**

### Via Netlify CLI (alternative)

```bash
# Installer Netlify CLI si pas déjà fait
npm install -g netlify-cli

# Se connecter
netlify login

# Lier au site
netlify link

# Ajouter la variable
netlify env:set ANTHROPIC_API_KEY "sk-ant-api03-..."
```

## Étape 3 : Déployer

```bash
# Git
git add .
git commit -m "V17: Lyra avec API Claude"
git push origin main
```

Netlify déploiera automatiquement et la fonction `lyra-chat` sera disponible.

## Étape 4 : Tester

1. Va sur ton site déployé
2. Clique sur le bouton Lyra (en bas à droite)
3. Envoie un message
4. Vérifie dans la console (F12) :
   - `🤖 Lyra v2.1 initialized (fr) - Claude API: enabled`
   - `📊 Claude API usage - Input: X, Output: Y`

## ⚠️ Important : Régénérer ta clé API

Ta clé a été exposée dans notre conversation. Pour ta sécurité :

1. Va sur [console.anthropic.com](https://console.anthropic.com)
2. **API Keys** → Supprimer l'ancienne clé "Lyra-AI&B-Key"
3. **Create Key** → Nouvelle clé
4. Mettre à jour dans Netlify Environment Variables

## 📊 Monitoring des coûts

Dans la console Anthropic, tu peux voir :
- Usage quotidien/mensuel
- Coût par requête
- Alertes de dépassement

### Limites recommandées

Dans **console.anthropic.com** → **Limits** :
- Daily limit : 10$ (pour commencer)
- Monthly limit : 50$

## 🔧 Dépannage

### Lyra ne répond pas avec l'IA
- Vérifier `ANTHROPIC_API_KEY` dans Netlify
- Vérifier les logs : **Netlify** → **Functions** → **lyra-chat**

### Erreur CORS
- Vérifier que le CSP dans `netlify.toml` inclut `connect-src`

### Fallback activé
- L'API Claude est temporairement indisponible
- Lyra bascule automatiquement en mode réponses prédéfinies

## 📁 Structure des fichiers ajoutés

```
netlify/
└── functions/
    └── lyra-chat.js      # Fonction serverless

assets/
├── css/
│   └── lyra-premium.css  # Styles du bot
└── js/
    └── lyra-premium.js   # Logique + API Claude
```

## 💡 Personnaliser le comportement de Claude

Le prompt système se trouve dans `netlify/functions/lyra-chat.js` :
- Tu peux modifier la personnalité de Lyra
- Ajouter/modifier les services
- Changer les tarifs
- Adapter le ton

---

**Support** : contact@aiandbeyond.eu

*V17 - Novembre 2024*
