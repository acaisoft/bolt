FROM python:3.10.4-slim

RUN apt update &&\
    apt upgrade -y &&\
    apt-get install -y curl

WORKDIR /monitoring

COPY monitoring .
COPY requirements.txt .

RUN pip install -r requirements.txt

CMD python monitoring.py
