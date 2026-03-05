# Scan Manager (Sh)

Application de gestion de fichiers scannés : images, lettres, photographies et dessins.

## Architecture

```
Sh/
├── backend/          # Express + Apollo Server + Prisma + MySQL
│   ├── prisma/       # Schema & migrations & seed
│   ├── src/
│   │   ├── index.ts              # Serveur Express + Apollo
│   │   ├── prisma.ts             # Client Prisma
│   │   └── schema/
│   │       ├── typeDefs.ts       # Schema GraphQL
│   │       └── resolvers.ts      # Resolvers GraphQL
│   └── uploads/      # Fichiers uploadés
│
├── frontend/         # Next.js + Mantine UI + TanStack Query + Apollo Client
│   └── src/
│       ├── app/                  # Pages Next.js (App Router)
│       ├── components/           # Composants React
│       ├── lib/                  # Utilitaires, config Apollo, requêtes GraphQL
│       └── types/                # Types TypeScript
```

## Stack technique

### Backend
- **Express** — Serveur HTTP
- **Apollo Server** — API GraphQL (local, sans redirection)
- **Prisma** — ORM avec Prisma Studio
- **MySQL** — Base de données
- **Multer** — Upload de fichiers

### Frontend
- **Next.js 15** — Framework React (App Router)
- **Mantine UI 7** — Bibliothèque de composants
- **TanStack Query** — Gestion d'état serveur + DevTools
- **Apollo Client** — Client GraphQL
- **Tabler Icons** — Icônes

### API REST (pour client lourd)
- `POST /api/upload` — Upload d'un fichier unique
- `POST /api/upload/bulk` — Upload groupé (max 20 fichiers)
- `GET /uploads/:filename` — Accès aux fichiers

## Prérequis

- Node.js >= 18
- MySQL >= 8.0
- npm ou yarn

## Installation

### 1. Base de données MySQL

Créez une base de données MySQL :

```sql
CREATE DATABASE scan_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend

# Installer les dépendances
npm install

# Configurer la connexion à la base de données
# Éditez le fichier .env avec vos identifiants MySQL
# DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/scan_manager"

# Générer le client Prisma et appliquer les migrations
npx prisma migrate dev --name init

# Peupler la base avec des données initiales
npm run prisma:seed

# Lancer le serveur de développement
npm run dev
```

Le backend sera disponible sur `http://localhost:4000`
- GraphQL : `http://localhost:4000/graphql`
- Prisma Studio : `npm run prisma:studio`

### 3. Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000`

## Modèle de données

### Scan
| Champ      | Type     | Description                           |
|------------|----------|---------------------------------------|
| id         | Int      | Identifiant unique                    |
| name       | String   | Nom du scan                           |
| author     | String   | Auteur du document                    |
| type       | Enum     | UNKNOWN, LETTER, PHOTO, DRAWING       |
| categoryId | Int      | Référence vers la catégorie           |
| category   | Category | Catégorie du scan                     |
| tags       | Tag[]    | Tags associés                         |
| files      | ScanFile[] | Fichiers associés (0..n)           |

A **ScanFile** est un objet distinct qui contient le chemin physique, le nom,
le type MIME et la taille du fichier. Un scan peut avoir zéro, un ou plusieurs
fichiers (utile pour les documents multi-pages, PDF + images, etc.).

### ScanFile
| Champ     | Type   | Description                       |
|-----------|--------|-----------------------------------|
| id        | Int    | Identifiant unique                |
| filePath  | String | Chemin relatif vers le fichier    |
| fileName  | String | Nom original du fichier           |
| mimeType  | String | Type MIME                         |
| fileSize  | Int    | Taille en octets                  |
| createdAt | Date   | Date de création                  |
| updatedAt | Date   | Date de dernière mise à jour      |

### Category
| Champ | Type   | Description            |
|-------|--------|------------------------|
| id    | Int    | Identifiant unique     |
| name  | String | Nom de la catégorie    |

### Tag
| Champ | Type   | Description        |
|-------|--------|--------------------|
| id    | Int    | Identifiant unique |
| name  | String | Nom du tag         |

## API Client Lourd

Pour uploader des fichiers depuis un client lourd, utilisez l'endpoint REST :

```bash
curl -X POST http://localhost:4000/api/upload \
  -F "file=@/chemin/vers/scan.jpg" \
  -F "name=Mon scan" \
  -F "author=Jean Dupont" \
  -F "type=PHOTO" \
  -F "categoryId=1" \
  -F 'tagIds=[1,2]'
```

## Thème

Le thème utilise des variations de noir (#141414 → #c9c9c9) et de violet (#5200ab → #f3e8ff) pour une interface moderne et élégante avec Mantine UI en mode sombre forcé.
