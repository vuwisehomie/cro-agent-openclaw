import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
import httpx
from pydantic import BaseModel
from typing import Optional

from backend.app.audit import router as audit_router
from backend.app.agent import router as agent_router
from backend.app.models import init_db, SessionLocal, Store

app = FastAPI(title="CRO-Agent API")

# Initialize database on startup
@app.on_event("startup")
def on_startup():
    init_db()

# Include routers
app.include_router(audit_router)
app.include_router(agent_router)

# These will be loaded from .env
SHOPIFY_API_KEY = os.getenv("SHOPIFY_API_KEY")
SHOPIFY_API_SECRET = os.getenv("SHOPIFY_API_SECRET")
SHOPIFY_REDIRECT_URI = os.getenv("SHOPIFY_REDIRECT_URI", "http://localhost:8000/api/v1/auth/shopify/callback")
SCOPES = "read_products,read_orders,read_analytics"

@app.get("/")
async def root():
    return {"status": "online", "agent": "Sky", "project": "CRO-Agent"}

@app.get("/api/v1/auth/shopify/login")
async def shopify_login(shop: str = Query(..., description="The .myshopify.com URL of the store")):
    """
    Step 1: Redirect the user to Shopify's OAuth installation page.
    """
    if not shop.endswith(".myshopify.com"):
        shop = f"{shop}.myshopify.com"
        
    install_url = (
        f"https://{shop}/admin/oauth/authorize?"
        f"client_id={SHOPIFY_API_KEY}&"
        f"scope={SCOPES}&"
        f"redirect_uri={SHOPIFY_REDIRECT_URI}"
    )
    return RedirectResponse(install_url)

@app.get("/api/v1/auth/shopify/callback")
async def shopify_callback(shop: str, code: str, hmac: str):
    """
    Step 2: Shopify redirects back here with a temporary code.
    Exchange code for a permanent access token and save to DB.
    """
    token_url = f"https://{shop}/admin/oauth/access_token"
    payload = {
        "client_id": SHOPIFY_API_KEY,
        "client_secret": SHOPIFY_API_SECRET,
        "code": code
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to retrieve access token")
        
        data = response.json()
        access_token = data.get("access_token")
        
        # Save or Update Store in DB
        db = SessionLocal()
        store = db.query(Store).filter(Store.shop_url == shop).first()
        if not store:
            store = Store(shop_url=shop, access_token=access_token)
            db.add(store)
        else:
            store.access_token = access_token
        db.commit()
        db.close()
        
        return {"status": "success", "shop": shop, "message": "Store connected and token saved"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
