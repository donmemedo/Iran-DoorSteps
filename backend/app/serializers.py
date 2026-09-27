from typing import Any

from .models import Phase, Professional, Property, Step, Tip


def bi(obj: Any, field: str) -> dict:
    return {"en": getattr(obj, f"{field}_en", "") or "", "fa": getattr(obj, f"{field}_fa", "") or ""}


def property_out(p: Property, pro: Professional | None = None, full: bool = False) -> dict:
    out = {
        "id": p.id, "slug": p.slug, "title": bi(p, "title"), "city": bi(p, "city"),
        "district": bi(p, "district"), "deal": p.deal, "kind": p.kind,
        "price": p.price, "deposit": p.deposit, "rent": p.rent,
        "area": p.area, "beds": p.beds, "baths": p.baths, "parking": p.parking,
        "floor": p.floor, "yearBuilt": p.year_built, "cover": p.cover,
        "rating": p.rating, "views": p.views, "likes": p.likes, "featured": p.featured,
        "pricePerMeter": int(p.price / p.area) if p.deal == "sale" and p.area else 0,
    }
    if full:
        out |= {
            "description": bi(p, "description"), "gallery": p.gallery or [], "features": p.features or [],
            "lat": p.lat, "lng": p.lng, "createdAt": p.created_at.isoformat(),
        }
    if pro:
        out["pro"] = pro_out(pro)
    return out


def pro_out(p: Professional) -> dict:
    return {
        "id": p.id, "name": bi(p, "name"), "role": p.role, "agency": bi(p, "agency"),
        "city": bi(p, "city"), "bio": bi(p, "bio"), "phone": p.phone, "rating": p.rating,
        "reviews": p.reviews, "deals": p.deals, "hue": p.hue, "initials": p.initials,
        "specialties": p.specialties or [], "verified": p.verified,
    }


def phase_out(ph: Phase, steps: list[Step], done: set[int]) -> dict:
    return {
        "key": ph.key, "order": ph.order, "title": bi(ph, "title"), "summary": bi(ph, "summary"),
        "icon": ph.icon, "accent": ph.accent, "duration": bi(ph, "duration"),
        "steps": [
            {"id": st.id, "order": st.order, "title": bi(st, "title"), "hint": bi(st, "hint"), "done": st.id in done}
            for st in steps
        ],
    }


def tip_out(t: Tip, pro: Professional | None = None) -> dict:
    return {
        "id": t.id, "slug": t.slug, "phase": t.phase_key, "category": bi(t, "category"),
        "title": bi(t, "title"), "body": bi(t, "body"), "readMin": t.read_min, "cover": t.cover,
        "pro": pro_out(pro) if pro else None,
    }
