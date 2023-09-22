# syntax=docker/dockerfile:1
FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y libgl1

RUN pip install --upgrade pip

COPY requirements_nn.txt /tmp/requirements_nn.txt
RUN pip install -r /tmp/requirements_nn.txt

COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

COPY ./app .

RUN rm -rf /var/cache/apk/* \
    && rm -rf /tmp/*

EXPOSE 8001

#CMD [ "python", "./main.py" ]
#ENTRYPOINT ["./gunicorn.sh"]
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8001"]