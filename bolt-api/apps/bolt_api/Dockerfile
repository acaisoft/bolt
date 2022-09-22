FROM python:3.10.0b3-slim as base
RUN apt-get update &&\
    apt-get install -y curl gcc libjpeg62-turbo-dev zlib1g-dev musl musl-dev libffi-dev openssh-client libjpeg62  \
    libmagic1

RUN pip install --no-cache-dir --upgrade -U pip

FROM base as builder

RUN mkdir /install
WORKDIR /install

RUN curl -L https://github.com/argoproj/argo/releases/download/v2.3.0/argo-linux-amd64 > /usr/bin/argo \
  && chmod +x /usr/bin/argo

# core requirements for hasura and graphql
COPY apps/bolt_api/requirements/core.txt /requirements_core.txt
RUN pip install --prefix=/install -r /requirements_core.txt
# remove if deploying upload processor separately
COPY apps/bolt_api/requirements/upload_processing.txt /requirements_upload_processing.txt
RUN pip install --prefix=/install -r /requirements_upload_processing.txt

FROM base
COPY --from=builder /install /usr/local
COPY --from=builder /usr/bin/argo /usr/bin/argo

COPY apps /apps
COPY services /services
COPY instance /instance
COPY cmds /cmds
RUN mkdir /apps/executions
WORKDIR /

ARG release
ENV SENTRY_RELEASE $release
ENV FLASK_APP=apps.bolt_api.wsgi:application

RUN apt-get install -y git &&\
    rm -rf /var/lib/apt/lists/*

CMD gunicorn apps.bolt_api.wsgi:application -w 6 --timeout 480 --bind 0.0.0.0:80 --worker-tmp-dir /dev/shm --preload
