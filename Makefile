.PHONY: help install install-backend install-frontend dev dev-backend dev-frontend docker-up docker-down docker-build clean

help:
	@echo "Available commands:"
	@echo "  make install          - Install all dependencies"
	@echo "  make install-backend  - Install backend dependencies"
	@echo "  make install-frontend - Install frontend dependencies"
	@echo "  make dev              - Run both backend and frontend in development mode"
	@echo "  make dev-backend      - Run backend in development mode"
	@echo "  make dev-frontend     - Run frontend in development mode"
	@echo "  make docker-up        - Start all services with Docker Compose"
	@echo "  make docker-down      - Stop all services"
	@echo "  make docker-build     - Build Docker images"
	@echo "  make clean            - Clean temporary files and caches"

install: install-backend install-frontend
	@echo "All dependencies installed successfully!"

install-backend:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt

install-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev:
	@echo "Starting development servers..."
	npm run dev

dev-backend:
	@echo "Starting backend server..."
	cd backend && uvicorn app.main:app --reload

dev-frontend:
	@echo "Starting frontend server..."
	cd frontend && npm run dev

docker-up:
	@echo "Starting Docker services..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker services..."
	docker-compose down

docker-build:
	@echo "Building Docker images..."
	docker-compose build

docker-logs:
	docker-compose logs -f

docker-clean:
	@echo "Cleaning Docker resources..."
	docker-compose down -v
	docker system prune -f

clean:
	@echo "Cleaning temporary files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".next" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name "node_modules" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	@echo "Clean completed!"
