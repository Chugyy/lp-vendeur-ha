# Landing Page - Estimation Immobilière

## Description
Landing page pour les estimations immobilières avec intégration Airtable et tracking Facebook Pixel.

## Fonctionnalités

### ✅ Formulaire d'estimation
- Types de bien : Appartement, Maison, Villa, Terrain
- Champs conditionnels (pièces/étage masqués pour les terrains)
- Validation en temps réel
- Sélection d'indicatif téléphonique international

### ✅ Intégrations
- **Airtable** : Sauvegarde automatique des leads
- **Facebook Pixel** : Tracking des conversions
- **Popup de confirmation** : Message personnalisé après soumission

### ✅ Interface utilisateur
- Design responsive et moderne
- Animations fluides
- UX optimisée

## Configuration

### 1. Variables d'environnement
Copiez le fichier `.env` et remplacez `YOUR_AIRTABLE_API_KEY` par votre vraie clé API Airtable :

```bash
AIRTABLE_API_KEY=pat_VOTRE_CLE_API_AIRTABLE
AIRTABLE_BASE_ID=appGQ4zM1JJFTaPAj
AIRTABLE_TABLE_ID=tblk2IiIuMQgiA1rB
```

### 2. Configuration Airtable
Votre table Airtable doit contenir les champs suivants :

| Nom du champ | Type | Options |
|--------------|------|---------|
| Type de bien | Single select | Appartement, Maison, Villa, Terrain |
| Surface | Number | - |
| Localisation | Long text | - |
| Nombre de pièces | Number | - |
| Nom complet | Single line text | - |
| Email | Email | - |
| Téléphone | Phone number | - |
| Autorisation de contact | Checkbox | - |
| Type de lead | Single select | Vendeur |

### 3. Facebook Pixel
Le pixel Facebook (ID: `793185801155745`) est déjà configuré et track automatiquement :
- `PageView` au chargement de la page
- `Lead` à chaque soumission de formulaire

### 4. Sécurité
⚠️ **Important** : En production, l'API key Airtable ne doit JAMAIS être exposée côté client. 

**Solutions recommandées :**
- Utiliser un serveur backend (Node.js, PHP, Python, etc.)
- Utiliser des fonctions serverless (Netlify Functions, Vercel Functions)
- Utiliser Zapier ou Make.com comme proxy

## Installation

### Option 1 : Serveur web local
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

### Option 2 : Hébergement statique
- **Netlify** : Drag & drop du dossier
- **Vercel** : Connexion GitHub
- **GitHub Pages** : Push vers repository

## Structure des fichiers

```
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── script.js           # Logique JavaScript
├── .env               # Variables d'environnement
└── README.md          # Documentation
```

## Utilisation

1. L'utilisateur remplit le formulaire
2. Les données sont validées en temps réel
3. À la soumission :
   - Envoi vers Airtable
   - Tracking Facebook Pixel
   - Affichage de la popup de confirmation
4. Le formulaire se reset automatiquement

## Dépannage

### Erreur Airtable
- Vérifiez votre clé API dans le fichier `.env`
- Vérifiez les permissions de votre base Airtable
- Vérifiez la structure des champs

### Facebook Pixel
- Vérifiez dans les outils de développement que `fbq` est défini
- Utilisez l'extension Facebook Pixel Helper pour Chrome

### CORS
Si vous rencontrez des erreurs CORS, utilisez un serveur web local plutôt que d'ouvrir directement le fichier HTML.

## Support

Pour toute question ou assistance, consultez :
- [Documentation Airtable API](https://airtable.com/developers/web/api/introduction)
- [Documentation Facebook Pixel](https://developers.facebook.com/docs/facebook-pixel) 