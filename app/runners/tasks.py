import os.path
import requests
from app import scheduler
from app.models import IcecastStatus


@scheduler.task('interval', id='fetch_icecast_metadata', seconds=5, max_instances=1)  # NOQA: E501
def fetch_icecast_metadata():
    with scheduler.app.app_context():
        status_url = scheduler.app.config['ICECAST_STATUS_JSON_URL']
        stream_path = os.path.basename(scheduler.app.config['ICECAST_STREAM_URL'])  # NOQA: E501
        r = requests.get(status_url, timeout=2)
        r.raise_for_status()
        icestats = r.json().get('icestats')

        source = {}
        if isinstance(icestats.get('source'), list):
            for item in icestats.get('source'):
                if item.get('listenurl').endswith(f'/{stream_path}'):
                    source = item
                    break
        else:
            if icestats.get('source').get('listenurl').endswith(f'/{stream_path}'):  # NOQA: E501
                source = icestats.get('source')

        # FIXME: raise exception if source is empty?
        if not source:
            return

        icestats = IcecastStatus(scheduler.app.config['STATUS_HISTORY_FILE'])
        icestats.load()
        icestats.listeners = source.get('listeners')
        icestats.listener_peak = source.get('listener_peak')
        icestats.check_or_update(source.get('title'))
        icestats.save()
