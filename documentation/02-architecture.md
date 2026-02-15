# 2. Architecture (V1)

## 2.1 Vue logique
La solution est structurée en monorepo avec deux packages indépendants :
- `backend/` : API NestJS (modules métier + sécurité + Prisma)
- `frontend/` : SPA React/Vite (pages, composants, API client)

Le frontend consomme l’API via HTTPS (REST) et attache le JWT dans le header `Authorization: Bearer <token>`.

## 2.2 Architecture backend (modules)
L’API suit un découpage modulaire (pattern NestJS) :
- **Auth** : inscription/connexion, génération JWT
- **Users** : profil, gestion des centres d’intérêt (catégories)
- **Products / Categories** : lecture publique + CRUD admin
- **Orders** : création, historique utilisateur, listing admin
- **Recommendations** : recommandations selon intérêts utilisateur
- **Health** : endpoint `/health` avec check DB

Contrôles transverses :
- Validation DTO (whitelist + rejet des champs non attendus)
- JWT guard (auth) + Roles guard (admin)
- Helmet + rate limiting

## 2.3 Architecture frontend (routing)
Pages principales :
- Catalogue (public)
- Auth (login/register)
- Profil (protégé)
- Admin (protégé par rôle)
- Panier / checkout

## 2.4 Données
Le modèle de données s’articule autour de :
- `User` (rôle, intérêts)
- `Category` / `Product`
- `Order` / `OrderItem`
- `UserProductView` (historique de consultation)

## 2.5 Déploiement managé
- Déploiement sur Azure App Service (frontend et backend)
- Base PostgreSQL managée
- CI/CD GitHub Actions avec quality gates (tests + build avant deploy)
