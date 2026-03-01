from sqlalchemy import create_all, Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import datetime
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/cro_agent")

Base = declarative_base()

class Store(Base):
    __tablename__ = "stores"
    
    id = Column(Integer, primary_key=True, index=True)
    shop_url = Column(String, unique=True, index=True)
    access_token = Column(String)
    status = Column(String, default="active") # active, uninstalled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Audit(Base):
    __tablename__ = "audits"
    
    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(Integer)
    url = Column(String)
    report_data = Column(Text) # JSON string of analysis
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Engine setup (will use SQLite for local dev if Postgres URL not provided)
if DATABASE_URL.startswith("postgresql"):
    engine = create_engine(DATABASE_URL)
else:
    engine = create_engine("sqlite:///./sql_app.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
