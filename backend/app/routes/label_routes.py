from flask import Blueprint, jsonify, request

from app.services.label_service import (
    create_label,
    delete_label,
    get_all_labels,
    get_label_by_id,
    update_label,
)

label_bp = Blueprint("labels", __name__)


@label_bp.route("/", methods=["GET"])
def list_labels():
    try:
        labels = get_all_labels()
        return jsonify(labels), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@label_bp.route("/<int:label_id>", methods=["GET"])
def retrieve_label(label_id):
    try:
        label = get_label_by_id(label_id)
        return jsonify(label.to_dict()), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@label_bp.route("/", methods=["POST"])
def create_new_label():
    try:
        data = request.get_json() or {}
        label = create_label(data)
        return jsonify(label), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@label_bp.route("/<int:label_id>", methods=["PUT"])
def update_existing_label(label_id):
    try:
        data = request.get_json() or {}
        label = update_label(label_id, data)
        return jsonify(label), 200
    except ValueError as e:
        message = str(e)
        status_code = 404 if message == "Label not found" else 400
        return jsonify({"error": message}), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@label_bp.route("/<int:label_id>", methods=["DELETE"])
def delete_existing_label(label_id):
    try:
        result = delete_label(label_id)
        return jsonify(result), 200
    except ValueError as e:
        message = str(e)
        status_code = 404 if message == "Label not found" else 400
        return jsonify({"error": message}), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500