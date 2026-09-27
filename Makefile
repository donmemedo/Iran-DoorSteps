.PHONY: dev api web build up down logs seed

api:      ## run FastAPI on :8140
	cd backend && .venv/bin/uvicorn app.main:app --reload --port 8140

web:      ## run Next.js on :3400
	cd frontend && npm run dev -- -p 3400

build:
	cd frontend && npm run build

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f --tail=80

seed:     ## wipe and reseed the database
	cd backend && .venv/bin/python -c "from app.db import init_db; from app.seed import seed; init_db(); seed(force=True); print('seeded')"
