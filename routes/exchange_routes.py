from flask import Blueprint, request, jsonify
from services.exchange_manager import ExchangeManager
from services.exchangerate_api_adapter import ExchangeRateAPIAdapter
from models.transaction import Transaction
from models.account import Account
from database.db import db
from config import API_KEY
from flask_jwt_extended import jwt_required, get_jwt_identity


exchange_bp = Blueprint("exchange", __name__)

manager = ExchangeManager()
manager.set_adapter(ExchangeRateAPIAdapter(API_KEY))

@exchange_bp.route("/rate", methods=["GET"])
def get_rate():
    from_currency = request.args.get("from")
    to_currency = request.args.get("to")
    amount = float(request.args.get("amount"))

    data = manager.convert(from_currency, to_currency, amount)
    return jsonify(data)



@exchange_bp.route("/transfer", methods=["POST"])
@jwt_required()
def transfer():
    data = request.json
    user_id = int(get_jwt_identity())

    from_account = Account.query.get(data["from_account_id"])
    to_account = Account.query.get(data["to_account_id"])
    amount = float(data["amount"])

    # Validar que la cuenta de origen sea del usuario autenticado
    if from_account.user_id != user_id:
        return jsonify({"error": "No puedes transferir desde una cuenta que no es tuya"}), 403

    # Validaciones comunes
    if not from_account or not to_account:
        return jsonify({"error": "Cuenta no encontrada"}), 404

    if from_account.balance < amount:
        return jsonify({"error": "Fondos insuficientes"}), 400

    # Obtener conversión real
    conversion = manager.convert(from_account.currency, to_account.currency, amount)

    # Actualizar balances
    from_account.balance -= amount
    to_account.balance += conversion["result"]

    # Registrar transacción
    tx = Transaction(
        from_account_id=from_account.id,
        to_account_id=to_account.id,
        original_amount=amount,
        converted_amount=conversion["result"],
        exchange_rate=conversion["rate"],
        from_currency=from_account.currency,
        to_currency=to_account.currency
    )
    db.session.add(tx)
    db.session.commit()

    return jsonify({"message": "Transferencia exitosa"})
