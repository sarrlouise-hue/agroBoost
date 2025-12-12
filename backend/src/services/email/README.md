# Service Email - AgroBoost

Ce service permet d'envoyer des emails transactionnels pour l'application AgroBoost.

## 📧 Templates disponibles

1. **welcome.html** - Email de bienvenue lors de la création de compte
2. **otp.html** - Email contenant le code OTP de vérification
3. **password-reset-request.html** - Email de demande de réinitialisation de mot de passe
4. **password-reset-confirmation.html** - Email de confirmation après réinitialisation du mot de passe

## 🚀 Installation

Assurez-vous d'avoir `nodemailer` installé :

```bash
npm install nodemailer
```

## ⚙️ Configuration

Ajoutez les variables d'environnement suivantes dans votre fichier `.env` :

```env
# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=votre-email@gmail.com
EMAIL_PASSWORD=votre-mot-de-passe-application
EMAIL_FROM_EMAIL=votre-email@gmail.com
EMAIL_FROM_NAME=AgroBoost
EMAIL_APP_NAME=AgroBoost
EMAIL_SUPPORT_EMAIL=support@agroboost.com
FRONTEND_URL=http://localhost:3001
```

### Configuration Gmail

Pour utiliser Gmail, vous devez :
1. Activer l'authentification à deux facteurs
2. Générer un mot de passe d'application : https://myaccount.google.com/apppasswords
3. Utiliser ce mot de passe dans `EMAIL_PASSWORD`

### Autres fournisseurs SMTP

- **Outlook/Hotmail** : `smtp-mail.outlook.com:587`
- **Yahoo** : `smtp.mail.yahoo.com:587`
- **SendGrid** : `smtp.sendgrid.net:587`
- **Mailgun** : `smtp.mailgun.org:587`

## 📝 Utilisation

```javascript
const emailService = require('./services/email/email.service');

// Envoyer un email de bienvenue
await emailService.sendWelcomeEmail(user);

// Envoyer un code OTP
await emailService.sendOTPEmail(user.email, otpCode, user.firstName);

// Envoyer une demande de réinitialisation
await emailService.sendPasswordResetRequestEmail(user, resetToken);

// Envoyer une confirmation de réinitialisation
await emailService.sendPasswordResetConfirmationEmail(user);
```

## 🎨 Personnalisation des templates

Les templates HTML sont situés dans `backend/src/services/email/templates/`.

Chaque template utilise des variables entre `{{}}` qui sont remplacées dynamiquement :
- `{{firstName}}` - Prénom de l'utilisateur
- `{{lastName}}` - Nom de l'utilisateur
- `{{email}}` - Email de l'utilisateur
- `{{appName}}` - Nom de l'application
- `{{otpCode}}` - Code OTP
- `{{resetUrl}}` - URL de réinitialisation
- `{{supportEmail}}` - Email de support
- etc.

Vous pouvez modifier directement les fichiers HTML pour personnaliser le design.

## 🔧 Intégration dans les services

### Exemple : Service d'authentification

```javascript
const emailService = require('../email/email.service');

// Après la création d'un compte
const user = await userRepository.create(userData);
await emailService.sendWelcomeEmail(user);
```

### Exemple : Service OTP

```javascript
const emailService = require('../email/email.service');

// Après génération d'un OTP
const otp = await createOTP(phoneNumber);
if (user.email) {
  await emailService.sendOTPEmail(user.email, otp.code, user.firstName);
}
```

### Exemple : Service de mot de passe

```javascript
const emailService = require('../email/email.service');

// Après création d'un token de réinitialisation
const resetToken = await createPasswordResetToken(userId);
await emailService.sendPasswordResetRequestEmail(user, resetToken.token);

// Après réinitialisation réussie
await emailService.sendPasswordResetConfirmationEmail(user);
```

## 🐛 Dépannage

### Erreur "Invalid login"
- Vérifiez que `EMAIL_USER` et `EMAIL_PASSWORD` sont corrects
- Pour Gmail, utilisez un mot de passe d'application, pas votre mot de passe principal

### Erreur "Connection timeout"
- Vérifiez que `EMAIL_HOST` et `EMAIL_PORT` sont corrects
- Vérifiez votre connexion internet
- Vérifiez les paramètres de pare-feu

### Les emails ne sont pas reçus
- Vérifiez le dossier spam
- Vérifiez que l'adresse email de destination est valide
- Vérifiez les logs pour voir si l'email a été envoyé avec succès

