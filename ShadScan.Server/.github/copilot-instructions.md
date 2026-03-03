# Copilot Instructions for Scan Manager (ShadScan.Server)

Ce dépôt contient une application full-stack pour la gestion de fichiers scannés (images, lettres, photographies, dessins).

## Structure générale

- **backend/** : serveur Node.js (Express) exposant une API GraphQL et des endpoints REST pour upload.
- **frontend/** : application Next.js (App Router) utilisant Mantine UI, TanStack Query et Apollo Client.
- **prisma/** : schéma Prisma + migrations + seed data pour MySQL.

## Langages et frameworks

- Backend : TypeScript, Express, Apollo Server, Prisma, MySQL
- Frontend : TypeScript, Next.js 15, React, Mantine UI, Apollo Client, TanStack Query

## Points d'attention

- L'API GraphQL est conçue pour un usage local uniquement (pas de redirection vers le cloud).
- Les fichiers uploadés sont stockés dans `backend/uploads` et servis via `/uploads/*`.
- Le projet force le thème sombre et utilise un contraste noir/violet.
- Assurez-vous que la variable d'environnement `DATABASE_URL` pointe vers une instance MySQL valide.

## Commandes utiles

### Backend

```bash
# installer
cd backend && npm install

# lancer en dev
npm run dev

# générer client Prisma
npm run prisma:generate

# appliquer migrations
npm run prisma:migrate

# seed
pm run prisma:seed

# studio
npm run prisma:studio
```

### Frontend

```bash
cd frontend && npm install
npm run dev
npm run build
npm run start
```

## Développement & conventions

- Utiliser `tsx` pour exécuter TS directement en dev (backend) via `npm run dev`.
- Modèles Prisma : `Scan`, `Category`, `Tag` avec l'énumération `ScanType`.
- GraphQL : schéma dans `backend/src/schema`, resolvers implémentés avec Prisma.
- Frontend : composants réutilisables dans `frontend/src/components`, types TS dans `frontend/src/types`.

## Collaboration avec Copilot

- Posez des questions spécifiques : ajout de nouveaux types, requêtes GraphQL, champs supplémentaires.
- Suivez les conventions de nommage existantes (kebab-case pour dossiers, PascalCase pour composants).
- En cas de modifications de schéma Prisma, exécutez `prisma migrate dev` puis mettez à jour les types GraphQL correspondants.

## Test & validation

- Le frontend build passe : `npx next build`.
- Le backend compile sans erreurs (`npx tsc --noEmit`).
- Vérifier les endpoints REST et GraphQL avec un client (Apollo Studio, Postman, curl).

## Remarques

- Le projet n'inclut pas de CI/CD ; ajoutez des workflows GitHub si nécessaire.
- N'oubliez pas de mettre à jour la documentation dans le README à mesure que le projet évolue.
