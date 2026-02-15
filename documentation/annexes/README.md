# Annexes — Preuves visuelles du POC
L’objectif de ces annexes est de fournir des **preuves** d’exécution réelle, en **environnement managé**, et des validations (CI/CD + tests).

## 1) Captures Azure (à déposer en images)
Déposer les captures (PNG/JPG) dans `documentation/annexes/azure/` avec les noms ci‑dessous.

Captures recommandées (minimum) :
1. `azure-appservice-backend-overview.png` — App Service backend : statut, URL, région, runtime
2. `azure-appservice-backend-configuration.png` — Configuration : startup command + variables (sans secrets)
3. `azure-appservice-frontend-overview.png` — App Service frontend : statut, URL
4. `azure-postgres-overview.png` — PostgreSQL Flexible Server : statut, endpoint, région
5. (bonus) `azure-application-insights.png` — Application Insights : disponibilité / erreurs

Important : **ne jamais capturer** de secrets (JWT_SECRET, DATABASE_URL complet, etc.).

## 2) Preuves CI/CD (déjà exportées en JSON)
- `ci-backend-latest-success.json` — résumé du dernier run backend successful
- `ci-frontend-latest-success.json` — résumé du dernier run frontend successful

## 3) Preuves de tests (logs)
- `tests-unit-backend.log`
- `tests-e2e-backend.log`

## 4) Preuves runtime (HTTP)
- `runtime-health.json` — réponse brute `GET /health`
- `runtime-health-headers.txt` — headers de sécurité observés
- `runtime-products-count.txt` — preuve que le catalogue n’est pas vide
- `runtime-rate-limit-login.txt` — preuve `429` sur rafale de login

## 5) Dossier “preuves managé” (Azure CLI — sans secrets)
- `azure-webapp-backend-info.json`
- `azure-webapp-frontend-info.json`
- `azure-webapp-backend-config.json`
- `azure-postgres-info.json`
- `azure-appsettings-keys.json` — uniquement les noms des variables (pas les valeurs)
