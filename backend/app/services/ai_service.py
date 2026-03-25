from datetime import datetime

from app.models import Task


def build_task_planning_response():
    tasks = Task.query.filter(Task.status != "done").order_by(Task.created_at.asc()).all()

    if not tasks:
        return {
            "top_tasks": [],
            "reasoning": "There are no active tasks right now.",
            "warnings": [],
        }

    now = datetime.utcnow()
    scored_tasks = []

    for task in tasks:
        score = 0
        reasons = []

        if task.priority == "high":
            score += 30
            reasons.append("high priority")
        elif task.priority == "medium":
            score += 20
            reasons.append("medium priority")
        else:
            score += 10
            reasons.append("low priority")

        if task.status == "in_progress":
            score += 15
            reasons.append("already in progress")

        if task.due_date:
            if task.due_date < now:
                score += 40
                reasons.append("overdue")
            else:
                days_left = (task.due_date - now).days
                if days_left <= 1:
                    score += 25
                    reasons.append("due very soon")
                elif days_left <= 3:
                    score += 15
                    reasons.append("due in a few days")

        scored_tasks.append({
            "task": task,
            "score": score,
            "reasons": reasons,
        })

    scored_tasks.sort(key=lambda item: item["score"], reverse=True)
    top_items = scored_tasks[:3]

    warnings = []
    overdue_tasks = [item["task"].title for item in scored_tasks if item["task"].due_date and item["task"].due_date < now]
    if overdue_tasks:
        warnings.append(f"You have overdue tasks: {', '.join(overdue_tasks)}")

    too_many_high_priority = [item["task"].title for item in scored_tasks if item["task"].priority == "high"]
    if len(too_many_high_priority) >= 4:
        warnings.append("Too many tasks are marked high priority. Your prioritization may be weak.")

    return {
        "top_tasks": [
            {
                "id": item["task"].id,
                "title": item["task"].title,
                "priority": item["task"].priority,
                "status": item["task"].status,
                "due_date": item["task"].due_date.isoformat() if item["task"].due_date else None,
                "reasons": item["reasons"],
            }
            for item in top_items
        ],
        "reasoning": "Tasks are ranked using priority, due date urgency, and current progress status.",
        "warnings": warnings,
    }