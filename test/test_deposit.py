from flask_jwt_extended import create_access_token
from models.usuario import User
from models.account import Account
from database.db import db

def test_register_and_login(client):
    # Registro
    res = client.post("user/register", json={
        "username": "juan",
        "email": "juan@mail.com",
        "password": "1234"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert "access_token" in data

    # Login
    res = client.post("user/login", json={
        "email": "juan@mail.com",
        "password": "1234"
    })
    assert res.status_code == 200
    assert "access_token" in res.get_json()


def test_get_account(client):
    # Registrar el usuario
    res = client.post("user/register", json={
        "username": "ana",
        "email": "ana@mail.com",
        "password": "1234"
    })
    assert res.status_code == 201  # Verificamos que el registro fue exitoso

    # Iniciar sesión usando email y password
    res = client.post("user/login", json={
        "email": "ana@mail.com",
        "password": "1234"
    })
    assert res.status_code == 200  # Verificamos que el login fue exitoso
    token = res.get_json().get("access_token")  # Extraemos el token de la respuesta

    # Crear una cuenta para el usuario
    

    # Realizar la solicitud con el token de autorización
    headers = {"Authorization": f"Bearer {token}"}
    res = client.get("user/account", headers=headers)
    assert res.status_code == 200  # Verificamos que la respuesta sea exitosa
    data = res.get_json()
    assert data[0]["balance"] == 0 # Verificamos que el balance es el esperado


def test_addmoney(client):
    # Registro
    res = client.post("user/register", json={
        "username": "juan",
        "email": "juan@mail.com",
        "password": "1234"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert "access_token" in data

    # Login
    res = client.post("user/login", json={
        "email": "juan@mail.com",
        "password": "1234"
    })
    assert res.status_code == 200  # -> aca bota error porque no hay usuario registrado -> al parecer sale no autorizado pero no tiene el signo q requiere el jwt
    token = res.get_json().get("access_token")  # Extraemos el token 
    headers = {"Authorization": f"Bearer {token}"}

    # Get account ID from list
    res_account = client.get("user/account", headers=headers)
    accounts = res_account.get_json()
    assert res_account.status_code == 200
    assert accounts, "No accounts found"
    account_id = accounts[0]["id"]

    # Add money
    res = client.patch("user/addmoney", headers=headers, json={
        "id": account_id,
        "amount": 100
    })

    assert res.status_code == 200
    data = res.get_json()
    assert data["new_balance"] == 100
    assert data["message"] == "Monto agregado exitosamente"
