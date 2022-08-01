import json
import time
import shutil
import os.path
import tempfile


class IcecastStatus(object):
    def __init__(self, filename):
        self.filename = filename
        self.before = []
        self.current = {}
        self.listeners = 0
        self.listener_peak = 0

    def load(self):
        if not os.path.exists(self.filename):
            return self

        with open(self.filename, 'r') as fd:
            snapshot = json.load(fd)
            self.before = snapshot.get('before')
            self.current = snapshot.get('current')
            self.listeners = snapshot.get('listeners')
            self.listener_peak = snapshot.get('listener_peak')

    def save(self):
        with tempfile.NamedTemporaryFile(delete=False, mode='w+') as fd:
            json.dump({
                'before': self.before,
                'current': self.current,
                'listeners': self.listeners,
                'listener_peak': self.listener_peak
            }, fd)
            fd.flush()
            shutil.move(fd.name, self.filename)

    def check_or_update(self, track):
        if not self.current:
            self.current['track'] = track
            self.current['first_seen'] = time.time()
            return

        if self.current['track'] != track:
            self.before.insert(0, {
                'title': self.current['track'],
                'time': int(time.time() - self.current['first_seen'])
            })
            self.current['track'] = track
            self.current['first_seen'] = time.time()

        if len(self.before) > 12:
            self.before = self.before[:12]

    def current_track(self):
        return self.current.get('track', '')

    def current_time(self):
        return int(time.time() - self.current.get('first_seen', 0))
