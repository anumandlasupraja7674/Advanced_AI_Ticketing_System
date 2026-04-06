from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
from models import Base, Employee, Ticket
from typing import List
import openai
import json

load_dotenv()
app = FastAPI(title="🚀 AI Ticketing System")

# Database
engine = create_engine("sqlite:///./ticketing.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

openai.api_key = os.getenv("OPENAI_API_KEY")

@app.on_event("startup")
async def startup():
    db = next(get_db())
    if not db.query(Employee).first():
        employees = [
            Employee(name="John DevOps", email="john@eng.com", department="Engineering", role="DevOps", skills='["Server","DB"]'),
            Employee(name="Jane Finance", email="jane@fin.com", department="Finance", role="Accountant", skills='["Billing"]'),
            Employee(name="Mike HR", email="mike@hr.com", department="HR", role="Manager", skills='["Leave"]'),
            Employee(name="Sarah IT", email="sarah@it.com", department="IT", role="Admin", skills='["Access"]'),
        ]
        db.add_all(employees)
        db.commit()

class TicketCreate:
    def __init__(self, title: str, description: str):
        self.title = title
        self.description = description

@app.post("/tickets/")
async def create_ticket(title: str, description: str, db: Session = Depends(get_db)):
    # AI Analysis
    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{
            "role": "user", 
            "content": f"""Analyze ticket: "{description}"

Return ONLY JSON:
{{
"category": "Bug|Billing|HR|Access|Server|Other",
"summary": "2 sentences",
"severity": "Critical|High|Medium|Low", 
"auto_resolve": true/false,
"department": "Engineering|Finance|HR|IT"
}}"""
        }],
        temperature=0.1
    )
    
    ai_result = json.loads(response.choices[0].message.content)
    
    # Create ticket
    ticket = Ticket(
        title=title, description=description,
        category=ai_result.get("category", "Other"),
        ai_summary=ai_result.get("summary", ""),
        severity=ai_result.get("severity", "Medium"),
        department=ai_result.get("department"),
        auto_resolved=ai_result.get("auto_resolve", False),
        status="Resolved" if ai_result.get("auto_resolve") else "New"
    )
    
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return {"id": ticket.id, "ai_analysis": ai_result, "status": ticket.status}

@app.get("/tickets")
async def get_tickets(db: Session = Depends(get_db)):
    return db.query(Ticket).order_by(Ticket.id.desc()).all()

@app.get("/employees")
async def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)