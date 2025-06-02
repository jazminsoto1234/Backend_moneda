from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from models import usuario, transaction, account
from routes.user_routes import user_bp
from routes.exchange_routes import exchange_bp  # asegurarte que usas exchange, no transaction
from flask_jwt_extended import JWTManager
from database.db import db

def create_app():
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "yF&9d!cX3wzR^vM1#qLpT4jK7sUbEo"
    jwt = JWTManager(app)


    
    # Configuración de la base de datos SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////home/jazmin/exchange_db.db"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Inicializar base de datos
    db.init_app(app)

    # Registrar Blueprints
    app.register_blueprint(user_bp, url_prefix="/user")
    #app.register_blueprint(user_bp, url_prefix="/user")
    app.register_blueprint(exchange_bp, url_prefix="/exchange")

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)