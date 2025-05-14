from flask import Flask, render_template, request, jsonify
from database import init_database, db, create_db
from pathlib import Path
from utils.message import success_message
from database import Event

app = Flask(__name__)

db_dir = Path(__file__).parent / "databases"
db_dir.mkdir(exist_ok=True)
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{db_dir / f'events.db'}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
create_db("events")

@app.route('/events/getall', methods=['GET'])
def get_events():
    allEvents = Event.query.all()
    return jsonify([
        {'id': event.id, 'name': event.name, 'date': event.date, 'description': event.description, 'location': event.location, 'category': event.category, 'likes': event.likes}
        for event in allEvents
    ])

@app.route('/events/getlikes', methods=['GET'])
def get_events():
    allEvents = Event.query.all()
    return jsonify([
        {'likes': event.likes}
        for event in allEvents
    ])

@app.route('/events/addlike/<id>', methods=['POST'])
def get_events():
    

if __name__ == '__main__':
    success_message("Server is running...")
    app.run(debug=True)