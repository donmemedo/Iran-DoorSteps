from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session, select

from ..db import get_session
from ..models import Phase, Progress, Step
from ..serializers import phase_out

router = APIRouter(prefix="/api/journey", tags=["journey"])


@router.get("")
def journey(session: Session = Depends(get_session), profile: str = "guest"):
    phases = session.exec(select(Phase).order_by(Phase.order)).all()
    steps = session.exec(select(Step).order_by(Step.order)).all()
    done = {p.step_id for p in session.exec(
        select(Progress).where(Progress.profile == profile, Progress.done == True)).all()}  # noqa: E712
    out = [phase_out(ph, [s for s in steps if s.phase_key == ph.key], done) for ph in phases]
    total = len(steps)
    return {"phases": out, "completed": len(done & {s.id for s in steps}), "total": total,
            "percent": round(100 * len(done) / total) if total else 0}


class ProgressIn(BaseModel):
    profile: str = "guest"
    step_id: int
    done: bool = True


@router.post("/progress")
def set_progress(body: ProgressIn, session: Session = Depends(get_session)):
    row = session.exec(select(Progress).where(
        Progress.profile == body.profile, Progress.step_id == body.step_id)).first()
    if row:
        row.done = body.done
        session.add(row)
    else:
        session.add(Progress(profile=body.profile, step_id=body.step_id, done=body.done))
    session.commit()
    return {"ok": True}
