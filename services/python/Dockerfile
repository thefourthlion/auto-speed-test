FROM python:3.9

WORKDIR / speedtest-service

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 3002

CMD ["python", "main.py"]

# docker build -t speedtest-service .
# docker run -d --network host -it --name speedtest-service speedtest-service