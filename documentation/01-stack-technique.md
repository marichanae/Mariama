# 1. Stack technique (V1)

## Backend
- **Runtime** : Node.js (LTS)
- **Framework** : NestJS (TypeScript, CommonJS)
- **Base de données** : PostgreSQL
- **ORM** : Prisma
- **Auth** : JWT + Passport
- **RBAC** : rôle `USER` / `ADMIN` (guards + décorateurs)
- **Validation** : ValidationPipe global + DTO (`class-validator`, `class-transformer`)
- **Sécurité HTTP** : Helmet (headers)
- **Anti‑abus** : rate limiting (Throttling) sur endpoints sensibles
- **Tests** : Jest (unitaires + E2E) + Supertest

## Frontend
- **Framework** : React (TypeScript)
- **Bundler** : Vite
- **UI** : TailwindCSS (thème dark minimaliste)
- **Routing** : React Router
- **Auth côté client** : JWT stocké en localStorage, routes protégées (Private/Admin)
- **Panier** : React Context (état en mémoire)

## Infrastructure & industrialisation
- **Hébergement** : Azure App Service (frontend + backend)
- **DB managée** : Azure Database for PostgreSQL (Flexible Server)
- **CI/CD** : GitHub Actions (pipelines séparées backend / frontend)
- **Déploiement** : déploiement automatisé + migrations Prisma en production
- **Observabilité** : Application Insights + endpoint `/health`

## Environnements
- **Local** : backend sur `localhost:3000`, frontend sur `localhost:5173`
- **Production** : déploiement Azure (App Service) avec configuration via variables d’environnement
