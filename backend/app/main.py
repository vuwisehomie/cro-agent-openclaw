from fastapi import FastAPI

app = FastAPI(title="CRO-Agent API")

@app.get("/")
async def root():
    return {"status": "online", "agent": "Sky", "project": "CRO-Agent"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
