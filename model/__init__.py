from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Importa las clases para que estén disponibles al importar `models`
from .usuario import User
from .account import Account
from .transacction import Transaction