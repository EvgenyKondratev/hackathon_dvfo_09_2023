import os
import uuid
import time
import json
from fastapi import FastAPI, status, Request, File, BackgroundTasks, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from main_app.logger import logger
from templates import templates

from pydantic import BaseModel


class Upload(BaseModel):
    path: str
    filename: str


class Status(BaseModel):
    percent: int
    path: str | None = None
    filename: str | None = None


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/test", StaticFiles(directory="test"), name="test")

logger.add('out.log', format="{time} {level} {message}", level="DEBUG")


@app.get("/", status_code=status.HTTP_200_OK, response_class=HTMLResponse)
async def index(request: Request):
    data = {'title': 'Сервис по улучшению качества видео'}
    template_data = {"request": request}
    template_data.update(**data)
    return templates.TemplateResponse("index.html", template_data)


@app.post("/upload")
async def upload(file: bytes = File(...)) -> Upload:
    filename = uuid.uuid4().hex + '.mp4'
    path = './test'
    with open(f'{path}/{filename}', 'wb') as f:
        f.write(file)
    return Upload(path=path, filename=filename)


@app.post("/predict")
async def predict(filename: str) -> Status:
    path = './test'
    name = f'{path}/{filename}'
    out_name = f'{path}/res/{filename}'

    os.system(f'python ./inference_realesrgan_video.py -i {name} -n realesr-animevideov3 -s 4 -o ./test/res') # --suffix {suffix}')

    return Status(**{'percent': 100, 'path': path, 'filename': out_name})

"""
def predict_background(filename: str):
    path = './test'

    name = f'{path}/{filename}'
    # suffix = 'out'
    # out_name = f'{path}/{filename}{suffix}'

    out_name = f'{path}/res/{filename}'

    # with open(f'{path}/{filename}.json', 'wt') as f:
    #     json.dump({'percent': 0}, f)

    os.system(f'python ./inference_realesrgan_video.py -i {name} -n realesr-animevideov3 -s 4 -o ./test/res') # --suffix {suffix}')
    # with open(f'{path}/{filename}.json', 'wt') as f:
    #     json.dump({'percent': 100, 'path': path, 'filename': out_name}, f)

    # for i in range(100):
    #     with open(f'{path}/{filename}.json', 'wt') as f:
    #         json.dump({'percent': i}, f)
    #     time.sleep(1)
    # with open(f'{path}/{filename}.json', 'wt') as f:
    #     json.dump({'percent': 100, 'path': path, 'filename': filename}, f)


@app.post("/predict")
async def predict(filename: str, background_tasks: BackgroundTasks) -> Status:
    background_tasks.add_task(predict_background, filename)
    return Status(percent=0)


@app.get("/status")
async def status(filename: str) -> Status:
    path = './test'
    with open(f'{path}/{filename}.json') as f:
        st = Status(**(json.load(f)))
    return st
"""