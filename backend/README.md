# Task Planner Backend (Flask)

Backend API for the Task Planner app.

## Tech Stack
- Flask
- Flask-SQLAlchemy
- Flask-Migrate (Alembic)
- Flask-CORS
- SQLite (default)

## Project Structure
- `app/__init__.py`: app factory and blueprint registration
- `app/config.py`: environment-based config
- `app/extensions.py`: `db` and `migrate` setup
- `app/models/`: `Task`, `Label`, and `task_labels` association
- `app/routes/`: API route handlers
- `app/services/`: business logic
- `migrations/`: Alembic migration scripts
- `run.py`: backend entrypoint

## Prerequisites
- Python 3.11+
- `pip`

## Setup
1. Go to backend folder:
```bash
cd backend
```
2. Create virtual environment:
```bash
python -m venv venv
```
3. Activate virtual environment:
```bash
source venv/bin/activate
```
4. Install dependencies:
```bash
pip install -r requirements.txt
```
5. Create env file:
```bash
cp .env.example .env
```

## Environment Variables
`.env` keys:
- `FLASK_ENV=development`
- `SECRET_KEY=dev-secret-key`
- `DATABASE_URL=sqlite:///app.db`

Note: with `sqlite:///app.db`, SQLite DB is created under `backend/instance/app.db`.

## Run The Backend
```bash
cd backend
source venv/bin/activate
python run.py
```

Backend runs at:
- `http://127.0.0.1:5000`

Health check:
- `GET /`

## Database Migrations
Use Flask-Migrate commands from `backend` folder.

1. Apply existing migrations:
```bash
flask --app run.py db upgrade
```

2. Create a new migration after model changes:
```bash
flask --app run.py db migrate -m "describe your change"
```

3. Apply the new migration:
```bash
flask --app run.py db upgrade
```

4. Roll back one migration if needed:
```bash
flask --app run.py db downgrade
```

5. Initialize migrations folder (only if it does not exist):
```bash
flask --app run.py db init
```

## API Endpoints
### Tasks
- `GET /api/tasks/`
- `GET /api/tasks/summary`
- `GET /api/tasks/<id>`
- `POST /api/tasks/`
- `PUT /api/tasks/<id>`
- `DELETE /api/tasks/<id>`

Supported task list query params:
- `status`
- `priority`
- `search`
- `label_id`

### Labels
- `GET /api/labels/`
- `GET /api/labels/<id>`
- `POST /api/labels/`
- `PUT /api/labels/<id>`
- `DELETE /api/labels/<id>`

### AI
- `GET /api/ai/plan`

## Quick Test
```bash
curl http://127.0.0.1:5000/api/tasks/
curl http://127.0.0.1:5000/api/tasks/summary
curl http://127.0.0.1:5000/api/labels/
curl http://127.0.0.1:5000/api/ai/plan
```

## Notes
- CORS is enabled, so frontend on a different port (for example Vite on `5173`) can call this API.
- If DB schema changes are not reflected, run `flask --app run.py db upgrade` again.
