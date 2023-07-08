from flask import Flask
from config import Config
from flask_apscheduler import APScheduler

app = Flask(__name__)
app.config.from_object(Config)

scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()


@app.context_processor
def site_variables():
    return {
        'url': app.config.get('SITE_URL'),
        'title': app.config.get('SITE_TITLE'),
        'description': app.config.get('SITE_DESCRIPTION'),
    }


from app import routes  # NOQA: F401, E402
from app.runners import tasks  # NOQA: F401, E402
