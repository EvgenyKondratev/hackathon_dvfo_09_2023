from fastapi import FastAPI, HTTPException, status, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from main_app.logger import logger
from templates import templates


app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
logger.add('out.log', format="{time} {level} {message}", level="DEBUG")


@app.get("/", status_code=status.HTTP_200_OK, response_class=HTMLResponse)
async def index(request: Request):
    data = {'title': 'Сервис по улучшению качества видео'}
    template_data = {"request": request}
    template_data.update(**data)
    return templates.TemplateResponse("index.html", template_data)

