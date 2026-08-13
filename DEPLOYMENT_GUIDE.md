# 🛡️ SentinAI Cloud Deployment Guide

This guide provides step-by-step instructions for deploying **SentinAI NextGen Agentic SOC** to the cloud.

---

## 📋 Required Environment Variables

Before deploying, ensure you have the following credentials ready:

| Variable | Description | Required? | Example |
| :--- | :--- | :--- | :--- |
| `GROQ_API_KEY` | API Key for Meta Llama 3.3 reasoning model | **Yes** | `gsk_...` |
| `VITE_BACKEND_URL` | Cloud URL of your Python backend API | **Yes** (for Frontend) | `https://sentinai-api.onrender.com` |
| `SENDER_EMAIL` | Email used to dispatch incident reports | Optional | `alerts@company.com` |
| `SMTP_PASSWORD` | App password / Mailtrap token for SMTP | Optional | `abcd efgh ijkl mnop` |
| `SENTINAI_PORT` | Port for FastAPI backend | Optional | `8000` |

---

## 🚀 Option 1: Render.com Deployment (Recommended - Easiest & Free)

Render supports both Python backend services and static web frontend hosting out of the box.

### Step 1: Push Project to GitHub
Make sure your repository has the latest code pushed:
```bash
git add .
git commit -m "Add cloud deployment configuration"
git push origin main
```

### Step 2: Deploy Backend Service on Render
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository: `priyansdwivedi123/SentinAI-NextGen-Agentic-SOC`.
4. Fill in the following settings:
   - **Name:** `sentinai-backend`
   - **Environment:** `Python 3`
   - **Build Command:** `cd Backend && pip install -r requirements.txt`
   - **Start Command:** `cd Backend && uvicorn sentinai_enterprise_backend:app --host 0.0.0.0 --port $PORT`
5. Under **Environment Variables**, add:
   - `GROQ_API_KEY` = `<your-groq-api-key>`
   - `SENDER_EMAIL` = `<your-email>`
   - `SMTP_PASSWORD` = `<your-app-password>`
6. Click **Create Web Service**. Note your backend URL (e.g., `https://sentinai-backend.onrender.com`).

### Step 3: Deploy Frontend on Render
1. Click **New +** -> **Static Site**.
2. Select your repository `priyansdwivedi123/SentinAI-NextGen-Agentic-SOC`.
3. Configure settings:
   - **Name:** `sentinai-soc`
   - **Build Command:** `cd frontend && npm install --legacy-peer-deps && npm run build`
   - **Publish Directory:** `./frontend/dist`
4. Under **Environment Variables**, add:
   - `VITE_BACKEND_URL` = `https://sentinai-backend.onrender.com` (use your Backend URL from Step 2)
5. Click **Create Static Site**.

---

## ⚡ Option 2: Deploy Frontend on Vercel + Backend on Render / Railway

### Step 1: Deploy Backend on Render / Railway
Follow **Step 2** from Option 1 above to deploy `sentinai-backend`.

### Step 2: Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Import your GitHub repository `priyansdwivedi123/SentinAI-NextGen-Agentic-SOC`.
3. Set **Root Directory** to `frontend`.
4. Framework Preset will auto-detect as **Vite**.
5. Add Environment Variable:
   - Name: `VITE_BACKEND_URL`
   - Value: `https://sentinai-backend.onrender.com`
6. Click **Deploy**.

---

## 🐳 Option 3: Deploy on Cloud VPS (AWS EC2 / DigitalOcean / GCP) using Docker Compose

If you have an Ubuntu Cloud VM (AWS EC2, DigitalOcean Droplet, Linode, Hetzner, etc.):

### Step 1: SSH into your Cloud Server
```bash
ssh ubuntu@your-server-ip
```

### Step 2: Install Docker & Git
```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable --now docker
```

### Step 3: Clone Repository
```bash
git clone https://github.com/priyansdwivedi123/SentinAI-NextGen-Agentic-SOC.git
cd SentinAI-NextGen-Agentic-SOC
```

### Step 4: Configure Environment Variables
Create a `.env` file in the root folder:
```bash
cat << 'EOF' > .env
GROQ_API_KEY=your_groq_api_key_here
SENDER_EMAIL=your_email@example.com
SMTP_PASSWORD=your_smtp_app_password
VITE_BACKEND_URL=http://your-server-ip:8000
EOF
```

### Step 5: Launch Container Stack
```bash
docker compose up -d --build
```

### Step 6: Verify Running Containers
```bash
docker compose ps
```
- Frontend will be accessible at `http://your-server-ip` (Port 80)
- Backend API will be accessible at `http://your-server-ip:8000`

---

## 🔍 Verification & Healthcheck

1. Open your browser and navigate to your frontend URL.
2. Log in or create an operator account.
3. Access the **Command Center** dashboard.
4. Verify telemetry domains report `Secured` status and real-time scanning connects to your backend URL.
