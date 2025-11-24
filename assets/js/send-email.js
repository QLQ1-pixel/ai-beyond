// Netlify Function - Send Email from Chat Bot
// Path: netlify/functions/send-email.js

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Autoriser seulement les requêtes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
  
  try {
    const { to, from, subject, html } = JSON.parse(event.body);
    
    // Validation basique
    if (!to || !subject || !html) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    
    // Configuration du transporteur email
    // OPTION 1 : Gmail (nécessite mot de passe d'application)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Variable d'environnement
        pass: process.env.EMAIL_PASS  // Variable d'environnement
      }
    });
    
    // OPTION 2 : SendGrid (recommandé pour production)
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //   to,
    //   from: process.env.SENDGRID_FROM_EMAIL,
    //   subject,
    //   html
    // };
    // await sgMail.send(msg);
    
    // OPTION 3 : Mailgun, Postmark, etc.
    
    // Envoyer l'email
    const info = await transporter.sendMail({
      from: from || process.env.EMAIL_FROM || 'bot@aiandbeyond.eu',
      to,
      subject,
      html
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId
      })
    };
    
  } catch (error) {
    console.error('Email error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to send email',
        details: error.message
      })
    };
  }
};

/* 
CONFIGURATION REQUISE DANS NETLIFY :

1. Installer les dépendances (package.json) :
   {
     "dependencies": {
       "nodemailer": "^6.9.0"
     }
   }

2. Variables d'environnement (Netlify Dashboard > Site settings > Environment variables) :
   - EMAIL_USER=votre.email@gmail.com
   - EMAIL_PASS=votre_mot_de_passe_application
   - EMAIL_FROM=bot@aiandbeyond.eu

3. Pour Gmail, activer "Mots de passe d'application" :
   https://support.google.com/accounts/answer/185833

ALTERNATIVE : Utiliser SendGrid (gratuit jusqu'à 100 emails/jour)
   - Créer compte : https://sendgrid.com/
   - Obtenir API key
   - Installer : npm install @sendgrid/mail
   - Variable : SENDGRID_API_KEY=your_key
*/
