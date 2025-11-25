# ✅ CHECKLIST PRÉ-DÉPLOIEMENT - AI & BEYOND V16 FINAL

## 📋 Vérifications Obligatoires AVANT GitHub/Netlify

### 🎨 **Design & Header**
- [ ] Header apparaît correctement sur toutes les pages (index, rag, bots, livres)
- [ ] Logo s'affiche avec bonne résolution
- [ ] Slogan "IA" a le gradient violet-indigo
- [ ] Slogan "au service de votre croissance" est en Shadows Into Light
- [ ] Header disparaît après 150px de scroll (tester sur chaque page)
- [ ] Header réapparaît en scroll up (transition smooth)
- [ ] Menu burger fonctionne sur mobile
- [ ] Toutes les polices se chargent (Orbitron, Shadows Into Light, Inter)

### 📱 **Mobile Responsive**
- [ ] Tester sur iPhone SE (375px) - Aucune troncature
- [ ] Tester sur iPhone 12/13 (390px)
- [ ] Tester sur iPad (768px)
- [ ] Menu mobile s'ouvre et se ferme correctement
- [ ] Tous les boutons sont cliquables (taille min 44x44px)
- [ ] Pas de scroll horizontal
- [ ] Images s'adaptent à la largeur écran
- [ ] Formulaires sont remplissables sur mobile

### 🔗 **Navigation & Liens**
- [ ] Tous les liens internes fonctionnent (#services, #contact, etc.)
- [ ] Les liens entre pages fonctionnent (index → rag, bots, livres)
- [ ] Les boutons "Contact" redirigent vers #contact
- [ ] Les boutons "Demander une démo" fonctionnent
- [ ] Pas de liens morts (404)
- [ ] Les ancres (#) scrollent correctement

### 🖼️ **Images & Assets**
- [ ] Logo s'affiche partout (index + toutes les pages)
- [ ] Favicon apparaît dans l'onglet
- [ ] Toutes les images ont un attribut alt
- [ ] Images sont optimisées (< 500KB chacune)
- [ ] Pas d'images cassées (vérifier console)

### 📝 **Contenu**
- [ ] Tous les textes sont en français correct
- [ ] Pas de "Lorem ipsum" ou de placeholder
- [ ] Les prix sont à jour (5-15K€, 15-30K€, etc.)
- [ ] Les coordonnées de contact sont correctes
- [ ] Email de contact est fonctionnel
- [ ] Mentions des livres (Bible du PE) sont correctes

### 🤖 **Bot Lyra**
- [ ] Le bouton du chatbot apparaît en bas à droite
- [ ] Le chatbot s'ouvre au clic
- [ ] Les messages placeholder s'affichent (même sans API)
- [ ] Le style du chatbot est cohérent avec le site
- [ ] Le chatbot est responsive sur mobile

### 📧 **Formulaire de Contact**
- [ ] Le formulaire s'affiche correctement
- [ ] Tous les champs sont requis
- [ ] Validation email fonctionne
- [ ] Message de succès/erreur s'affiche
- [ ] ⚠️ **IMPORTANT** : Vérifier l'endpoint email dans `send-email.js`

### 🔍 **SEO**
- [ ] Chaque page a un `<title>` unique
- [ ] Chaque page a une meta description
- [ ] Meta keywords présents
- [ ] Open Graph tags configurés
- [ ] Balises H1, H2, H3 correctes
- [ ] Sitemap.xml à créer après déploiement

### ⚙️ **Configuration Technique**
- [ ] `bot-config.js` a les bonnes configurations
- [ ] `analytics.js` a le bon Google Analytics ID (à ajouter)
- [ ] Pas de console.error dans la console navigateur
- [ ] HTTPS sera activé (vérifié après Netlify)

---

## 🚀 **Post-Déploiement Netlify**

### Immédiatement Après Déploiement
- [ ] Tester le site en ligne (URL Netlify)
- [ ] Vérifier header sur toutes les pages
- [ ] Tester responsive mobile en ligne
- [ ] Vérifier que les images se chargent
- [ ] Tester tous les liens
- [ ] Vérifier le formulaire de contact
- [ ] Activer HTTPS (automatique Netlify)

### Configuration Domaine (aiandbeyond.eu)
- [ ] Ajouter le domaine custom dans Netlify
- [ ] Configurer les DNS sur OVH :
  ```
  Type A     : @   → 75.2.60.5
  Type CNAME : www → VOTRE-SITE.netlify.app
  ```
- [ ] Attendre propagation DNS (1-24h)
- [ ] Vérifier SSL/HTTPS actif
- [ ] Tester www.aiandbeyond.eu ET aiandbeyond.eu

### Analytics & Tracking
- [ ] Installer Google Analytics
- [ ] Installer Google Tag Manager (optionnel)
- [ ] Installer Meta Pixel (optionnel)
- [ ] Configurer Google Search Console
- [ ] Soumettre sitemap.xml

---

## 🧪 **Tests Cross-Browser**

### Desktop
- [ ] Chrome (Windows/Mac)
- [ ] Firefox (Windows/Mac)
- [ ] Safari (Mac)
- [ ] Edge (Windows)

### Mobile
- [ ] Safari iOS (iPhone)
- [ ] Chrome Android
- [ ] Samsung Internet

### Vérifier sur chaque navigateur :
- Header scroll fonctionne
- Polices s'affichent
- Animations sont fluides
- Formulaire fonctionne

---

## 🔐 **Sécurité & Conformité**

### Avant Production
- [ ] Ajouter page Mentions Légales
- [ ] Ajouter page Politique de Confidentialité
- [ ] Ajouter page CGV (si vente en ligne)
- [ ] Cookie banner RGPD (si tracking)
- [ ] Honeypot dans formulaire (anti-spam)

---

## 📊 **Performance**

### Test avec PageSpeed Insights
- [ ] Score Desktop > 90
- [ ] Score Mobile > 80
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

### Optimisations si Score Faible
- Compresser les images (TinyPNG)
- Minifier CSS/JS
- Lazy loading sur images
- Preconnect sur Google Fonts

---

## 🐛 **Problèmes Fréquents & Solutions**

### "Le header ne disparaît pas au scroll"
→ Ouvrir la console (F12), vérifier les erreurs JavaScript

### "Les polices ne s'affichent pas"
→ Vérifier que Google Fonts est accessible (pas de bloqueur)

### "Images cassées"
→ Vérifier les chemins (`../assets/images/` pour pages dans /pages/)

### "Formulaire ne fonctionne pas"
→ Vérifier l'endpoint dans `send-email.js`

### "Bot Lyra ne s'affiche pas"
→ Vérifier que `ai-chat-bot.js` et `bot-config.js` sont chargés

---

## ✨ **Checklist Qualité Premium**

### Le site est-il "wahou" ?
- [ ] Design moderne et premium
- [ ] Animations fluides
- [ ] Navigation intuitive
- [ ] Chargement rapide (< 3s)
- [ ] Zéro bug visible
- [ ] Expérience mobile impeccable

### Le site convertit-il ?
- [ ] CTA clairs et visibles
- [ ] Proposition de valeur évidente
- [ ] Preuves sociales présentes
- [ ] Formulaire simple (max 5 champs)
- [ ] Rassurance (témoignages, logos)

---

## 🎯 **Validation Finale**

### Auto-Test
**Imaginez-vous comme un client potentiel (CEO de PME)** :
1. Arrivée sur le site → Comprenez-vous l'offre en 5 secondes ?
2. Scroll rapide → Les bénéfices sont-ils clairs ?
3. Clic sur "Services" → Les prix sont-ils visibles ?
4. Clic sur "Contact" → Le formulaire est-il simple ?
5. Vue mobile → L'expérience est-elle fluide ?

**Si OUI à toutes les questions → ✅ READY TO DEPLOY**

---

## 📞 **Contact Support si Problème**

### Netlify
- Documentation : https://docs.netlify.com
- Support : https://www.netlify.com/support/

### GitHub
- Documentation : https://docs.github.com
- Support : https://support.github.com

### OVH (DNS)
- Support : https://www.ovhcloud.com/fr/support/

---

## 🎉 **Post-Launch**

### Jour 1
- [ ] Annoncer sur LinkedIn
- [ ] Partager sur Twitter/X
- [ ] Envoyer newsletter (si liste)
- [ ] Poster sur Reddit/Forums (si pertinent)

### Semaine 1
- [ ] Analyser premiers visiteurs (Analytics)
- [ ] Identifier pages les plus vues
- [ ] Corriger bugs remontés
- [ ] Optimiser conversion si besoin

### Mois 1
- [ ] Créer 3-5 articles de blog
- [ ] Commencer SEO actif
- [ ] Recueillir premiers témoignages
- [ ] A/B testing sur CTA

---

**🚀 Prêt à décoller ?**

*Une fois cette checklist 100% validée, vous êtes prêt pour le déploiement GitHub → Netlify !*

**Rappel** : Toujours tester localement AVANT de pousser sur GitHub.

---

*Version : V16 FINAL*  
*Dernière mise à jour : Novembre 2025*
