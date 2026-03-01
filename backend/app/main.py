import os
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
import httpx
from pydantic import BaseModel
from typing import Optional

from backend.app.audit import router as audit_router

app = FastAPI(title="CRO-Agent API")

# Include routers
app.include_router(audit_router)

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
    Exchange code for a permanent access token.
    """
    # TODO: Verify HMAC for security
    
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
        
        # TODO: Store access_token in database associated with the shop
        return {"status": "success", "shop": shop, "message": "Store connected successfully"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
