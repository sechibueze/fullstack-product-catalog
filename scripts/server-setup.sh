#!/usr/bin/env bash
# One-time setup for Oracle Cloud (Oracle Linux) instance.
# Run once after provisioning the VM:
#   bash <(curl -fsSL https://raw.githubusercontent.com/sechibueze/fullstack-product-catalog/main/scripts/server-setup.sh)
set -e

APP_DIR="/opt/product-catalog"
REPO_URL="https://github.com/sechibueze/fullstack-product-catalog.git"

echo "Installing Docker and make..."
sudo dnf install -y dnf-plugins-core make git
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
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

echo "SERVER_IP=$SERVER_IP"                                 > .env
echo "NEXT_PUBLIC_APP_URL=http://$SERVER_IP:3000"          >> .env
echo "NEXT_PUBLIC_API_URL=http://$SERVER_IP:8000/api/v1"   >> .env
echo "NEXT_PUBLIC_APP_NAME=Product Catalog"                >> .env
echo "DB_DATABASE=product_catalog"                         >> .env
echo "DB_USERNAME=wfd"                                     >> .env
echo "DB_PASSWORD=$DB_PASS"                                >> .env

echo "APP_NAME=ProductCatalog"                             > backend/.env
echo "APP_ENV=production"                                  >> backend/.env
echo "APP_KEY=base64:$APP_KEY"                            >> backend/.env
echo "APP_DEBUG=false"                                     >> backend/.env
echo "APP_URL=http://$SERVER_IP:8000"                     >> backend/.env
echo "DB_CONNECTION=pgsql"                                 >> backend/.env
echo "DB_HOST=db"                                          >> backend/.env
echo "DB_PORT=5432"                                        >> backend/.env
echo "DB_DATABASE=product_catalog"                         >> backend/.env
echo "DB_USERNAME=wfd"                                     >> backend/.env
echo "DB_PASSWORD=$DB_PASS"                                >> backend/.env
echo "CACHE_STORE=redis"                                   >> backend/.env
echo "REDIS_CLIENT=phpredis"                               >> backend/.env
echo "REDIS_HOST=cache"                                    >> backend/.env
echo "REDIS_PORT=6379"                                     >> backend/.env
echo "REDIS_PASSWORD=null"                                 >> backend/.env
echo "L5_SWAGGER_GENERATE_ALWAYS=false"                   >> backend/.env
echo "L5_SWAGGER_CONST_HOST=http://$SERVER_IP:8000/api"   >> backend/.env
echo "SESSION_DRIVER=database"                             >> backend/.env
echo "SESSION_LIFETIME=120"                                >> backend/.env
echo "SESSION_ENCRYPT=false"                               >> backend/.env
echo "QUEUE_CONNECTION=database"                           >> backend/.env
echo "FILESYSTEM_DISK=local"                               >> backend/.env
echo "BROADCAST_CONNECTION=log"                            >> backend/.env
echo "LOG_CHANNEL=stack"                                   >> backend/.env
echo "LOG_LEVEL=error"                                     >> backend/.env

echo "Starting application..."
sudo docker compose -f "$APP_DIR/docker-compose.prod.yml" up -d --build

echo ""
echo "Open these ports in your Oracle Cloud Security List and OS firewall:"
echo "  sudo firewall-cmd --permanent --add-port=8000/tcp"
echo "  sudo firewall-cmd --permanent --add-port=3000/tcp"
echo "  sudo firewall-cmd --reload"
echo ""
echo "App will be live at:"
echo "  Frontend  : http://$SERVER_IP:3000"
echo "  API       : http://$SERVER_IP:8000/api/v1"
echo "  API Docs  : http://$SERVER_IP:8000/api/documentation"
