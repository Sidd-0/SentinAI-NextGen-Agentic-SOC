#!/bin/bash
set -e

echo "========================================================="
echo "   🚀 SENTINAI ENTERPRISE SOC - AUTOMATED DEPLOYMENT     "
echo "========================================================="

ENV_FILE="/etc/sentinai.env"

# 0. Setup Permanent Environment Secret File (/etc/sentinai.env)
if [ ! -f "${ENV_FILE}" ]; then
    echo "[0/6] Creating permanent secret file at ${ENV_FILE}..."
    KEY_TO_SAVE="${GROQ_API_KEY}"
    if [ -z "${KEY_TO_SAVE}" ]; then
        read -p "Enter your Groq API Key (GROQ_API_KEY): " KEY_TO_SAVE
    fi
    cat <<EOF > "${ENV_FILE}"
GROQ_API_KEY=${KEY_TO_SAVE}
PYTHONUNBUFFERED=1
EOF
    chmod 600 "${ENV_FILE}"
    echo "Saved permanent secret key in ${ENV_FILE} (permissions 600)."
else
    echo "[0/6] Using existing secret configuration at ${ENV_FILE}."
fi

# 1. Update system packages & install dependencies (Node 22 LTS)
echo "[1/6] Installing Linux packages & Node.js 22 LTS..."
apt-get update -y
apt-get install -y git python3 python3-pip python3-venv curl ufw
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs nginx

# 2. Configure Firewall (Open Ports 80, 443, 22)
echo "[2/6] Configuring Firewall rules (Ports 22, 80, 443)..."
ufw allow 22/tcp || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true
ufw allow 8000/tcp || true
ufw --force enable || true

# 3. Setup Project Directory
DEPLOY_DIR="/opt/sentinai"
echo "[3/6] Setting up project repository in ${DEPLOY_DIR}..."
if [ -d "${DEPLOY_DIR}" ]; then
    echo "Updating existing installation..."
    cd "${DEPLOY_DIR}"
    git reset --hard HEAD
    git pull origin main
else
    git clone https://github.com/Sidd-0/SentinAI-NextGen-Agentic-SOC.git "${DEPLOY_DIR}"
    cd "${DEPLOY_DIR}"
fi

# 4. Setup Python Backend Environment
echo "[4/6] Setting up Python FastAPI Backend..."
cd "${DEPLOY_DIR}/Backend"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 5. Build React Frontend SPA
echo "[5/6] Building React Frontend Single Page Application..."
cd "${DEPLOY_DIR}/frontend"
npm install --legacy-peer-deps
npm run build

# 6. Configure Nginx Web Server & Systemd Service
echo "[6/6] Configuring Nginx Web Server & Systemd Daemon Service..."

# Nginx Site Config
cat <<EOF > /etc/nginx/sites-available/sentinai
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root ${DEPLOY_DIR}/frontend/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /docs {
        proxy_pass http://127.0.0.1:8000/docs;
        proxy_set_header Host \$host;
    }

    location /openapi.json {
        proxy_pass http://127.0.0.1:8000/openapi.json;
        proxy_set_header Host \$host;
    }
}
EOF

rm -f /etc/nginx/sites-enabled/default || true
ln -sf /etc/nginx/sites-available/sentinai /etc/nginx/sites-enabled/sentinai
nginx -t
systemctl restart nginx

# Systemd Backend Service
cat <<EOF > /etc/systemd/system/sentinai-backend.service
[Unit]
Description=SentinAI Enterprise Agentic SOC API Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${DEPLOY_DIR}/Backend
EnvironmentFile=${ENV_FILE}
ExecStart=${DEPLOY_DIR}/Backend/venv/bin/python -m uvicorn sentinai_enterprise_backend:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now sentinai-backend
systemctl restart sentinai-backend

echo ""
echo "========================================================="
echo " 🎉 SENTINAI ENTERPRISE SOC IS LIVE ON YOUR VPS!          "
echo "========================================================="
echo " 🌐 Frontend URL:  http://156.238.99.64"
echo " 🔌 API Docs:      http://156.238.99.64/docs"
echo "========================================================="
