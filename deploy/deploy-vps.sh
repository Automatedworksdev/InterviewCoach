#!/bin/bash

# AI Interview Coach - VPS Deployment Script
# Run this on your VPS to deploy the application

set -e  # Exit on error

echo "🚀 Deploying AI Interview Coach to VPS..."

# Configuration
APP_NAME="interviewcoach"
APP_PORT="3004"
APP_USER="interviewcoach"
APP_DIR="/opt/$APP_NAME"
SERVICE_NAME="$APP_NAME"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root or with sudo"
  exit 1
fi

# Create application user if doesn't exist
if ! id "$APP_USER" &>/dev/null; then
  echo "👤 Creating application user: $APP_USER"
  useradd -r -s /bin/false "$APP_USER"
fi

# Create application directory
echo "📁 Creating application directory: $APP_DIR"
mkdir -p "$APP_DIR"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# Copy application files (assuming they're in current directory)
echo "📦 Copying application files..."
cp -r . "$APP_DIR/"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# Install Node.js if not present
if ! command -v node &> /dev/null; then
  echo "📥 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
fi

# Install dependencies
echo "📦 Installing Node.js dependencies..."
cd "$APP_DIR"
sudo -u "$APP_USER" npm install --production

# Setup environment file
if [ ! -f "$APP_DIR/.env" ]; then
  echo "⚙️ Creating .env file template..."
  cat > "$APP_DIR/.env" << EOF
PORT=$APP_PORT
NODE_ENV=production
DATABASE_URL=./interviewcoach.db
# Add your API keys here:
# OPENAI_API_KEY=your_key_here
# STRIPE_SECRET_KEY=your_key_here
# EMAIL_PASSWORD=your_app_password_here
EOF
  chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
fi

# Create systemd service
echo "🛠️ Creating systemd service..."
cat > "/etc/systemd/system/$SERVICE_NAME.service" << EOF
[Unit]
Description=AI Interview Coach
After=network.target

[Service]
Type=simple
User=$APP_USER
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=$SERVICE_NAME

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and enable service
echo "🔄 Reloading systemd..."
systemctl daemon-reload
systemctl enable "$SERVICE_NAME"
systemctl restart "$SERVICE_NAME"

# Setup Nginx reverse proxy (optional)
if command -v nginx &> /dev/null; then
  echo "🌐 Setting up Nginx reverse proxy..."
  cat > "/etc/nginx/sites-available/$APP_NAME" << EOF
server {
    listen 80;
    server_name interviewcoach.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
  
  ln -sf "/etc/nginx/sites-available/$APP_NAME" "/etc/nginx/sites-enabled/"
  nginx -t && systemctl reload nginx
  echo "✅ Nginx configured. Update server_name in /etc/nginx/sites-available/$APP_NAME"
else
  echo "📝 Nginx not installed. Application running on port $APP_PORT"
fi

# Setup firewall (if ufw is available)
if command -v ufw &> /dev/null; then
  echo "🔥 Configuring firewall..."
  ufw allow 80/tcp
  ufw allow 443/tcp
fi

echo "✅ Deployment complete!"
echo "📊 Check status: systemctl status $SERVICE_NAME"
echo "📝 View logs: journalctl -u $SERVICE_NAME -f"
echo "🌐 Access at: http://localhost:$APP_PORT (or your domain if Nginx configured)"
echo ""
echo "⚠️  Next steps:"
echo "1. Update $APP_DIR/.env with your API keys"
echo "2. Configure domain DNS to point to this server"
echo "3. Set up SSL with Let's Encrypt: certbot --nginx"