# 🚀 SportZone E-Commerce: Render Cloud Deployment Guide

This guide provides complete instructions for deploying the **SportZone Full-Stack Application** (Spring Boot 3 + PostgreSQL + React Vite) to [Render](https://render.com).

---

## 📋 Architectural Overview

- **Backend**: Java 17, Spring Boot 3.3.3, JPA / Hibernate, JWT Security. Packaged into an optimized, secure non-root Docker container (`eclipse-temurin:17-jre-jammy`).
- **Database**: Render Managed PostgreSQL Database (`sportzone-postgres`). Credentials and connection URLs are automatically adapted at runtime via `DatabaseConfig.java`.
- **Frontend**: React 18, Vite 5, Tailwind CSS. Deployed as a high-speed Render Static Site with automatic SPA URL rewrites (`/* -> /index.html`).

---

## ⚡ Method 1: Automated 1-Click Deployment via Blueprint (`render.yaml`)

The repository includes a ready-to-use [`render.yaml`](./render.yaml) Infrastructure-as-Code blueprint.

### Steps:
1. **Push your repository to GitHub / GitLab**.
2. **Log in to Render** at [dashboard.render.com](https://dashboard.render.com).
3. In the top navigation, click **New +** and select **Blueprint**.
4. Connect your GitHub/GitLab repository.
5. Render will automatically detect `render.yaml` and display the planned resources:
   - **Database**: `sportzone-postgres` (PostgreSQL)
   - **Backend Web Service**: `sportzone-backend` (Docker)
   - **Frontend Static Site**: `sportzone-frontend` (Static Site)
6. Click **Apply**.
7. Render will automatically:
   - Provision the PostgreSQL database.
   - Inject `DATABASE_URL` into the backend.
   - Build the backend Docker container and start the Spring Boot API.
   - Build the frontend static site with `VITE_API_BASE_URL` pointing to the backend.

---

## 🛠️ Method 2: Manual Dashboard Deployment

If you prefer deploying services individually through the Render Web Dashboard, follow these steps:

### Step 1: Create the PostgreSQL Database
1. Go to **Dashboard** $\rightarrow$ **New +** $\rightarrow$ **PostgreSQL**.
2. Set the configuration:
   - **Name**: `sportzone-postgres`
   - **Database**: `sportzone_db`
   - **User**: `sportzone_user`
   - **Region**: Oregon (or your preferred region)
   - **Plan**: Free
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g. `postgresql://sportzone_user:password@dpg-xxxx-a:5432/sportzone_db`).

---

### Step 2: Create the Backend Web Service
1. Go to **Dashboard** $\rightarrow$ **New +** $\rightarrow$ **Web Service**.
2. Connect your repository.
3. Configure the settings:
   - **Name**: `sportzone-backend`
   - **Language / Runtime**: `Docker`
   - **Root Directory**: `sportzone/backend` (or leave empty if repository root is backend)
   - **Dockerfile Path**: `Dockerfile`
   - **Region**: Same region as database (e.g. Oregon)
   - **Plan**: Free
4. Under **Advanced** $\rightarrow$ **Health Check Path**, enter:
   - `/health`
5. Under **Environment Variables**, add the following:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | `postgres` | Activates PostgreSQL datasource & Hibernate dialect |
| `DATABASE_URL` | *(Paste Internal Database URL from Step 1)* | Database connection credentials |
| `PORT` | `8080` | Dynamic port binding |
| `CORS_ALLOWED_ORIGINS` | `https://sportzone-frontend.onrender.com,https://*.onrender.com` | Allowed frontend domains |
| `JWT_SECRET` | *(Generate a 64-char hex string or random key)* | Signs athlete JWT tokens |

6. Click **Create Web Service**.
7. Once deployed, note down your backend URL: e.g. `https://sportzone-backend.onrender.com`.

---

### Step 3: Create the Frontend Static Site
1. Go to **Dashboard** $\rightarrow$ **New +** $\rightarrow$ **Static Site**.
2. Connect your repository.
3. Configure the settings:
   - **Name**: `sportzone-frontend`
   - **Root Directory**: `frontend` (or `sportzone/frontend`)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects / Rewrites**, add the Single Page App (SPA) rule:
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   *(This ensures client-side routes like `/shop`, `/checkout`, `/orders` do not return 404 on page refresh).*
5. Under **Environment Variables**, add:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://sportzone-backend.onrender.com` | Live backend API URL |

6. Click **Create Static Site**.

---

## 🔍 Verification & Health Checks

1. **Backend Health Check**:
   Visit `https://<your-backend>.onrender.com/health` in your browser.
   Expected response:
   ```json
   {
     "status": "UP",
     "service": "SportZone E-Commerce Backend",
     "platform": "Render Cloud Production",
     "timestamp": "2026-09-10T..."
   }
   ```

2. **Frontend Storefront**:
   Visit `https://<your-frontend>.onrender.com`.
   - Sign in via the athletic Gmail verification gateway or demo account.
   - Browse catalog products across Football, Badminton, Cricket, Running, Cycling, etc.
   - Add gear to cart, proceed to checkout, and verify the sequential **Place Order $\rightarrow$ Address $\rightarrow$ Summary $\rightarrow$ Payment** flow with instant confirmation popup.

---

## 💡 Troubleshooting & FAQs

- **Database Connection Failed (`sslmode`)**: Render managed databases require SSL. The built-in `DatabaseConfig.java` automatically appends `?sslmode=require` to all parsed JDBC URLs.
- **CORS Blocked in Browser**: Ensure `CORS_ALLOWED_ORIGINS` on the backend includes your frontend Render URL or uses the default `https://*.onrender.com` pattern.
- **Client Route 404 on Refresh**: Ensure the rewrite rule `/* -> /index.html` is added to the Frontend Static Site settings in Render.
- **Cold Starts**: Render's free tier spins down idle instances after 15 minutes of inactivity. The first request after spindown may take ~30-50 seconds to initialize.
