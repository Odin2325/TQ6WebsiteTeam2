from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///events.db'

events = SQLAlchemy(app)
class Event(events.Model):
    id = events.Column(events.Integer, primary_key=True)
    name = events.Column(events.String(100), nullable=False)
    date = events.Column(events.String(100), nullable=False)
    description = events.Column(events.String(200), nullable=False)
    location = events.Column(events.String(100), nullable=False)
    category = events.Column(events.String(100), nullable=False)
    likes = events.Column(events.Integer, default=0)

#categories: workshops, sport, concerts, exhibitions, conferences

workhop1 = Event(name='Python Workshop', date='2023-10-01', description='Learn Python from scratch', location='Room 101', category='workshops')
workhop2 = Event(name='Flask Workshop', date='2023-10-02', description='Learn Flask for web development', location='Room 102', category='workshops')
sportEvent1 = Event(name='Football Match', date='2023-10-03', description='Local team vs. rivals', location='Stadium', category='sport')
sportEvent2 = Event(name='Basketball Game', date='2023-10-04', description='Local team vs. rivals', location='Arena', category='sport')
concert1 = Event(name='Rock Concert', date='2023-10-05', description='Live rock music', location='Concert Hall', category='concerts')

if __name__ == '__main__':
    with app.app_context():
        events.create_all()
    app.run(debug=True)