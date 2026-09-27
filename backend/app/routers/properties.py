from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlmodel import Session, func, or_, select

from ..db import get_session
from ..models import Favorite, Professional, Property
from ..serializers import property_out

router = APIRouter(prefix="/api/properties", tags=["properties"])

SORTS = {
    "newest": Property.id.desc(),
    "price-asc": Property.price.asc(),
    "price-desc": Property.price.desc(),
    "area-desc": Property.area.desc(),
    "rating": Property.rating.desc(),
    "popular": Property.views.desc(),
}


def _filtered(
    q: Optional[str] = None, city: Optional[str] = None, deal: Optional[str] = None,
    kind: Optional[str] = None, min_price: Optional[int] = None, max_price: Optional[int] = None,
    beds: Optional[int] = None, min_area: Optional[int] = None, featured: Optional[bool] = None,
    features: Optional[str] = None,
):
    stmt = select(Property)
    if q:
        like = f"%{q}%"
        stmt = stmt.where(or_(Property.title_en.ilike(like), Property.title_fa.ilike(like),
                              Property.city_en.ilike(like), Property.city_fa.ilike(like),
                              Property.district_en.ilike(like), Property.district_fa.ilike(like)))
    if city:
        stmt = stmt.where(or_(Property.city_en == city, Property.city_fa == city))
    if deal:
        stmt = stmt.where(Property.deal == deal)
    if kind:
        stmt = stmt.where(Property.kind.in_(kind.split(",")))
    if min_price:
        stmt = stmt.where(Property.price >= min_price)
    if max_price:
        stmt = stmt.where(Property.price <= max_price)
    if beds:
        stmt = stmt.where(Property.beds >= beds)
    if min_area:
        stmt = stmt.where(Property.area >= min_area)
    if featured is not None:
        stmt = stmt.where(Property.featured == featured)
    return stmt


@router.get("")
def list_properties(
    session: Session = Depends(get_session),
    q: Optional[str] = None, city: Optional[str] = None, deal: Optional[str] = None,
    kind: Optional[str] = None, min_price: Optional[int] = None, max_price: Optional[int] = None,
    beds: Optional[int] = None, min_area: Optional[int] = None, featured: Optional[bool] = None,
    features: Optional[str] = None, sort: str = "newest", page: int = 1, size: int = Query(12, le=48),
):
    stmt = _filtered(q, city, deal, kind, min_price, max_price, beds, min_area, featured, features)
    rows = session.exec(stmt.order_by(SORTS.get(sort, SORTS["newest"]))).all()
    if features:
        wanted = set(features.split(","))
        rows = [r for r in rows if wanted.issubset(set(r.features or []))]
    total = len(rows)
    start = (page - 1) * size
    chunk = rows[start:start + size]
    pros = {p.id: p for p in session.exec(select(Professional)).all()}
    return {
        "items": [property_out(p, pros.get(p.pro_id)) for p in chunk],
        "total": total, "page": page, "size": size, "pages": max(1, -(-total // size)),
    }


@router.get("/facets")
def facets(session: Session = Depends(get_session)):
    rows = session.exec(select(Property)).all()
    cities = {}
    for r in rows:
        cities.setdefault(r.city_en, {"en": r.city_en, "fa": r.city_fa, "count": 0})["count"] += 1
    sale = [r.price for r in rows if r.deal == "sale"]
    return {
        "cities": sorted(cities.values(), key=lambda c: -c["count"]),
        "kinds": sorted({r.kind for r in rows}),
        "features": sorted({f for r in rows for f in (r.features or [])}),
        "priceMin": min(sale or [0]), "priceMax": max(sale or [0]), "total": len(rows),
    }


@router.get("/deck")
def deck(session: Session = Depends(get_session), profile: str = "guest", limit: int = 12):
    seen = {f.property_id for f in session.exec(select(Favorite).where(Favorite.profile == profile)).all()}
    rows = [r for r in session.exec(select(Property)).all() if r.id not in seen]
    pros = {p.id: p for p in session.exec(select(Professional)).all()}
    rows.sort(key=lambda r: (-r.rating, -r.likes))
    return {"items": [property_out(p, pros.get(p.pro_id), full=True) for p in rows[:limit]], "remaining": len(rows)}


class SwipeIn(BaseModel):
    profile: str = "guest"
    liked: bool = True


@router.post("/{slug}/swipe")
def swipe(slug: str, body: SwipeIn, session: Session = Depends(get_session)):
    p = session.exec(select(Property).where(Property.slug == slug)).first()
    if not p:
        raise HTTPException(404, "property not found")
    fav = session.exec(select(Favorite).where(Favorite.profile == body.profile, Favorite.property_id == p.id)).first()
    if fav:
        fav.liked = body.liked
    else:
        session.add(Favorite(profile=body.profile, property_id=p.id, liked=body.liked))
    if body.liked:
        p.likes += 1
        session.add(p)
    session.commit()
    return {"ok": True, "liked": body.liked}


@router.get("/favorites")
def favorites(session: Session = Depends(get_session), profile: str = "guest"):
    ids = [f.property_id for f in session.exec(
        select(Favorite).where(Favorite.profile == profile, Favorite.liked == True)).all()]  # noqa: E712
    if not ids:
        return {"items": []}
    rows = session.exec(select(Property).where(Property.id.in_(ids))).all()
    pros = {p.id: p for p in session.exec(select(Professional)).all()}
    return {"items": [property_out(p, pros.get(p.pro_id)) for p in rows]}


@router.get("/{slug}")
def detail(slug: str, session: Session = Depends(get_session)):
    p = session.exec(select(Property).where(Property.slug == slug)).first()
    if not p:
        raise HTTPException(404, "property not found")
    p.views += 1
    session.add(p)
    session.commit()
    session.refresh(p)
    pro = session.get(Professional, p.pro_id) if p.pro_id else None
    similar = session.exec(
        select(Property).where(Property.city_en == p.city_en, Property.id != p.id).limit(3)).all()
    return {
        "property": property_out(p, pro, full=True),
        "similar": [property_out(x) for x in similar],
    }
