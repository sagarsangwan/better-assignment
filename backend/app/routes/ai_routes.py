from flask import Blueprint, jsonify

from app.services.ai_service import build_task_planning_response

ai_bp = Blueprint("ai", __name__)


@ai_bp.route("/plan", methods=["GET"])
def get_ai_plan():
    try:
        result = build_task_planning_response()
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500