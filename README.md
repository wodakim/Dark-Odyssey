# Dark Odyssey - Idle RPG Multijoueur

![Dark Odyssey Logo](/client/public/assets/ui/logo.png)

## 📖 À propos

Dark Odyssey est un jeu idle RPG multijoueur avec une aventure pleine de péripéties et d'humour noir. Explorez un monde généré aléatoirement, personnalisez votre avatar, collectez des équipements uniques et affrontez des monstres de plus en plus puissants.

## ✨ Fonctionnalités

- **Système Idle** : Progressez même lorsque vous êtes hors ligne
- **Monde Généré Aléatoirement** : Chaque zone est unique et générée procéduralement
- **Personnalisation Avancée** : Créez et personnalisez votre avatar avec des équipements visibles
- **Système de Combat** : Affrontez des monstres avec différentes stratégies
- **Équipements Uniques** : Découvrez des objets rares avec des statistiques aléatoires
- **Multijoueur** : Jouez avec vos amis, formez des guildes et chattez en temps réel
- **Humour Noir** : Une aventure avec un ton décalé et des situations absurdes

## 🚀 Technologies Utilisées

### Frontend
- React
- Redux Toolkit
- Pixi.js
- Socket.io-client
- Styled Components

### Backend
- Node.js
- Express
- MongoDB
- Socket.io
- JWT pour l'authentification

## 🛠️ Installation

### Prérequis
- Node.js (v14+)
- MongoDB
- Git

### Étapes d'installation

1. Clonez le dépôt
```bash
git clone https://github.com/votre-username/dark-odyssey.git
cd dark-odyssey
```

2. Installez les dépendances du frontend
```bash
cd client
npm install
```

3. Installez les dépendances du backend
```bash
cd ../server
npm install
```

4. Configurez les variables d'environnement
```bash
cp .env.example .env
# Modifiez le fichier .env avec vos propres valeurs
```

5. Lancez le serveur de développement
```bash
# Dans le dossier server
npm run dev

# Dans un autre terminal, dans le dossier client
npm run dev
```

6. Accédez à l'application dans votre navigateur à l'adresse `http://localhost:5173`

## 🌐 Déploiement

### Déploiement sur Render.com

1. Créez un compte sur [Render.com](https://render.com)
2. Connectez votre dépôt GitHub
3. Créez un nouveau service Web pour le backend
   - Répertoire : `server`
   - Commande de build : `npm install`
   - Commande de démarrage : `npm start`
4. Créez un nouveau service statique pour le frontend
   - Répertoire : `client`
   - Commande de build : `npm run build`
   - Répertoire de publication : `dist`
5. Configurez les variables d'environnement nécessaires

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👥 Contributeurs

- [Votre Nom](https://github.com/votre-username)

## 🙏 Remerciements

- Merci à tous ceux qui ont contribué à ce projet
- Inspiré par des jeux comme Idle Champions, Melvor Idle et Raid Shadow Legends

