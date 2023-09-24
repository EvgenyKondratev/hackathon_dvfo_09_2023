import os
import uuid
import time
import json
import cv2
from fastapi import FastAPI, status, Request, File, BackgroundTasks, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from main_app.logger import logger
from templates import templates

from RealESRGAN__ import RealESRGAN

import torch

import shutil

SCALE = 4


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

device = 'cpu'  # torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = RealESRGAN(device, scale=SCALE)
model.load_weights('weights/RealESRGAN_x4.pth', download=True)


@app.get("/", status_code=status.HTTP_200_OK, response_class=HTMLResponse)
async def index(request: Request):
    # print(torch.cuda.is_available())
    # print(torch.cuda.device_count())
    # print(torch.cuda.current_device())

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


def predict_file(filename: str, out_path: str, fr=600, step=30):
    path = './test'
    name = f'{path}/{filename}'
    #out_path = f'{path}/res'

    vid = cv2.VideoCapture(name)
    frame_count = int(vid.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(vid.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(vid.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(vid.get(cv2.CAP_PROP_FPS))
    codec = vid.get(cv2.CAP_PROP_FOURCC)
    h = int(codec)
    fourcc = chr(h & 0xff) + chr((h >> 8) & 0xff) + chr((h >> 16) & 0xff) + chr((h >> 24) & 0xff)

    print(f'frame_count = {frame_count} ({width}x{height}) fps={fps}, fourcc={fourcc}')

    # fourcc = 'mp4v'
    # fourcc = 'MJPG'
    fourcc = 'XVID'
    vid_writer = cv2.VideoWriter(out_path, cv2.VideoWriter_fourcc(*fourcc), fps, (width * SCALE, height * SCALE))
    
    for i in range(frame_count):
        if i == fr:
            break
        _, frame = vid.read()
        if i % step == 0:
            original_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            sr_frame = model.predict(original_frame)
            sr_frame = cv2.cvtColor(sr_frame, cv2.COLOR_RGB2BGR)
        vid_writer.write(sr_frame)
    vid_writer.release()


@app.post("/predict")
async def predict(filename: str) -> Status:
    path = './test'
    name = f'{path}/{filename}'
    suffix = 'out'
    fn, ext = os.path.splitext(filename)

    out_name = f'{path}/res/{fn}_{suffix}{ext}'
    predict_file(filename, out_name, fr=60, step=5)

    # shutil.copy(name, out_name)
    # out_name = f'{path}/res/a2ff54c630144f03958c1ed6e7690416_out.mp4'

    #os.system(f'python ./inference_realesrgan_video.py -i {name} -n realesr-animevideov3 -s 4 -o ./test/res --suffix {suffix}')

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