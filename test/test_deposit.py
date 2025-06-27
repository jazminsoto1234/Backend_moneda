from flask_jwt_extended import create_access_token
from models.usuario import User
from models.account import Account
from database.db import db

def test_register_and_login(client):
    # Registro
    res = client.post("/register", json={
        "username": "juan",
        "email": "juan@mail.com",
        "password": "1234"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert "access_token" in data

    # Login
    res = client.post("/login", json={
        "email": "juan@mail.com",
        "password": "1234"
    })
    assert res.status_code == 200
    assert "access_token" in res.get_json()

def test_get_account(client):
    # Preparamos usuario y cuenta
    user = User(username="ana", email="ana@mail.com")
    user.set_password("1234")
    db.session.add(user)
    db.session.commit()
    account = Account(user_id=user.id, currency="USD", balance=100, nro_cuenta="123")
    db.session.add(account)
    db.session.commit()

    token = create_access_token(identity=user.id)
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("/account", headers=headers)
    assert res.status_code == 200
    data = res.get_json()
    assert data[0]["balance"] == 100

def test_addmoney(client):
    user = User(username="luis", email="luis@mail.com")
    user.set_password("1234")
    db.session.add(user)
    db.session.commit()
    acc = Account(user_id=user.id, currency="PEN", balance=0, nro_cuenta="999")
    db.session.add(acc)
    db.session.commit()

    token = create_access_token(identity=user.id)
    headers = {"Authorization": f"Bearer {token}"}
    res = client.patch("/addmoney", headers=headers, json={"id": acc.id, "amount": 100})
    assert res.status_code == 200
    assert res.get_json()["new_balance"] == 100
