import uuid
import time
import json
from fastapi import FastAPI, status, Request, File, BackgroundTasks
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from main_app.logger import logger
from templates import templates

from pydantic import BaseModel


class Upload(BaseModel):
    filename: str


class Status(BaseModel):
    percent: int
    link: str | None = None


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
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
    with open(f'./test/{filename}', 'wb') as f:
        f.write(file)
    return Upload(filename=filename)


def predict_background(filename: str):
    for i in range(100):
        with open(f'./test/{filename}.json', 'wt') as f:
            json.dump({'percent': i}, f)
        time.sleep(1)
    with open(f'./test/{filename}.json', 'wt') as f:
        json.dump({'percent': 100, 'link': f'./test/{filename}'}, f)


@app.post("/predict")
async def predict(filename: str, background_tasks: BackgroundTasks) -> Status:
    background_tasks.add_task(predict_background, filename)
    return Status(percent=0)


@app.get("/status")
async def status(filename: str) -> Status:
    with open(f'./test/{filename}.json') as f:
        st = Status(**(json.load(f)))
    return st
