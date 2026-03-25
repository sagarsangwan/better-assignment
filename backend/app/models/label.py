from app.extensions import db
from datetime import datetime

class Label(db.Model):
    __tablename__ = "labels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    tasks = db.relationship(
        "Task",
        secondary="task_labels",
        back_populates="labels",
        lazy="select",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def to_dict_basic(self):
        return {
            "id": self.id,
            "name": self.name,
        }