from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import db, migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    from app.models import Task, Label
    from app.routes.task_routes import task_bp
    from app.routes.label_routes import label_bp
    from app.routes.ai_routes import ai_bp

    app.register_blueprint(task_bp, url_prefix="/api/tasks")
    app.register_blueprint(label_bp, url_prefix="/api/labels")
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    @app.route("/")
    def health():
        return {"message": "Backend is running"}
    return app

