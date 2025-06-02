from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from database.db import db


#db = SQLAlchemy()


from datetime import datetime

class Transaction(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    from_account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)
    to_account_id = db.Column(db.Integer, db.ForeignKey("accounts.id"), nullable=False)

    original_amount = db.Column(db.Float, nullable=False)
    converted_amount = db.Column(db.Float, nullable=False)
    exchange_rate = db.Column(db.Float, nullable=False)
    from_currency = db.Column(db.String(3), nullable=False)
    to_currency = db.Column(db.String(3), nullable=False)

    from_account = db.relationship("Account", foreign_keys=[from_account_id], back_populates="transactions_sent")
    to_account = db.relationship("Account", foreign_keys=[to_account_id], back_populates="transactions_received")
