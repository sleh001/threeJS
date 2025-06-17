# Jeu de Plateforme 3D avec Three.js

Un jeu de plateforme 3D simple utilisant Three.js avec un personnage que vous pouvez déplacer pour collecter des pièces et atteindre une plateforme de fin.

## Fonctionnalités

- Personnage 3D low-poly avec physique simplifiée
- Système de saut et gravité
- Plateformes et pièces à collecter
- Système de score
- Caméra qui suit le joueur
- Éclairage et ombres
- Intégration de modèles GLTF
- Menu de démarrage

## Prérequis

- Node.js (version 14 ou supérieure recommandée)
- Navigateur web moderne (Chrome, Firefox, Edge)

## Dépendances

Les dépendances principales sont :
- `three` (^0.152.0)
- `GLTFLoader` (inclus dans les examples de Three.js)

Dépendances de développement recommandées (si vous utilisez un serveur local) :
- `vite` (ou `webpack`, `parcel`, etc.)

## Installation

1. Clonez le dépôt ou téléchargez les fichiers sources :
   ```bash
   git clone [URL_DU_DEPOT]
   cd [NOM_DU_DEPOT]
2. Installez les dépendances :
npm install three
Ou si vous utilisez un bundler comme Vite :
npm install three vite
Structure des fichiers
text
/projet-threejs/
│── index.html          # Fichier HTML principal
│── main.js             # Script JavaScript principal
│── /Models/            # Dossier contenant les modèles 3D
│   └── untitled.glb    # Modèle GLTF
│── /textures/          # Dossier contenant les textures
│   └── stone.jpg       # Texture pour les plateformes
Configuration
Assurez-vous que :

Le modèle GLTF est placé dans /Models/untitled.glb

La texture est placée dans /textures/stone.jpg

Si vous modifiez ces chemins, mettez à jour les références dans le code :

javascript
loader.load('/Models/untitled.glb', ...);
textureLoader.load('/textures/stone.jpg', ...);
Exécution
Option 1 : Ouvrir directement le fichier HTML
Placez tous les fichiers dans la même structure de dossiers

Ouvrez index.html directement dans votre navigateur

Option 2 : Utiliser un serveur local (recommandé)
Installez Vite :

bash
npm install -g vite
Lancez le serveur :

bash
vite
Ouvrez l'URL affichée dans la console (généralement http://localhost:5173)

Commandes du jeu
Flèches directionnelles : Déplacer le personnage

Espace : Sauter

Cliquez sur le bouton "Start" : Commencer le jeu

Objectif
Déplacez votre personnage sur les plateformes

Collectez les pièces pour augmenter votre score

Atteignez la plateforme dorée pour gagner

Personnalisation
Vous pouvez facilement modifier :

La taille et position des plateformes dans createPlatform()

L'apparence du personnage en modifiant les géométries et matériaux

La physique en ajustant les valeurs de gravity, velocityY, etc.

Les modèles 3D en remplaçant le fichier GLTF

Problèmes connus
Les collisions sont basiques (AABB) et peuvent parfois être imprécises

La physique est simplifiée et peut paraître peu réaliste

Certains navigateurs peuvent nécessiter des polyfills pour WebGL
