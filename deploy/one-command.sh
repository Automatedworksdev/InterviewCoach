#!/bin/bash

# One-command deployment for AI Interview Coach on VPS
# Run this on your VPS as root or with sudo

echo "🚀 AI Interview Coach - One-Command Deployment"
echo "============================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo "❌ Please run as root or with sudo: sudo bash one-command.sh"
  exit 1
fi

# Update system
echo "🔄 Updating system packages..."
apt-get update -qq

# Install Node.js if not present
if ! command -v node &> /dev/null; then
  echo "📥 Installing Node.js 18..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs > /dev/null 2>&1
  echo "✅ Node.js $(node --version) installed"
else
  echo "✅ Node.js $(node --version) already installed"
fi

# Create application directory
APP_DIR="/opt/interviewcoach"
APP_USER="interviewcoach"

echo "📁 Creating application directory: $APP_DIR"
mkdir -p "$APP_DIR"

# Create application user if doesn't exist
if ! id "$APP_USER" &>/dev/null; then
  echo "👤 Creating application user: $APP_USER"
  useradd -r -s /bin/false "$APP_USER"
fi

# Copy current directory contents
echo "📦 Copying application files..."
cp -r . "$APP_DIR/"
chown -R "$APP_USER:$APP_USER" "$APP_DIR"

# Install dependencies
echo "📦 Installing Node.js dependencies..."
cd "$APP_DIR"
sudo -u "$APP_USER" npm install --production --silent

# Create .env file if doesn't exist
if [ ! -f "$APP_DIR/.env" ]; then
  echo "⚙️ Creating .env file template..."
  cat > "$APP_DIR/.env" << 'EOF'
PORT=3004
NODE_ENV=production
DATABASE_URL=./interviewcoach.db
# Email configuration (update with your App Password)
EMAIL_USER=automateworksdev@gmail.com
EMAIL_PASSWORD=your_app_password_here
EOF
  chown "$APP_USER:$APP_USER" "$APP_DIR/.env"
  echo "⚠️  IMPORTANT: Update $APP_DIR/.env with your email App Password"
fi

# Create systemd service
echo "🛠️ Creating systemd service..."
cat > "/etc/systemd/system/interviewcoach.service" << 'EOF'
[Unit]
Description=AI Interview Coach
After=network.target

[Service]
Type=simple
User=interviewcoach
WorkingDirectory=/opt/interviewcoach
EnvironmentFile=/opt/interviewcoach/.env
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=interviewcoach

[Install]
WantedBy=multi-user.target
EOF

# Start service
echo "🚀 Starting AI Interview Coach service..."
systemctl daemon-reload
systemctl enable interviewcoach
systemctl restart interviewcoach

# Wait for service to start
sleep 3

# Check service status
if systemctl is-active --quiet interviewcoach; then
  echo "✅ AI Interview Coach is running!"
  
  # Get server IP
  IP=$(hostname -I | awk '{print $1}')
  if [ -z "$IP" ]; then
    IP="localhost"
  fi
  
  echo ""
  echo "🎉 DEPLOYMENT COMPLETE!"
  echo "======================="
  echo "🌐 Access your application at:"
  echo "   http://$IP:3004"
  echo ""
  echo "📊 Health check:"
  echo "   http://$IP:3004/api/health"
  echo ""
  echo "📝 View logs:"
  echo "   journalctl -u interviewcoach -f"
  echo ""
  echo "⚙️  Service management:"
  echo "   systemctl status interviewcoach"
  echo "   systemctl restart interviewcoach"
  echo "   systemctl stop interviewcoach"
  echo ""
  echo "⚠️  NEXT STEPS:"
  echo "1. Update /opt/interviewcoach/.env with email App Password"
  echo "2. Restart service: systemctl restart interviewcoach"
  echo "3. Configure firewall if needed: ufw allow 3004/tcp"
  echo "4. Start promotion using the scripts in /opt/interviewcoach/scripts/"
else
  echo "❌ Service failed to start. Check logs: journalctl -u interviewcoach"
  exit 1
fi