FROM python:3.9

WORKDIR /speedtest-service

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 3002

CMD ["python", "main.py"]


# sudo docker run --network host -it --name speedtest-container speedtest-service