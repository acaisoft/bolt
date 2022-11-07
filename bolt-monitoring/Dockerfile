FROM python:3.9-slim

RUN apt update &&\
    apt upgrade -y &&\
    apt-get install -y curl gcc libgirepository1.0-dev


RUN apt update &&\
    apt upgrade -y &&\
    apt-get install -y libpango-1.0.0 libglib2.0-dev libfreetype6-dev gir1.2-harfbuzz-0.0 libpangoft2-1.0-0\
     libpangocairo-1.0-0 &&\
    rm -rf /var/lib/apt/lists/*

WORKDIR /monitoring

COPY monitoring .
COPY requirements.txt .

RUN pip install -r requirements.txt

CMD python monitoring.py
