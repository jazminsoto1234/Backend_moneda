from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from . import db


#db = SQLAlchemy()


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    from_account_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    to_account_id = db.Column(db.Integer, db.ForeignKey("account.id"))
    amount_from = db.Column(db.Float)
    amount_to = db.Column(db.Float)
    exchange_rate = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(db.String, default="")

    from_account = db.relationship("Account", foreign_keys=[from_account_id], back_populates="transactions_from")
    to_account = db.relationship("Account", foreign_keys=[to_account_id], back_populates="transactions_to")