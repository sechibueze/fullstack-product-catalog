COMPOSE_DEV  = docker compose
COMPOSE_PROD = docker compose -f docker-compose.prod.yml

.PHONY: help setup fresh up down restart logs seed shell-backend shell-frontend

help:
	@echo ""
	@echo "  Local development:"
	@echo "    make dev       Start dev environment (hot reload, bind mounts)"
	@echo "    make dev-down  Stop dev environment"
	@echo "    make dev-seed  Seed the dev database"
	@echo ""
	@echo "  Production (run on Oracle Cloud server):"
	@echo "    make setup     First-time: copy .env files and generate APP_KEY"
	@echo "    make fresh     Tear down everything and rebuild from scratch"
	@echo "    make up        Start services, rebuild images, keep existing volumes"
	@echo "    make down      Stop all services"
	@echo "    make restart   Rebuild and restart without wiping volumes"
	@echo "    make seed      Run database seeders"
	@echo "    make logs      Tail backend and frontend logs"
	@echo ""

setup:
	@test -f .env             || cp .env.example .env
	@test -f backend/.env     || cp backend/.env.example backend/.env
	@grep -q "APP_KEY=$$" backend/.env 2>/dev/null && \
		APP_KEY=$$(openssl rand -base64 32) && \
		sed -i "s|APP_KEY=|APP_KEY=base64:$$APP_KEY|" backend/.env && \
		echo "APP_KEY generated" || true
	@echo ""
	@echo "Edit .env with your server IP and passwords."
	@echo "Edit backend/.env with APP_URL, DB_PASSWORD, and other production values."
	@echo ""
	@echo "Then run: make fresh"

fresh:
	$(COMPOSE_PROD) down -v --remove-orphans
	$(COMPOSE_PROD) up -d --build
	@echo ""
	@echo "Waiting for backend to finish migrations..."
	@sleep 8
	$(COMPOSE_PROD) exec backend php artisan db:seed --force
	@echo ""
	@echo "App is running:"
	@echo "  Backend API : http://localhost:8000/api/v1"
	@echo "  API Docs    : http://localhost:8000/api/documentation"
	@echo "  Frontend    : http://localhost:3000"

up:
	$(COMPOSE_PROD) up -d --build

down:
	$(COMPOSE_PROD) down

restart:
	$(COMPOSE_PROD) down --remove-orphans
	$(COMPOSE_PROD) up -d --build

seed:
	$(COMPOSE_PROD) exec backend php artisan db:seed --force

logs:
	$(COMPOSE_PROD) logs -f backend frontend

shell-backend:
	$(COMPOSE_PROD) exec backend sh

shell-frontend:
	$(COMPOSE_PROD) exec frontend sh

dev:
	$(COMPOSE_DEV) up -d --build
	@echo ""
	@echo "Dev environment running:"
	@echo "  Backend API : http://localhost:8000/api/v1"
	@echo "  API Docs    : http://localhost:8000/api/documentation"
	@echo "  Frontend    : http://localhost:3000"

dev-fresh:
	$(COMPOSE_DEV) down -v --remove-orphans
	$(COMPOSE_DEV) up -d --build
	@sleep 6
	$(COMPOSE_DEV) exec backend php artisan migrate --seed --force
	@echo ""
	@echo "Dev environment running:"
	@echo "  Backend API : http://localhost:8000/api/v1"
	@echo "  API Docs    : http://localhost:8000/api/documentation"
	@echo "  Frontend    : http://localhost:3000"

dev-down:
	$(COMPOSE_DEV) down

dev-seed:
	$(COMPOSE_DEV) exec backend php artisan migrate --seed --force
