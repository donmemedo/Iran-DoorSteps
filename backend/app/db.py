import os
from pathlib import Path
from sqlmodel import SQLModel, Session, create_engine
from .config import DATABASE_URL

if DATABASE_URL.startswith("sqlite"):
    Path(DATABASE_URL.split("///")[-1]).parent.mkdir(parents=True, exist_ok=True)

engine = create_engine(
    DATABASE_URL,
    echo=False,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
