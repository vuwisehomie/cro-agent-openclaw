from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import stripe

router = APIRouter(prefix="/api/v1/payments", tags=["payments"])

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class CheckoutSessionRequest(BaseModel):
    price_id: str # e.g., Starter or Growth price ID from Stripe
    success_url: str
    cancel_url: str

@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutSessionRequest):
    """
    MVP Payment Integration: Create a Stripe Checkout Session for plans.
    """
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{'price': request.price_id, 'quantity': 1}],
            mode='subscription',
            success_url=request.success_url,
            cancel_url=request.cancel_url,
        )
        return {"checkout_url": session.url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
