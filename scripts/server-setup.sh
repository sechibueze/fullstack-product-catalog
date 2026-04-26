#!/usr/bin/env bash
# One-time setup for Oracle Cloud Ubuntu instance.
# Run once after provisioning the VM:
#   bash <(curl -fsSL https://raw.githubusercontent.com/sechibueze/fullstack-product-catalog/main/scripts/server-setup.sh)
set -e

APP_DIR="/opt/product-catalog"
REPO_URL="https://github.com/sechibueze/fullstack-product-catalog.git"

echo "Installing Docker..."
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"

echo "Cloning repository..."
sudo mkdir -p "$APP_DIR"
sudo chown "$USER:$USER" "$APP_DIR"
git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

echo "Generating credentials..."
SERVER_IP=$(curl -s ifconfig.me)
DB_PASS=$(openssl rand -hex 16)
APP_KEY=$(openssl rand -base64 32)

cat > .env <<EOF
SERVER_IP=$SERVER_IP
NEXT_PUBLIC_APP_URL=http://$SERVER_IP:3000
NEXT_PUBLIC_API_URL=http://$SERVER_IP:8000/api/v1
NEXT_PUBLIC_APP_NAME=Product Catalog
DB_DATABASE=product_catalog
DB_USERNAME=wfd
DB_PASSWORD=$DB_PASS
EOF

cat > backend/.env <<EOF
APP_NAME=ProductCatalog
APP_ENV=production
APP_KEY=base64:$APP_KEY
APP_DEBUG=false
APP_URL=http://$SERVER_IP:8000

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=product_catalog
DB_USERNAME=wfd
DB_PASSWORD=$DB_PASS

CACHE_STORE=redis
REDIS_CLIENT=phpredis
REDIS_HOST=cache
REDIS_PORT=6379
REDIS_PASSWORD=null

L5_SWAGGER_GENERATE_ALWAYS=false
L5_SWAGGER_CONST_HOST=http://$SERVER_IP:8000/api

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
QUEUE_CONNECTION=database
FILESYSTEM_DISK=local
BROADCAST_CONNECTION=log
LOG_CHANNEL=stack
LOG_LEVEL=error
EOF

echo "Starting application..."
sg docker -c "docker compose -f $APP_DIR/docker-compose.prod.yml up -d --build"

echo ""
echo "Setup complete. Open these ports in your Oracle Cloud Security List:"
echo "  TCP 8000  (API + Swagger docs)"
echo "  TCP 3000  (Frontend)"
echo ""
echo "Once ports are open, your app will be live at:"
echo "  Frontend  : http://$SERVER_IP:3000"
echo "  API       : http://$SERVER_IP:8000/api/v1"
echo "  API Docs  : http://$SERVER_IP:8000/api/documentation"
