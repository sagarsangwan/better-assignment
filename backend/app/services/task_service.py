from datetime import datetime

from app.extensions import db
from app.models import Task, Label


ALLOWED_STATUSES = {"todo", "in_progress", "done"}
ALLOWED_PRIORITIES = {"low", "medium", "high"}


def parse_due_date(value):
    if not value:
        return None

    try:
        return datetime.fromisoformat(value)
    except ValueError:
        raise ValueError("Invalid due_date format. Use ISO format, e.g. 2026-03-25T18:30:00")


def validate_status(status):
    if status not in ALLOWED_STATUSES:
        raise ValueError(f"Invalid status. Allowed values: {', '.join(ALLOWED_STATUSES)}")


def validate_priority(priority):
    if priority not in ALLOWED_PRIORITIES:
        raise ValueError(f"Invalid priority. Allowed values: {', '.join(ALLOWED_PRIORITIES)}")


def get_all_tasks(filters=None):
    filters = filters or {}
    query = Task.query

    status = filters.get("status")
    priority = filters.get("priority")
    search = filters.get("search")
    label_id = filters.get("label_id")

    if status:
        query = query.filter(Task.status == status)

    if priority:
        query = query.filter(Task.priority == priority)

    if search:
        query = query.filter(Task.title.ilike(f"%{search}%"))

    if label_id:
        query = query.join(Task.labels).filter(Label.id == label_id)

    tasks = query.order_by(Task.created_at.desc()).all()
    return [task.to_dict() for task in tasks]


def get_task_by_id(task_id):
    task = Task.query.get(task_id)
    if not task:
        raise ValueError("Task not found")
    return task


def create_task(data):
    title = (data.get("title") or "").strip()
    if not title:
        raise ValueError("Title is required")

    status = data.get("status", "todo")
    priority = data.get("priority", "medium")
    due_date = parse_due_date(data.get("due_date"))

    validate_status(status)
    validate_priority(priority)

    task = Task(
        title=title,
        description=data.get("description"),
        status=status,
        priority=priority,
        due_date=due_date,
    )

    label_ids = data.get("label_ids", [])
    if label_ids:
        labels = Label.query.filter(Label.id.in_(label_ids)).all()
        task.labels = labels

    db.session.add(task)
    db.session.commit()
    return task.to_dict()


def update_task(task_id, data):
    task = get_task_by_id(task_id)

    if "title" in data:
        title = (data.get("title") or "").strip()
        if not title:
            raise ValueError("Title cannot be empty")
        task.title = title

    if "description" in data:
        task.description = data.get("description")

    if "status" in data:
        validate_status(data["status"])
        task.status = data["status"]

    if "priority" in data:
        validate_priority(data["priority"])
        task.priority = data["priority"]

    if "due_date" in data:
        task.due_date = parse_due_date(data.get("due_date"))

    if "label_ids" in data:
        label_ids = data.get("label_ids", [])
        labels = Label.query.filter(Label.id.in_(label_ids)).all() if label_ids else []
        task.labels = labels

    db.session.commit()
    return task.to_dict()


def delete_task(task_id):
    task = get_task_by_id(task_id)
    db.session.delete(task)
    db.session.commit()
    return {"message": "Task deleted successfully"}


def get_task_summary():
    total = Task.query.count()
    todo = Task.query.filter_by(status="todo").count()
    in_progress = Task.query.filter_by(status="in_progress").count()
    done = Task.query.filter_by(status="done").count()
    high_priority = Task.query.filter_by(priority="high").count()

    return {
        "total": total,
        "todo": todo,
        "in_progress": in_progress,
        "done": done,
        "high_priority": high_priority,
    }