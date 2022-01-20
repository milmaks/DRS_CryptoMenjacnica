# Using lightweight alpine image
FROM python:3.9-alpine

WORKDIR /UI

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

# Start app
EXPOSE 8001
#ENTRYPOINT ["python", "main.py"]
CMD ["python", "main.py"]