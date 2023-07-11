from app import app
from app.models import IcecastStatus
from flask import render_template, make_response, jsonify


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/live.mp3.m3u')
def live_m3u():
    resp = make_response(render_template('live.m3u'), 200)
    resp.mimetype = 'application/x-mpegURL'
    return resp


@app.route('/live.mp3.xspf')
def live_xspf():
    resp = make_response(render_template('live.xspf'), 200)
    resp.mimetype = 'application/xspf+xml'
    return resp


@app.route('/playlist.json')
def playlist_json():
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
