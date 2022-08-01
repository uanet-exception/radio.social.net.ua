import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    JSON_SORT_KEYS = False
    SCHEDULER_API_ENABLED = False
    SECRET_KEY = os.environ.get('SECRET_KEY', 'you-will-never-guess')
    ICECAST_STREAM_URL = os.environ.get('ICECAST_STREAM_URL', 'http://radio.social.net.ua/live.mp3')  # NOQA: E501
    ICECAST_STATUS_JSON_URL = os.environ.get('ICECAST_STATUS_JSON_URL', 'http://radio.social.net.ua/status-json.xsl')  # NOQA: E501
    STATUS_HISTORY_FILE = os.environ.get('STATUS_HISTORY_FILE', os.path.join(basedir, 'icestats_history.json'))  # NOQA: E501
