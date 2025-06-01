from flask import Blueprint, request, jsonify
from services.transacction_service import perform_transfer

transaction_bp = Blueprint('transaction', __name__)

@transaction_bp.route('/transfer', methods=['POST'])
def transfer():
    data = request.get_json()
    result = perform_transfer(data)
    if "error" in result:
        return jsonify(result), 400
    return jsonify(result)
