FROM python:3.10.4-slim

RUN apt update
RUN apt upgrade -y
RUN apt install -y curl git

RUN curl https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-385.0.0-linux-x86_64.tar.gz > /tmp/google-cloud-sdk.tar.gz \
  && mkdir -p /usr/local/gcloud \
  && tar -C /usr/local/gcloud -xvf /tmp/google-cloud-sdk.tar.gz \
  && /usr/local/gcloud/google-cloud-sdk/install.sh

ENV PATH $PATH:/usr/local/gcloud/google-cloud-sdk/bin

RUN pip install --upgrade pip==20.1.1

WORKDIR /builder

COPY builder/ .
COPY requirements.txt .
COPY requirements.lock .

RUN pip install -r requirements.lock

CMD python build.py
