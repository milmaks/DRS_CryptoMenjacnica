# Using lightweight alpine image
FROM python:3.6-alpine

WORKDIR /UI

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

COPY . .

# Start app
#EXPOSE 8001
#ENTRYPOINT ["python", "app.py"]
#CMD ["python", "app.py"]
ENTRYPOINT ["python"]
CMD ["app.py"]