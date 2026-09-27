from datetime import datetime
from typing import Optional

from sqlalchemy import Column, JSON
from sqlmodel import Field, SQLModel


class Property(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    title_en: str
    title_fa: str
    description_en: str = ""
    description_fa: str = ""
    city_en: str = Field(index=True)
    city_fa: str
    district_en: str = ""
    district_fa: str = ""
    deal: str = Field(default="sale", index=True)          # sale | rent
    kind: str = Field(default="apartment", index=True)      # apartment | villa | penthouse | office | land
    price: int = 0                                          # sale price, toman
    deposit: int = 0                                        # rent deposit, toman
    rent: int = 0                                           # monthly rent, toman
    area: int = 0                                           # m2
    beds: int = 0
    baths: int = 1
    parking: int = 0
    floor: int = 0
    year_built: int = 1400
    lat: float = 35.7
    lng: float = 51.4
    cover: str = "a1"
    gallery: list = Field(default_factory=list, sa_column=Column(JSON))
    features: list = Field(default_factory=list, sa_column=Column(JSON))
    rating: float = 4.5
    views: int = 0
    likes: int = 0
    featured: bool = False
    pro_id: Optional[int] = Field(default=None, foreign_key="professional.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Professional(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name_en: str
    name_fa: str
    role: str = Field(default="agent", index=True)  # agent | lender | inspector | designer | lawyer | mover
    agency_en: str = ""
    agency_fa: str = ""
    city_en: str = ""
    city_fa: str = ""
    bio_en: str = ""
    bio_fa: str = ""
    phone: str = ""
    rating: float = 4.8
    reviews: int = 0
    deals: int = 0
    hue: int = 210
    initials: str = ""
    specialties: list = Field(default_factory=list, sa_column=Column(JSON))
    verified: bool = True


class Phase(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    key: str = Field(index=True, unique=True)
    order: int = 0
    title_en: str
    title_fa: str
    summary_en: str = ""
    summary_fa: str = ""
    icon: str = "compass"
    accent: str = "sky"
    duration_en: str = ""
    duration_fa: str = ""


class Step(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    phase_key: str = Field(index=True)
    order: int = 0
    title_en: str
    title_fa: str
    hint_en: str = ""
    hint_fa: str = ""


class Tip(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    slug: str = Field(index=True, unique=True)
    phase_key: str = "dream"
    category_en: str = "Guide"
    category_fa: str = "راهنما"
    title_en: str
    title_fa: str
    body_en: str = ""
    body_fa: str = ""
    read_min: int = 4
    cover: str = "t1"
    pro_id: Optional[int] = None


class Progress(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    profile: str = Field(index=True)
    step_id: int
    done: bool = True
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class Favorite(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    profile: str = Field(index=True)
    property_id: int
    liked: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Lead(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    phone: str
    email: str = ""
    message: str = ""
    property_id: Optional[int] = None
    pro_id: Optional[int] = None
    kind: str = "contact"
    created_at: datetime = Field(default_factory=datetime.utcnow)
