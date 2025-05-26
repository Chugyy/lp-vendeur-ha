# Guide de Déploiement sur Render

## 📋 Prérequis

1. **Compte GitHub** : Votre code doit être sur GitHub
2. **Compte Render** : Créez un compte gratuit sur [render.com](https://render.com)
3. **Nom de domaine** : Acheté chez un registrar (OVH, Gandi, Namecheap, etc.)

## 🚀 Étapes de déploiement

### 1. Préparation du repository GitHub

```bash
# Initialiser Git (si pas déjà fait)
git init

# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit - Landing page immobilier"

# Créer un repository sur GitHub et l'ajouter comme origin
git remote add origin https://github.com/VOTRE_USERNAME/lp-vendeur-immobilier.git

# Push vers GitHub
git push -u origin main
```

### 2. Déploiement sur Render

1. **Connectez-vous à Render** : [dashboard.render.com](https://dashboard.render.com)

2. **Créer un nouveau Web Service** :
   - Cliquez sur "New +" → "Web Service"
   - Connectez votre repository GitHub
   - Sélectionnez votre repository `lp-vendeur-immobilier`

3. **Configuration du service** :
   ```
   Name: lp-vendeur-immobilier
   Environment: Node
   Region: Frankfurt (Europe) - plus proche de la France
   Branch: main
   Root Directory: (laisser vide)
   Build Command: npm install
   Start Command: npm start
   ```

4. **Variables d'environnement** :
   Allez dans "Environment" et ajoutez :
   ```
   AIRTABLE_API_KEY=pat1NLX5ihccw4n1l.4df59184ddd972366e5457e921f408f2f1551b58799cb3490e0c33a02b702277
   AIRTABLE_BASE_ID=appGQ4zM1JJFTaPAj
   AIRTABLE_TABLE_ID=tblk2IiIuMQgiA1rB
   UNIPILE_API_URL=https://api12.unipile.com:14215/api/v1/chats/P-uBEDCzUnSupE-BkdWmRQ/messages
   UNIPILE_API_KEY=3sIJADYJ.yfHh2OW....=
   NODE_ENV=production
   ```

5. **Plan** : Sélectionnez "Free" (suffisant pour commencer)

6. **Déployer** : Cliquez sur "Create Web Service"

### 3. Configuration du domaine personnalisé

Une fois le déploiement réussi :

1. **Dans Render** :
   - Allez dans votre service → "Settings"
   - Section "Custom Domains"
   - Cliquez sur "Add Custom Domain"
   - Entrez votre domaine : `votredomaine.com`

2. **Chez votre registrar de domaine** :
   Ajoutez ces enregistrements DNS :

   ```
   Type: CNAME
   Name: www
   Value: votreapp.onrender.com

   Type: A
   Name: @
   Value: 216.24.57.1
   ```

   **OU** plus simple (recommandé) :
   ```
   Type: CNAME
   Name: @
   Value: votreapp.onrender.com
   ```

3. **SSL automatique** : Render configure automatiquement le HTTPS

### 4. Test de fonctionnement

1. **URL temporaire** : `https://votreapp.onrender.com`
2. **URL finale** : `https://votredomaine.com`

Testez :
- ✅ Chargement de la page
- ✅ Soumission du formulaire
- ✅ Réception dans Airtable
- ✅ Tracking Facebook Pixel

## 🔧 Configuration DNS détaillée

### Option A : Redirection root vers www

```
Type: A
Name: @
Value: 216.24.57.1

Type: CNAME
Name: www
Value: votreapp.onrender.com
```

### Option B : CNAME pour root (plus simple)

```
Type: CNAME
Name: @
Value: votreapp.onrender.com

Type: CNAME
Name: www
Value: votreapp.onrender.com
```

## 📊 Monitoring et logs

1. **Logs en temps réel** : Dans Render → "Logs"
2. **Métriques** : Dans Render → "Metrics"
3. **Status** : `https://votredomaine.com/health`

## 🔄 Mises à jour

Pour mettre à jour votre application :

```bash
# Modifier vos fichiers
git add .
git commit -m "Description des modifications"
git push origin main
```

Render redéploiera automatiquement !

## 🆘 Dépannage

### Erreur 404
- Vérifiez que `server.js` gère les routes SPA
- Route `app.use('*', ...)` présente

### Erreur Airtable
- Vérifiez les variables d'environnement dans Render
- Vérifiez les logs : `https://dashboard.render.com`

### Domaine ne fonctionne pas
- Attendez 24-48h pour la propagation DNS
- Vérifiez avec `dig votredomaine.com` ou `nslookup`

### SSL non fonctionnel
- Render génère automatiquement le certificat
- Peut prendre quelques minutes à quelques heures

## 📱 Optimisations post-déploiement

1. **Performance** :
   - Compresser les images
   - Minifier CSS/JS (future version)
   - Utiliser un CDN pour les assets

2. **SEO** :
   - Ajouter meta tags
   - Sitemap.xml
   - Google Analytics

3. **Monitoring** :
   - Uptimer (pour surveiller la disponibilité)
   - Google Search Console
   - Facebook Pixel Helper

## 💰 Coûts

- **Render Free** : 750h/mois (suffisant pour un site vitrine)
- **Domaine** : ~10-15€/an selon le TLD
- **Render Pro** : 7$/mois (si besoin de plus de ressources)

## 🔒 Sécurité

- ✅ HTTPS automatique
- ✅ API keys sécurisées côté serveur
- ✅ Variables d'environnement chiffrées
- ✅ Validation des données côté serveur 