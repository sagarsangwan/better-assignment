from app.extensions import db
from app.models import Label


def get_all_labels():
    labels = Label.query.order_by(Label.name.asc()).all()
    return [label.to_dict() for label in labels]


def get_label_by_id(label_id):
    label = Label.query.get(label_id)
    if not label:
        raise ValueError("Label not found")
    return label


def create_label(data):
    name = (data.get("name") or "").strip()
    if not name:
        raise ValueError("Label name is required")

    existing_label = Label.query.filter(Label.name.ilike(name)).first()
    if existing_label:
        raise ValueError("Label already exists")

    label = Label(name=name)
    db.session.add(label)
    db.session.commit()
    return label.to_dict()


def update_label(label_id, data):
    label = get_label_by_id(label_id)

    name = (data.get("name") or "").strip()
    if not name:
        raise ValueError("Label name is required")

    existing_label = Label.query.filter(
        Label.name.ilike(name),
        Label.id != label_id
    ).first()

    if existing_label:
        raise ValueError("Another label with this name already exists")

    label.name = name
    db.session.commit()
    return label.to_dict()


def delete_label(label_id):
    label = get_label_by_id(label_id)
    db.session.delete(label)
    db.session.commit()
    return {"message": "Label deleted successfully"}