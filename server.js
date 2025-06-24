const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fonction pour envoyer une notification WhatsApp via Unipile
async function sendWhatsAppNotification(formData) {
  try {
    if (!process.env.UNIPILE_API_URL || !process.env.UNIPILE_API_KEY) {
      console.warn('Configuration Unipile manquante - notification WhatsApp ignorée');
      return;
    }

    // Formatage du message
    const message = `🏠 NOUVEAU LEAD VENDEUR

📋 Informations du bien :
• Type : ${formData.type}
• Surface : ${formData.surface} m²
• Localisation : ${formData.location}
${formData.rooms ? `• Pièces : ${formData.rooms}` : ''}
${formData.floor ? `• Étage : ${formData.floor}` : ''}

👤 Coordonnées du prospect :
• Nom : ${formData.name}
• Email : ${formData.email}
• Téléphone : ${formData.countryCode}${formData.phone}

⏰ Reçu le ${new Date().toLocaleString('fr-FR')}`;

    // Préparation des données pour l'API Unipile
    const formDataUnipile = new FormData();
    formDataUnipile.append('type', 'Text');
    formDataUnipile.append('text', message);

    const response = await fetch(process.env.UNIPILE_API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.UNIPILE_API_KEY,
        'Accept': 'application/json'
      },
      body: formDataUnipile
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur Unipile WhatsApp: ${response.status} - ${errorText}`);
      // Ne pas faire échouer toute la requête si WhatsApp échoue
      return;
    }

    const result = await response.json();
    console.log('Notification WhatsApp envoyée avec succès:', result);
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification WhatsApp:', error);
    // Ne pas faire échouer toute la requête si WhatsApp échoue
  }
}

// Fonction pour obtenir le token CRM
async function getCRMToken() {
  try {
    const response = await fetch(`${process.env.CRM_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: process.env.CRM_USERNAME,
        password: process.env.CRM_PASSWORD
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de l'authentification CRM: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du token CRM:', error);
    throw error;
  }
}

// Route API pour envoyer les données au CRM
app.post('/api/submit-lead', async (req, res) => {
  try {
    const { type, surface, location, rooms, name, email, phone, countryCode } = req.body;
    
    // Validation des données
    if (!type || !surface || !location || !name || !email || !phone) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Validation de la configuration CRM
    if (!process.env.CRM_API_URL || !process.env.CRM_USERNAME || !process.env.CRM_PASSWORD) {
      console.error('Configuration CRM manquante');
      return res.status(500).json({ error: 'Configuration serveur invalide' });
    }
    
    // Obtenir le token d'authentification
    const token = await getCRMToken();
    
    // Préparer les données pour le CRM (endpoint leads)
    const crmData = {
      first_name: name.split(' ')[0] || name,
      last_name: name.split(' ').slice(1).join(' ') || 'N/A',
      email: email,
      phone: `${countryCode}${phone}`,
      departement: location,
      source: 'Site web LP Vendeur'
    };
    
    // Appel à l'API CRM
    const response = await fetch(`${process.env.CRM_API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(crmData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur CRM: ${response.status} - ${errorText}`);
      throw new Error(`Erreur CRM: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Lead enregistré avec succès dans le CRM:', result.id || result);

    // Envoyer la notification WhatsApp après l'enregistrement réussi
    await sendWhatsAppNotification(req.body);
    
    res.json({ success: true, data: result });
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi vers le CRM:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l\'enregistrement' });
  }
});

// Route de santé pour Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
}); 