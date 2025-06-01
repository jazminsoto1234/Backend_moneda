from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from . import db
from werkzeug.security import generate_password_hash, check_password_hash


#db = SQLAlchemy()


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    currency = db.Column(db.String, nullable=False)  # 'USD' o 'PEN'
    balance = db.Column(db.Float, default=0.0)
    user = db.relationship("User", back_populates="accounts")