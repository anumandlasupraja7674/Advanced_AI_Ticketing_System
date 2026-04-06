from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    department = Column(String(50))
    role = Column(String(100))
    skills = Column(Text)
    avg_resolution_time = Column(Float, default=0.0)
    current_load = Column(Integer, default=0)
    availability = Column(String(20), default="Available")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True)
    title = Column(String(200))
    description = Column(Text)
    category = Column(String(50))
    ai_summary = Column(Text)
    severity = Column(String(20))
    sentiment = Column(String(20))
    confidence = Column(Float)
    estimated_resolution_time = Column(Float)
    status = Column(String(30), default="New")
    auto_resolved = Column(Boolean, default=False)
    department = Column(String(50))
    assigned_to_id = Column(Integer, ForeignKey("employees.id"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now())