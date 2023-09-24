# syntax=docker/dockerfile:1
FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y libgl1 ffmpeg

RUN pip install --upgrade pip

COPY requirements_nn.txt /tmp/requirements_nn.txt
RUN pip install -r /tmp/requirements_nn.txt

RUN pip3 install torch torchvision torchaudio -f https://download.pytorch.org/whl/cu111/torch_stable.html

COPY requirements_gan.txt /tmp/requirements_gan.txt
RUN pip install -r /tmp/requirements_gan.txt

COPY requirements_internal.txt /tmp/requirements_internal.txt
RUN pip install -r /tmp/requirements_internal.txt

COPY requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

COPY ./app .

RUN rm -rf /var/cache/apk/* \
    && rm -rf /tmp/*

EXPOSE 8001

#CMD [ "python", "./main.py" ]
#ENTRYPOINT ["./gunicorn.sh"]
CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "8001"]