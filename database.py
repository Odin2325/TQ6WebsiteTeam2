from flask_sqlalchemy import SQLAlchemy
from models import db, Event
from flask import Flask, request
from config import get_database_uri
from pathlib import Path
from utils.message import success_message, error_message, info_message


def create_db(shop: str):
    uri = get_database_uri(shop)
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = uri
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

    with app.app_context():
        db_path = Path(get_database_uri(shop).replace("sqlite:///", ""))
        if not db_path.exists():
            db.create_all()
            init_database()
            success_message(f"[Database] ⚙️ Erstellt DB für '{shop}' unter {db_path}")

def init_database():
    info_message("[Database] Initialdaten werden gefüllt...")

    try:
        if not Event.query.first():
            eventsList = [
                Event(name='Python Workshop', date='2023-10-01', description='Learn Python from scratch', location='Room 101', category='workshops'),
                Event(name='Flask Workshop', date='2023-10-02', description='Learn Flask for web development', location='Room 102', category='workshops'),
                Event(name='Football Match', date='2023-10-03', description='Local team vs. rivals', location='Stadium', category='sport'),
                Event(name='Basketball Game', date='2023-10-04', description='Local team vs. rivals', location='Arena', category='sport'),
                Event(name='Rock Concert', date='2023-10-05', description='Live rock music', location='Concert Hall', category='concerts')
            ]
            db.session.add_all(eventsList)

        db.session.commit()
        success_message("[Database] Initialdaten wurden erfolgreich eingefügt.")
    except Exception as e:
        error_message(f"[Database] Initial-Fill fehlgeschlagen: {str(e)}")