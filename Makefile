COMPOSE_DEV  = docker compose
COMPOSE_PROD = docker compose -f docker-compose.prod.yml

.PHONY: help setup fresh up down restart logs seed shell-backend shell-frontend \
        dev dev-fresh dev-down dev-seed dev-logs

help:
	@echo ""
	@echo "  Development:"
	@echo "    make dev        Start dev environment with hot reload"
	@echo "    make dev-fresh  Wipe volumes and start clean (runs migrations + seed)"
	@echo "    make dev-down   Stop dev environment"
	@echo "    make dev-seed   Run migrations and seed"
	@echo "    make dev-logs   Tail backend and frontend logs"
	@echo ""
	@echo "  Production:"
	@echo "    make setup      One-time: copy env files and generate APP_KEY"
	@echo "    make fresh      Wipe volumes, rebuild, and start (auto-seeds on first run)"
	@echo "    make up         Build and start without wiping volumes"
	@echo "    make down       Stop all services"
	@echo "    make restart    Rebuild and restart without wiping volumes"
	@echo "    make logs       Tail backend and frontend logs"
	@echo "    make seed       Run migrations and seed manually"
	@echo ""

setup:
	@test -f .env         || cp .env.example .env
	@test -f backend/.env || cp backend/.env.example backend/.env
	@if grep -q "^APP_KEY=$$" backend/.env 2>/dev/null; then \
		KEY=$$(openssl rand -base64 32); \
		sed -i "s|^APP_KEY=$$|APP_KEY=base64:$$KEY|" backend/.env; \
		echo "APP_KEY generated."; \
	fi
	@echo ""
	@echo "Review .env and backend/.env then run: make fresh"

fresh:
	$(COMPOSE_PROD) down -v --remove-orphans
	$(COMPOSE_PROD) up -d --build
	@$(MAKE) _wait-prod
	@echo ""
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
	$(COMPOSE_PROD) exec backend php artisan migrate --seed --force

logs:
	$(COMPOSE_PROD) logs -f backend frontend

shell-backend:
	$(COMPOSE_PROD) exec backend bash

shell-frontend:
	$(COMPOSE_PROD) exec frontend sh

dev:
	$(COMPOSE_DEV) up -d --build
	@echo ""
	@echo "  Backend API : http://localhost:8000/api/v1"
	@echo "  API Docs    : http://localhost:8000/api/documentation"
	@echo "  Frontend    : http://localhost:3000"

dev-fresh:
	$(COMPOSE_DEV) down -v --remove-orphans
	$(COMPOSE_DEV) up -d --build
	@$(MAKE) _wait-dev
	$(COMPOSE_DEV) exec backend php artisan migrate --seed --force
	@echo ""
	@echo "  Backend API : http://localhost:8000/api/v1"
	@echo "  Frontend    : http://localhost:3000"

dev-down:
	$(COMPOSE_DEV) down

dev-seed:
	$(COMPOSE_DEV) exec backend php artisan migrate --seed --force

dev-logs:
	$(COMPOSE_DEV) logs -f backend frontend

_wait-dev:
	@echo "Waiting for backend..."
	@timeout 90 sh -c \
	  'until docker compose exec -T backend php artisan --version > /dev/null 2>&1; \
	   do sleep 3; done' \
	  || (echo "Backend failed to start. Run: make dev-logs" && exit 1)

_wait-prod:
	@echo "Waiting for backend..."
	@timeout 90 sh -c \
	  'until docker compose -f docker-compose.prod.yml exec -T backend php artisan --version > /dev/null 2>&1; \
	   do sleep 3; done' \
	  || (echo "Backend failed to start. Run: make logs" && exit 1)
