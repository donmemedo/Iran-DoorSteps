from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import APP_NAME, APP_VERSION, CORS_ORIGINS
from .db import init_db
from .routers import content, journey, properties
from .seed import seed


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    seed()
    yield


app = FastAPI(title=APP_NAME, version=APP_VERSION, lifespan=lifespan,
              description="Guided home-buying platform API - properties, pros, journey and tips.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if "*" not in CORS_ORIGINS else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(properties.router)
app.include_router(journey.router)
app.include_router(content.router)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok", "service": APP_NAME, "version": APP_VERSION}
