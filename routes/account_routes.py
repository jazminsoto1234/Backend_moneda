from flask import Blueprint, request, jsonify
import requests

account_bp = Blueprint('account', __name__)

@account_bp.route('/rate', methods=['GET'])
def get_rate():
    from_currency = request.args.get("from")
    to_currency = request.args.get("to")
    res = requests.get(f"https://api.exchangerate.host/convert?from={from_currency}&to={to_currency}").json()
    return jsonify({"rate": res["info"]["rate"]})