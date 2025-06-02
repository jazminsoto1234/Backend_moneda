from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from database.db import db
from werkzeug.security import generate_password_hash, check_password_hash


#db = SQLAlchemy()

class Account(db.Model):
    __tablename__ = "accounts"
    id = db.Column(db.Integer, primary_key=True)
    currency = db.Column(db.String(3), nullable=False)  # "PEN", "USD"
    balance = db.Column(db.Float, default=0.0)

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="accounts")

    transactions_sent = db.relationship("Transaction", back_populates="from_account", foreign_keys="Transaction.from_account_id")
    transactions_received = db.relationship("Transaction", back_populates="to_account", foreign_keys="Transaction.to_account_id")
