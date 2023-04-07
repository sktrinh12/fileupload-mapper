FROM python:3.9-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt

RUN python -m pip install --upgrade pip

RUN pip3 install --no-cache-dir --upgrade -r requirements.txt

COPY . ./
EXPOSE 80
CMD [ "python", "main.py"]
