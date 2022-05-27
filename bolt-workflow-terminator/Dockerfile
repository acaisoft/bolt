FROM python:3.7

RUN pip install -U pip pipenv

WORKDIR /app

COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock

RUN pipenv install --system

COPY src /app/src

ARG release
ENV SENTRY_RELEASE $release

EXPOSE 5000
CMD gunicorn -b 0.0.0.0:5000 'src.app:serve_app()'
