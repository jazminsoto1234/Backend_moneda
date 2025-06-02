from flask import Blueprint, request, jsonify
from database.db import db
from models.usuario import User
from models.account import Account
from models.transaction import Transaction
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_jwt_extended import create_access_token
from services.generar_account import generar_nro_cuenta

user_bp = Blueprint("user", __name__)



@user_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    # Verificar si el usuario ya existe
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Usuario ya existe"}), 400

    # Crear nuevo usuario
    user = User(
        username=data["username"],
        email=data["email"]
    )
    user.set_password(data["password"])

    db.session.add(user)
    db.session.commit()

    # creamos un random de nro de cuenta
    # Crear cuentas PEN y USD
    for currency in ["PEN", "USD"]:
        acc = Account(user_id=user.id, currency=currency, nro_cuenta = generar_nro_cuenta() , balance=0.0)
        db.session.add(acc)

    db.session.commit()

    # Crear token JWT inmediatamente
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Usuario registrado correctamente",
        "access_token": token
    }), 201





@user_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()
    if user and user.check_password(data["password"]):
        token = create_access_token(identity=str(user.id))
        return jsonify({"access_token": token})
    return jsonify({"error": "Credenciales inválidas"}), 401



@user_bp.route("/account", methods=["GET"])
@jwt_required()
def get_account():
    user_id = int(get_jwt_identity())
    accounts = Account.query.filter_by(user_id=user_id).all()
    result = [
        {"id": acc.id, "nro_cuenta" : acc.nro_cuenta ,  "currency": acc.currency, "balance": acc.balance}
        for acc in accounts
    ]
    return jsonify(result)


@user_bp.route("/addmoney", methods=["PATCH"])
@jwt_required()
def add_money():
    data = request.json
    user_id = int(get_jwt_identity())
    account_id = data.get("id")
    amount = data.get("amount", 0)

    #Validacion
    if not account_id or amount is None or amount <= 0:
        return jsonify({"error": "Datos invalidos"}), 400

    #Verficamos que pertenezca al usuario
    account = Account.query.filter_by(id=account_id, user_id=user_id).first()
    if not account:
        return jsonify({"error": "Cuenta no encontrada o no autorizada"}), 404

    # Aumentar el saldo
    account.balance += amount
    db.session.commit()

    return jsonify({
        "message": "Monto agregado exitosamente",
        "new_balance": account.balance
    }), 200



@user_bp.route("/historial", methods=["GET"])
@jwt_required()
def get_historial():
    user_id = int(get_jwt_identity())

    # Obtener las cuentas del usuario
    user_accounts = Account.query.filter_by(user_id=user_id).all()
    account_ids = [acc.id for acc in user_accounts]

    # Buscar transacciones donde alguna cuenta del usuario esté involucrada
    transacciones = Transaction.query.filter(
        (Transaction.from_account_id.in_(account_ids)) |
        (Transaction.to_account_id.in_(account_ids))
    ).order_by(Transaction.timestamp.desc()).all()

    # Respuesta
    historial = []
    for tx in transacciones:
        historial.append({
            "timestamp": tx.timestamp.isoformat(),
            "from_account": tx.from_account_id,
            "to_account": tx.to_account_id,
            "from_currency": tx.from_currency,
            "to_currency": tx.to_currency,
            "original_amount": tx.original_amount,
            "converted_amount": tx.converted_amount,
            "exchange_rate": tx.exchange_rate
        })

    return jsonify(historial)
