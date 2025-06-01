from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

from . import db

#db = SQLAlchemy()


class User(db.Model):
    # Id usuario
    id = db.Column(db.Integer, primary_key=True)
    

    name = db.Column(db.String, nullable=False, unique=True)

    password_hash = db.Column(db.String, nullable=False)
    
    accounts = db.relationship("Account", back_populates="user")
    
    transactions_from = db.relationship("Transaction", back_populates="from_account", foreign_keys="Transaction.from_account_id")
    
    transactions_to = db.relationship("Transaction", back_populates="to_account", foreign_keys="Transaction.to_account_id")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

