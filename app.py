from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from model import db, User, Account, Transaction
from routes.user_route import user_bp
from routes.account_routes import account_bp
from routes.user_route import transaction_bp

def create_app():
    app = Flask(__name__)
    
    # Configuración de la base de datos SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exchange.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar base de datos
    db.init_app(app)

    # Registrar Blueprints
    app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(account_bp, url_prefix="/account")
    app.register_blueprint(transaction_bp, url_prefix="/transaction")

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)