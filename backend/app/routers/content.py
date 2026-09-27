from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlmodel import Session, select

from ..db import get_session
from ..models import Lead, Professional, Property, Tip
from ..serializers import pro_out, tip_out

router = APIRouter(prefix="/api", tags=["content"])


@router.get("/pros")
def pros(session: Session = Depends(get_session), role: Optional[str] = None,
         city: Optional[str] = None, q: Optional[str] = None):
    rows = session.exec(select(Professional)).all()
    if role:
        rows = [r for r in rows if r.role == role]
    if city:
        rows = [r for r in rows if city in (r.city_en, r.city_fa)]
    if q:
        ql = q.lower()
        rows = [r for r in rows if ql in r.name_en.lower() or q in r.name_fa or ql in r.agency_en.lower()]
    rows.sort(key=lambda r: -r.rating)
    return {"items": [pro_out(r) for r in rows], "roles": sorted({r.role for r in session.exec(select(Professional)).all()})}


@router.get("/pros/{pro_id}")
def pro_detail(pro_id: int, session: Session = Depends(get_session)):
    p = session.get(Professional, pro_id)
    if not p:
        raise HTTPException(404, "professional not found")
    return {"pro": pro_out(p)}


@router.get("/tips")
def tips(session: Session = Depends(get_session), phase: Optional[str] = None):
    rows = session.exec(select(Tip)).all()
    if phase:
        rows = [r for r in rows if r.phase_key == phase]
    pros = {p.id: p for p in session.exec(select(Professional)).all()}
    return {"items": [tip_out(t, pros.get(t.pro_id)) for t in rows]}


@router.get("/tips/{slug}")
def tip_detail(slug: str, session: Session = Depends(get_session)):
    t = session.exec(select(Tip).where(Tip.slug == slug)).first()
    if not t:
        raise HTTPException(404, "tip not found")
    return {"tip": tip_out(t, session.get(Professional, t.pro_id) if t.pro_id else None)}


class LeadIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=6, max_length=24)
    email: str = ""
    message: str = ""
    property_id: Optional[int] = None
    pro_id: Optional[int] = None
    kind: str = "contact"


@router.post("/leads", status_code=201)
def create_lead(body: LeadIn, session: Session = Depends(get_session)):
    lead = Lead(**body.model_dump())
    session.add(lead)
    session.commit()
    session.refresh(lead)
    return {"ok": True, "id": lead.id}


@router.get("/stats")
def stats(session: Session = Depends(get_session)):
    props = session.exec(select(Property)).all()
    pros_rows = session.exec(select(Professional)).all()
    sale = [p.price for p in props if p.deal == "sale" and p.area]
    return {
        "properties": len(props),
        "pros": len(pros_rows),
        "cities": len({p.city_en for p in props}),
        "avgPricePerMeter": int(sum(p.price / p.area for p in props if p.deal == "sale" and p.area) / max(1, len(sale))),
        "deals": sum(p.deals for p in pros_rows),
        "satisfaction": 97,
    }
