# 🏗️ ECOSetu - Enterprise PLM & ERP

**ECOSetu** is a next-generation Product Lifecycle Management (PLM) and Enterprise Resource Planning (ERP) system. Developed by team **CodingKarma** for the **Odoo x Adani University Hackathon**, ECOSetu streamlines manufacturing operations, product versioning, and engineering change management with a focus on speed, security, and global accessibility.

---

## 🚀 Key Features

-   **Product & BoM Management**: Real-time tracking of complex products and multi-level Bills of Materials.
-   **Engineering Change Orders (ECO)**: Formalized, automated workflow for tracking and approving engineering changes.
-   **Alex: Voice-Enabled Assistant**: Perform critical actions like approving or implementing ECOs using voice commands (powered by WebSpeech API).
-   **Automated Onboarding**: When an Admin creates a new user, **Nodemailer** automatically sends credentials and role information to the employee's email.
-   **Global Reach (Multi-Currency)**: Built-in support for multiple currencies, allowing the tool to be used in international manufacturing environments.
-   **Premium Glassmorphic UI**: A stunning, high-performance interface with optimized dark mode and fluid animations using Framer Motion.
-   **Role-Based Access Control (RBAC)**: Secure, granular permissions for distinct organizational roles.

---

## 🛠️ Tech Stack

-   **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4.0.
-   **Backend**: Next.js API Routes, Prisma ORM.
-   **Database**: PostgreSQL / Prisma Client.
-   **Communication**: **Nodemailer** for automated transactional emails.
-   **Security**: **JWT (JSON Web Tokens)** for decentralized authentication and **bcryptjs** for secure hashing.
-   **Visualizations**: **Recharts** for real-time manufacturing analytics.

---

## 📊 System Roles & Workflow

ECOSetu utilizes a strictly defined hierarchy to ensure accountability and data integrity.

```mermaid
graph TD
    Admin["👤 Admin<br/>(Control Center)"]
    Engineer["⚙️ Engineer<br/>(Creator)"]
    Manager["📋 ECO Manager<br/>(Reviewer)"]
    Ops["🏗️ Operations<br/>(Implementer)"]

    Admin -->|"Creates Users<br/>(E-mail Triggers)"| Engineer
    Admin -->|"Creates Users<br/>(E-mail Triggers)"| Manager
    Admin -->|"Creates Users<br/>(E-mail Triggers)"| Ops
    
    Engineer -->|"Defines"| Product["Products & BoMs"]
    Engineer -->|"Initiates"| ECO["Change Orders (ECO)"]
    
    ECO -->|"Validates/Signs"| Manager
    Manager -->|"Approves/Rejects"| ECO
    
    ECO -->|"Deploys Change"| Ops
    Ops -->|"Closes Cycle"| Product

    classDef admin fill:#f9731688,stroke:#f97316,stroke-width:2px,color:#fff;
    classDef engineer fill:#eab30888,stroke:#facc15,stroke-width:2px,color:#fff;
    classDef manager fill:#22c55e88,stroke:#22c55e,stroke-width:2px,color:#fff;
    classDef ops fill:#3b82f688,stroke:#3b82f6,stroke-width:2px,color:#fff;
    classDef target fill:#8b5cf688,stroke:#8b5cf6,stroke-width:2px,color:#fff;

    class Admin admin;
    class Engineer engineer;
    class Manager manager;
    class Ops ops;
    class Product,ECO target;
```

---

## 📊 System Architecture

### User Journey
```mermaid
graph TD
    User["👤 User"]
    Auth["🔐 Authentication"]
    Dashboard["📊 Dashboard"]
    Product["📦 Product Mgmt"]
    BoM["🧩 BoM Mgmt"]
    ECO["📝 ECO Tracking"]
    Voice["🎙️ Alex Assistant"]
    Review["🔍 Review Flow"]
    Version["🔁 New Version"]
    DB["🗄️ Database"]

    User --> Auth --> Dashboard
    Dashboard --> Product
    Dashboard --> BoM
    Dashboard --> ECO
    Dashboard --> Voice

    Product --> DB
    BoM --> DB
    ECO --> Review --> Version --> DB

    classDef user fill:#64748b88,stroke:#475569,stroke-width:2px,color:#fff
    classDef ui fill:#2563eb88,stroke:#2563eb,stroke-width:2px,color:#fff
    classDef flow fill:#0891b288,stroke:#0891b2,stroke-width:2px,color:#fff
    classDef db fill:#ea580c88,stroke:#ea580c,stroke-width:2px,color:#fff

    class User user
    class Auth,Dashboard,Voice ui
    class Product,BoM,ECO,Review,Version flow
    class DB db

```

### Backend Architecture
```mermaid
graph LR
    subgraph "Frontend"
        V["• Vite<br/>• Next.js UI"]
        S["• Server Actions<br/>• Fetch"]
    end
    
    subgraph "Backend"
        R["• API Routes"]
        L["• Lib / Middlewares"]
        P["• Prisma Client"]
    end
    
    subgraph "Data"
        DB[("PostgreSQL")]
    end
    
    V --> S
    S -->|"HTTP Requests"| R
    R -->|"Auth/Validation"| L
    L --> R
    R --> P
    P --> DB

    style V fill:#2563eb88,stroke:#2563eb,stroke-width:1px,color:#fff
    style S fill:#3b82f688,stroke:#3b82f6,stroke-width:1px,color:#fff
    style R fill:#0891b288,stroke:#0891b2,stroke-width:1px,color:#fff
    style L fill:#0d948888,stroke:#0d9488,stroke-width:1px,color:#fff
    style P fill:#10b98188,stroke:#10b981,stroke-width:1px,color:#fff
    style DB fill:#ea580c88,stroke:#ea580c,stroke-width:2px,color:#fff
    style Frontend fill:none,stroke:#2563eb,stroke-dasharray: 5 5,color:#fff
    style Backend fill:none,stroke:#0891b2,stroke-dasharray: 5 5,color:#fff
    style Data fill:none,stroke:#ea580c,stroke-dasharray: 5 5,color:#fff
```

### Database Schema (ERD)
The system leverages a relational schema to maintain data integrity across products, components, and change orders.

```mermaid
graph LR
    User["User"]
    UserActivity["UserActivity"]
    Notification["Notification"]
    Product["Product"]
    ProductVersion["ProductVersion"]
    BoM["BoM"]
    ECO["ECO"]
    BoMComponent["BoMComponent"]
    BoMOperation["BoMOperation"]
    ECOChange["ECOChange"]
    ECOApproval["ECOApproval"]
    ECOAuditLog["ECOAuditLog"]

    User --- UserActivity
    User --- Notification
    Product --- ProductVersion
    Product --- BoM
    Product --- ECO
    BoM --- BoMComponent
    BoM --- BoMOperation
    ECO --- ECOChange
    ECO --- ECOApproval
    ECO --- ECOAuditLog

    style User fill:#f9731688,stroke:#f97316,stroke-width:1px,color:#fff
    style UserActivity fill:#eab30888,stroke:#facc15,stroke-width:1px,color:#fff
    style Notification fill:#eab30888,stroke:#facc15,stroke-width:1px,color:#fff

    style Product fill:#22c55e88,stroke:#22c55e,stroke-width:1px,color:#fff
    style ProductVersion fill:#3b82f688,stroke:#3b82f6,stroke-width:1px,color:#fff
    style BoM fill:#3b82f688,stroke:#3b82f6,stroke-width:1px,color:#fff
    style ECO fill:#3b82f688,stroke:#3b82f6,stroke-width:1px,color:#fff

    style BoMComponent fill:#8b5cf688,stroke:#8b5cf6,stroke-width:1px,color:#fff
    style BoMOperation fill:#8b5cf688,stroke:#8b5cf6,stroke-width:1px,color:#fff

    style ECOChange fill:#ec489988,stroke:#ec4899,stroke-width:1px,color:#fff
    style ECOApproval fill:#ec489988,stroke:#ec4899,stroke-width:1px,color:#fff
    style ECOAuditLog fill:#ec489988,stroke:#ec4899,stroke-width:1px,color:#fff

        %% ===== LEGEND =====
    LegendUA["• UserActivity<br/>• Notification"]
    LegendCore["• ProductVersion<br/>• BoM<br/>• ECO"]
    LegendBoM["• BoMComponent<br/>• BoMOperation"]
    LegendECO["• ECOChange<br/>• ECOApproval<br/>• ECOAuditLog"]


    style LegendUA fill:#eab30888,stroke:#facc15,stroke-width:2px,color:#fff
    style LegendCore fill:#3b82f688,stroke:#3b82f6,stroke-width:2px,color:#fff
    style LegendBoM fill:#8b5cf688,stroke:#8b5cf6,stroke-width:2px,color:#fff
    style LegendECO fill:#ec489988,stroke:#ec4899,stroke-width:2px,color:#fff


```

---

## 🛠️ Getting Started

### Prerequisites
-   Node.js (latest LTS)
-   PostgreSQL Database

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/PARTH-JADAV20/ECOSetu.git
    cd ECOSetu
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/ecosetu"
    JWT_SECRET="your-secret-key"
    EMAIL_USER="your-email@example.com"
    EMAIL_PASS="your-app-password"
    ```

4.  **Database Sync**:
    ```bash
    npx prisma db push
    npm run prisma:seed
    ```

5.  **Launch**:
    ```bash
    npm run dev
    ```

---

## 🤝 The Team (CodingKarma)

This project was built with ❤️ for the **Odoo x Adani University Hackathon**. 

---

## 📄 License
This project is licensed under the MIT License.
