from fastapi import APIRouter, HTTPException, Body
from pydantic import BaseModel
import os
import google.generativeai as genai

router = APIRouter(prefix="/api/v1/agent", tags=["agent"])

# Initialize Gemini for the Agent
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash-001')

class ChatRequest(BaseModel):
    message: str
    store_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str]

@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    CUJ 4: AI Marketing Agent
    Provides strategic advice and data Q&A.
    """
    # System prompt to define the Agent's persona
    system_prompt = """
    You are the CRO-Agent AI Strategist. Your goal is to help store owners increase their conversion rate.
    You have access to store metrics (CVR, AOV, Revenue) and CRO audit findings.
    Be concise, data-driven, and proactive. If a metric is down, suggest a specific fix.
    """
    
    # In Phase 2, we will pull real data from BigQuery here.
    # For now, we simulate a conversation about the store's current performance.
    
    full_prompt = f"{system_prompt}\n\nUser: {request.message}"
    
    try:
        response = model.generate_content(full_prompt)
        
        return {
            "reply": response.text,
            "suggested_actions": [
                "Run a new website audit",
                "Review high drop-off funnel stages",
                "Set a monthly CVR goal"
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
