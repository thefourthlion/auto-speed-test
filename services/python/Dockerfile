FROM python:3.9-alpine

WORKDIR /speedtest-services-extspeeds

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 3002

CMD ["watchmedo", "auto-restart", "--directory=./", "--patterns=*.py", "--recursive", "--", "python3", "main.py"]
