# Schémas Mermaid — La Petite Maison de l'Épouvante

> Diagrammes techniques pour le rapport. Tous les schémas sont fidèles au code source réel.

---

## 1. Architecture réelle du système

```mermaid
flowchart TB
  subgraph USERS["👤 Utilisateurs"]
    BROWSER["Navigateur Web"]
  end

  subgraph GITHUB["GitHub"]
    REPO["marichanae/Mariama\n(monorepo)"]
    GHA["GitHub Actions\nCI/CD"]
    SECRETS["GitHub Secrets\nAZURE_CREDENTIALS\nAZURE_DATABASE_URL"]
  end

  subgraph AZURE["☁️ Microsoft Azure — France Central"]
    subgraph FRONTEND_SVC["App Service : petite-epouvante-frontend"]
      FE["React 19 + Vite\nNode 22 LTS\npm2 serve --spa"]
    end

    subgraph BACKEND_SVC["App Service : petite-epouvante-backend"]
      BE["NestJS 11\nNode 22 LTS\nnode dist/main.js"]
      HELMET["Helmet"]
      THROTTLE["ThrottlerModule"]
      JWT["JWT + Passport"]
      PRISMA["Prisma ORM"]
    end

    subgraph DB_SVC["PostgreSQL Flexible Server"]
      DB[("petite-epouvante-pg\nv16 — 32 Go\nSSL obligatoire")]
    end

    INSIGHTS["Application Insights"]
  end

  BROWSER -->|"HTTPS"| FE
  FE -->|"REST API\nAuthorization: Bearer JWT"| BE
  BE --- HELMET
  BE --- THROTTLE
  BE --- JWT
  BE --> PRISMA -->|"SSL/TLS"| DB
  BE -.->|"Télémétrie"| INSIGHTS

  GHA -->|"Deploy backend"| BACKEND_SVC
  GHA -->|"Deploy frontend dist/"| FRONTEND_SVC
  GHA -->|"prisma migrate deploy"| DB
  REPO --> GHA
  SECRETS -.-> GHA

  style AZURE fill:#0f1129,stroke:#7c3aed,stroke-width:2px,color:#fff
  style FRONTEND_SVC fill:#1a1a2e,stroke:#3fb950,stroke-width:2px,color:#fff
  style BACKEND_SVC fill:#1a1a2e,stroke:#f0883e,stroke-width:2px,color:#fff
  style DB_SVC fill:#1e3a5f,stroke:#336791,stroke-width:2px,color:#fff
  style GITHUB fill:#161b22,stroke:#58a6ff,stroke-width:2px,color:#fff
  style USERS fill:#111,stroke:#555,color:#fff
```

---

## 2. Pipeline CI/CD avec Quality Gates

```mermaid
flowchart LR
  PUSH["🔀 git push / PR\nsur main"] --> TRIGGER{"Path filter"}
  TRIGGER -->|"backend/**"| BACK_CI
  TRIGGER -->|"frontend/**"| FRONT_CI

  subgraph BACK_CI["⚙️ Backend CI — build-and-test"]
    direction LR
    BC1["📥 Checkout + Node 22"] --> BC2["📦 npm ci"]
    BC2 --> BC3["🗄️ Prisma migrate"]
    BC3 --> BC4["⚡ Prisma generate"]
    BC4 --> BC5["🧪 Tests Jest"]
    BC5 --> BC6["🧪 Tests E2E"]
    BC6 --> BC7["🏗️ Build TS"]
  end

  BC7 -->|"✅ Quality Gate"| GATE{"🚦 Gate"}
  GATE -->|"❌ Fail"| STOP["🛑 Bloqué"]
  GATE -->|"✅ Pass + main"| BACK_CD

  subgraph BACK_CD["🚀 Backend CD — deploy"]
    direction LR
    BD1["📦 npm ci + build"] --> BD2["✂️ prune"]
    BD2 --> BD3["🔐 Azure Login"]
    BD3 --> BD4["🗄️ Prisma migrate"]
    BD4 --> BD5["☁️ Deploy"]
  end

  subgraph FRONT_CI["⚙️ Frontend CI/CD — build-and-deploy"]
    direction LR
    FC1["📥 Checkout + Node 22"] --> FC2["📦 npm ci"]
    FC2 --> FC3["🏗️ Vite build"]
    FC3 --> FC4["🔐 Azure Login"]
    FC4 --> FC5["☁️ Deploy"]
  end

  BD5 --> HEALTH["💚 /health OK"]
  FC5 --> LIVE["🌐 Frontend live"]

  style BACK_CI fill:#161b22,stroke:#f0883e,stroke-width:2px,color:#fff
  style BACK_CD fill:#161b22,stroke:#3fb950,stroke-width:2px,color:#fff
  style FRONT_CI fill:#161b22,stroke:#58a6ff,stroke-width:2px,color:#fff
  style STOP fill:#7f1d1d,stroke:#b91c1c,color:#fca5a5
  style GATE fill:#1c1917,stroke:#fbbf24,stroke-width:2px,color:#fff
  style HEALTH fill:#052e16,stroke:#3fb950,color:#bbf7d0
  style LIVE fill:#052e16,stroke:#3fb950,color:#bbf7d0
```

---

## 3. Authentification JWT + RBAC

```mermaid
sequenceDiagram
  actor U as 👤 Utilisateur
  participant F as Frontend React
  participant H as Helmet + ThrottlerGuard
  participant A as AuthController
  participant S as AuthService
  participant DB as PostgreSQL
  participant JWT as JwtService

  Note over U,JWT: ── Phase 1 : Inscription ──
  U->>F: Saisit email, mot de passe, centres d'intérêt
  F->>H: POST /auth/register
  H->>H: Rate limit check (5 req/60s)
  H->>A: ValidationPipe (whitelist + forbidNonWhitelisted)
  A->>S: register(dto)
  S->>DB: SELECT user WHERE email = ?
  DB-->>S: null (email libre)
  S->>S: bcrypt.hash(password, 10)
  S->>DB: INSERT User + interests
  DB-->>S: user créé
  S->>JWT: sign({ sub, email, role }, secret, { expiresIn: '1h' })
  JWT-->>S: accessToken
  S-->>F: { accessToken, user: { id, email, role } }
  Note over F: Stocke le token (localStorage)

  Note over U,JWT: ── Phase 2 : Connexion ──
  U->>F: Saisit email + mot de passe
  F->>H: POST /auth/login
  H->>H: Rate limit check (10 req/60s)
  H->>A: ValidationPipe
  A->>S: login(dto)
  S->>DB: SELECT user WHERE email = ?
  DB-->>S: user (avec hash)
  S->>S: bcrypt.compare(password, hash)
  S->>JWT: sign({ sub: userId, email, role })
  JWT-->>S: accessToken
  S-->>F: { accessToken, user: { id, email, role: ADMIN|USER } }

  Note over U,JWT: ── Phase 3 : Accès protégé (ex: POST /products) ──
  F->>H: POST /products + Authorization: Bearer <token>
  H->>H: Helmet headers + global throttle (100/60s)
  Note over H: JwtAuthGuard
  H->>H: ExtractJwt.fromAuthHeaderAsBearerToken()
  H->>H: Verify signature + expiration
  H->>H: validate() → { userId, email, role }
  Note over H: RolesGuard
  H->>H: @Roles('ADMIN') → user.role === 'ADMIN' ?
  alt role = ADMIN
    H->>A: ✅ Requête autorisée → Controller
    A->>DB: INSERT Product
    DB-->>F: 201 Created
  else role = USER
    H-->>F: ❌ 403 Forbidden
  else pas de token
    H-->>F: ❌ 401 Unauthorized
  end
```

---

## 4. Cycle DevSecOps intégré

```mermaid
flowchart LR
  subgraph PLAN["📋 PLAN"]
    P1["Modélisation des menaces"]
    P2["Exigences sécurité\nOWASP Top 10"]
  end

  subgraph CODE["💻 CODE"]
    C1["TypeScript strict"]
    C2["ValidationPipe\nwhitelist + forbid"]
    C3["bcrypt (hash)\nJWT (auth)"]
    C4["Prisma ORM\n(pas de SQL brut)"]
  end

  subgraph BUILD["🏗️ BUILD"]
    B1["npm ci\n(lockfile exact)"]
    B2["tsc --strict\n(type checking)"]
  end

  subgraph TEST["🧪 TEST"]
    T1["Tests unitaires\nJest (AuthService,\nProducts, Orders,\nRecommendations)"]
    T2["Tests E2E\nSupertest\n(Auth, Products,\nHealth)"]
  end

  subgraph RELEASE["📦 RELEASE"]
    R1["npm prune\n--omit=dev"]
    R2["Quality Gate\nCI verte obligatoire"]
  end

  subgraph DEPLOY["☁️ DEPLOY"]
    D1["Azure App Service\nNode 22 LTS"]
    D2["Secrets GitHub\n→ Azure App Settings"]
    D3["Prisma migrate\ndeploy (prod)"]
  end

  subgraph OPERATE["🔒 OPERATE"]
    O1["Helmet\n(11 headers)"]
    O2["CORS restrictif\n(whitelist)"]
    O3["Rate limiting\n(Throttler)"]
    O4["HSTS + TLS 1.2"]
    O5["/health\n(observabilité)"]
  end

  subgraph MONITOR["📊 MONITOR"]
    M1["Application Insights"]
    M2["/health → DB check"]
    M3["Logs Azure"]
  end

  PLAN --> CODE --> BUILD --> TEST --> RELEASE --> DEPLOY --> OPERATE --> MONITOR
  MONITOR -.->|"Feedback loop"| PLAN

  style PLAN fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff
  style CODE fill:#172554,stroke:#60a5fa,stroke-width:2px,color:#dbeafe
  style BUILD fill:#052e16,stroke:#4ade80,stroke-width:2px,color:#dcfce7
  style TEST fill:#422006,stroke:#f59e0b,stroke-width:2px,color:#fef3c7
  style RELEASE fill:#431407,stroke:#f97316,stroke-width:2px,color:#ffedd5
  style DEPLOY fill:#1e1b4b,stroke:#a78bfa,stroke-width:2px,color:#ede9fe
  style OPERATE fill:#7f1d1d,stroke:#ef4444,stroke-width:2px,color:#fecaca
  style MONITOR fill:#164e63,stroke:#22d3ee,stroke-width:2px,color:#cffafe
```

---

## 5. Sécurisation du Checkout (recalcul serveur)

```mermaid
sequenceDiagram
  actor U as 👤 Client
  participant F as Frontend React
  participant G as Guards (JWT + RBAC)
  participant O as OrdersController
  participant S as OrdersService
  participant DB as PostgreSQL

  Note over U,DB: ── Le client ne transmet JAMAIS de prix ──

  U->>F: Ajoute des produits au panier
  Note over F: Panier local :\n[{ productId, quantity }]
  U->>F: Valide la commande

  F->>G: POST /orders\nAuthorization: Bearer <token>\nBody: { items: [{ productId, quantity }] }
  Note over F: ⚠️ Aucun prix dans le payload

  G->>G: JwtAuthGuard → vérifie token
  G->>G: Extrait userId du JWT
  G->>O: Requête autorisée

  O->>S: createForUser(userId, items)

  S->>DB: SELECT * FROM Product\nWHERE id IN (productIds)
  DB-->>S: products[] (avec prix réels)

  Note over S: Vérification d'intégrité
  alt Produit introuvable
    S-->>F: ❌ 404 "Un des produits est introuvable"
  end

  Note over S: 🔒 Recalcul serveur du total
  S->>S: Pour chaque item :\nunitPrice = product.price (DB)\n⛔ JAMAIS le prix client
  S->>S: total = Σ(unitPrice × quantity)

  S->>DB: INSERT Order { userId, total }\nINSERT OrderItem[] { productId, quantity, unitPrice }
  DB-->>S: commande créée

  S-->>F: 201 { order, items[{ product, quantity, unitPrice }] }
  F-->>U: ✅ Confirmation de commande\nTotal: XX.XX €

  Note over U,DB: 🛡️ Même si le client envoie un faux prix,\nle serveur le recalcule depuis la base de données.
```

---

## 6. Modèle de données (ER)

```mermaid
erDiagram
  USER ||--o{ ORDER : "passe"
  USER }o--o{ CATEGORY : "centres d'intérêt"
  CATEGORY ||--o{ PRODUCT : "contient"
  ORDER ||--|{ ORDER_ITEM : "composé de"
  PRODUCT ||--o{ ORDER_ITEM : "commandé dans"

  USER {
    uuid id PK
    string email UK
    string password "bcrypt hash"
    enum role "USER | ADMIN"
    datetime createdAt
  }
  CATEGORY {
    uuid id PK
    string name UK
  }
  PRODUCT {
    uuid id PK
    string name
    string description
    float price
    enum type "PHYSICAL | DIGITAL"
    string imageUrl
    uuid categoryId FK
    datetime createdAt
  }
  ORDER {
    uuid id PK
    float total "recalculé serveur"
    uuid userId FK
    datetime createdAt
  }
  ORDER_ITEM {
    uuid id PK
    int quantity
    float unitPrice "prix DB au moment de la commande"
    uuid orderId FK
    uuid productId FK
  }
```
