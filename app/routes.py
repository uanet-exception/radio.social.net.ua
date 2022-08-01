from app import app
from app.models import IcecastStatus
from flask import render_template, jsonify


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/playlist.json')
def playlist():
    icestats = IcecastStatus(app.config['STATUS_HISTORY_FILE'])
    icestats.load()
    return jsonify({
        "before": icestats.before,
        "current": {
            "title": icestats.current_track()
        },
        "elapsed": icestats.current_time(),
        "listeners": {
            "peak": icestats.listener_peak,
            "current": icestats.listeners
        }
    })
