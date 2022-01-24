FROM python:3.6-alpine

RUN apk update && apk add python3-dev \
                          gcc \
                          libc-dev \
                          libffi-dev\
    && pip3 install  --upgrade pip

WORKDIR /CryptoMenjacnica

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt


COPY . .

# Start app
#EXPOSE 8000
ENTRYPOINT ["python"]
CMD ["app.py"]