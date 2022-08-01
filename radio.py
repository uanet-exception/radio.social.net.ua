#!/usr/bin/env python3

from app import app
from asgiref.wsgi import WsgiToAsgi

asgi_app = WsgiToAsgi(app)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, threaded=True)
