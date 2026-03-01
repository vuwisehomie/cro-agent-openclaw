import os
import httpx
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai

# Setup Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash-001')

router = APIRouter(prefix="/api/v1/audit", tags=["audit"])

class AuditResult(BaseModel):
    url: str
    performance_score: int
    seo_score: int
    accessibility_score: int
    conversion_issues: List[str]
    uplift_estimate: str
    ai_summary: str

@router.get("/scan", response_model=AuditResult)
async def scan_url(url: str = Query(..., description="The URL to audit")):
    """
    CUJ 2: Website CRO Audit
    Fetches HTML content and uses Gemini to analyze for conversion improvements.
    """
    if not url.startswith("http"):
        url = f"https://{url}"

    try:
        # 1. Fetch HTML
        async with httpx.AsyncClient(follow_redirects=True) as client:
            response = await client.get(url, timeout=10.0)
            html_content = response.text[:20000] # Cap content for LLM context
            
        # 2. Ask Gemini for Analysis
        prompt = f"""
        You are a world-class CRO (Conversion Rate Optimization) expert.
        Analyze the following HTML from a website and identify:
        1. Top 3 conversion friction points.
        2. Estimated conversion uplift if fixed.
        3. A short executive summary.
        
        Website HTML:
        {html_content}
        
        Return the result in strictly valid JSON format:
        {{
            "conversion_issues": ["issue 1", "issue 2", "issue 3"],
            "uplift_estimate": "X-Y%",
            "ai_summary": "summary text"
        }}
        """
        
        ai_response = model.generate_content(prompt)
        # Basic JSON cleaning in case of markdown blocks
        clean_text = ai_response.text.replace("```json", "").replace("```", "").strip()
        import json
        analysis = json.loads(clean_text)
        
        return {
            "url": url,
            "performance_score": 85, # Placeholder for PageSpeed integration
            "seo_score": 90,
            "accessibility_score": 80,
            "conversion_issues": analysis.get("conversion_issues", []),
            "uplift_estimate": analysis.get("uplift_estimate", "10-15%"),
            "ai_summary": analysis.get("ai_summary", "Analysis complete.")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audit failed: {str(e)}")
