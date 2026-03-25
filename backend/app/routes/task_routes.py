from flask import Blueprint, jsonify, request

from app.services.task_service import (
    create_task,
    delete_task,
    get_all_tasks,
    get_task_by_id,
    get_task_summary,
    update_task,
)

task_bp = Blueprint("tasks", __name__)


@task_bp.route("/", methods=["GET"])
def list_tasks():
    try:
        filters = {
            "status": request.args.get("status"),
            "priority": request.args.get("priority"),
            "search": request.args.get("search"),
            "label_id": request.args.get("label_id", type=int),
        }
        tasks = get_all_tasks(filters)
        return jsonify(tasks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@task_bp.route("/summary", methods=["GET"])
def task_summary():
    try:
        summary = get_task_summary()
        return jsonify(summary), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@task_bp.route("/<int:task_id>", methods=["GET"])
def retrieve_task(task_id):
    try:
        task = get_task_by_id(task_id)
        return jsonify(task.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@task_bp.route("/", methods=["POST"])
def create_new_task():
    try:
        data = request.get_json() or {}
        task = create_task(data)
        return jsonify(task), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route("/<int:task_id>", methods=["PUT"])
def update_existing_task(task_id):
    try:
        data = request.get_json() or {}
        task = update_task(task_id, data)
        return jsonify(task), 200
    except ValueError as e:
        message = str(e)
        status_code = 404 if message == "Task not found" else 400
        return jsonify({"error": message}), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@task_bp.route("/<int:task_id>", methods=["DELETE"])
def delete_existing_task(task_id):
    try:
        result = delete_task(task_id)
        return jsonify(result), 200
    except ValueError as e:
        message = str(e)
        status_code = 404 if message == "Task not found" else 400
        return jsonify({"error": message}), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500