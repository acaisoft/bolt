FROM python:3.7-alpine

ENV PYTHONBUFFERED=0
RUN pip install --upgrade pip==20.2.3 && pip install pipenv

WORKDIR /app

COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock
COPY requirements.lock requirements.lock

RUN pip install -r requirements.lock

COPY src /app/src

ARG release
ENV SENTRY_RELEASE $release

EXPOSE 5000
CMD gunicorn --log-level info -b '0.0.0.0:5000' 'src.app:serve_app()'
