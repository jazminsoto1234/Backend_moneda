from flask import Blueprint, jsonify
from model.usuario import User

user_bp = Blueprint('user', __name__)

@user_bp.route('/<int:user_id>/accounts', methods=['GET'])
def get_accounts(user_id):
    user = User.query.get_or_404(user_id)
    accounts = [{
        "account_id": acc.id,
        "currency": acc.currency,
        "balance": acc.balance
    } for acc in user.accounts]
    return jsonify(accounts)

@user_bp.route('/<int:user_id>/transactions', methods=['GET'])
def get_transactions(user_id):
    user = User.query.get_or_404(user_id)
    all_txs = []
    for acc in user.accounts:
        for tx in acc.transactions_from:
            all_txs.append({"type": "sent", "amount": tx.amount_from, "currency": acc.currency, "timestamp": tx.timestamp, "description": tx.description})
        for tx in acc.transactions_to:
            all_txs.append({"type": "received", "amount": tx.amount_to, "currency": acc.currency, "timestamp": tx.timestamp, "description": tx.description})
    all_txs.sort(key=lambda x: x["timestamp"], reverse=True)
    return jsonify(all_txs)