# ShadScan — numérisation et classement de documents

Application monorepo pour numériser des lettres et documents depuis un scanner réseau, extraire le texte (OCR) et classer les documents par date d'émission / date de réception à l'aide d'un pipeline AI extensible.

Principales composantes
- Backend: FastAPI (ingestion, OCR, extraction, classification)
- Frontend: Next.js (TypeScript + Tailwind) — interface pour parcourir / filtrer documents
- Persistance: Prisma (schema + seed) — SQLite par défaut pour le dev
- IA: implémentation par défaut avec Tesseract + heuristiques; option OpenAI via `OPENAI_API_KEY`.

Démarrage rapide (local)
1. Copier l'exemple d'env et ajuster si besoin:
   cp .env.example .env
2. Lancer en local avec Docker:
   make up
3. Frontend: http://localhost:3000
   Backend API docs: http://localhost:8000/docs

Scanner réseau — options d'ingestion
- Webhook HTTP: configurez votre scanner pour POSTer l'image à `http://<host>:8000/ingest`.
- Dossier partagé (SMB/FTP): déposer des fichiers dans le dossier configuré `SCANNER_WATCH_DIR`; le backend les importera.

Activer l'IA améliorée
- Par défaut le pipeline utilise Tesseract pour l'OCR. Pour utiliser un modèle externe (p. ex. OpenAI), définissez `OPENAI_API_KEY` dans `.env`.

Prochaines étapes recommandées
- Connecter votre scanner (webhook ou SMB drop)
- Ajuster les règles d'extraction des dates selon vos documents
- Remplacer le classifyeur par un modèle ML si vous avez besoin de meilleure précision

Licence: MIT
