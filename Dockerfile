FROM python:3.10.5-alpine

RUN apk update && apk add --no-cache supervisor

RUN mkdir -p /opt/radio /var/log/supervisor/
WORKDIR /opt/radio

ADD requirements.txt .
RUN pip install -r requirements.txt

COPY app ./app
ADD *.py ./

COPY supervisord.conf /etc/supervisord.conf
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisord.conf"]
