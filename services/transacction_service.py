from model.account import db, Account
from model.transacction import Transaction
import requests

def perform_transfer(data):
    try:
        from_id = data["from_account"]
        to_id = data["to_account"]
        amount = float(data["amount"])
        description = data.get("description", "")

        from_acc = Account.query.get(from_id)
        to_acc = Account.query.get(to_id)

        if not from_acc or not to_acc:
            return {"error": "Cuenta no encontrada"}

        if from_acc.balance < amount:
            return {"error": "Fondos insuficientes"}

        res = requests.get(
            f"https://api.exchangerate.host/convert?from={from_acc.currency}&to={to_acc.currency}"
        ).json()
        rate = res["info"]["rate"]
        amount_to = round(amount * rate, 2)

        from_acc.balance -= amount
        to_acc.balance += amount_to

        tx = Transaction(
            from_account_id=from_id,
            to_account_id=to_id,
            amount_from=amount,
            amount_to=amount_to,
            exchange_rate=rate,
            description=description
        )

        db.session.add(tx)
        db.session.commit()

        return {"status": "Transferencia realizada", "rate": rate}

    except Exception as e:
        return {"error": str(e)}