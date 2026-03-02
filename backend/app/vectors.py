import os
from qdrant_client import QdrantClient
from qdrant_client.http import models
from sentence_transformers import SentenceTransformer

class VectorStore:
    def __init__(self):
        self.client = QdrantClient(
            host=os.getenv("QDRANT_HOST", "localhost"),
            port=int(os.getenv("QDRANT_PORT", 6333))
        )
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.collection_name = "store_audits"
        self._ensure_collection()

    def _ensure_collection(self):
        collections = self.client.get_collections().collections
        exists = any(c.name == self.collection_name for c in collections)
        if not exists:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(size=384, distance=models.Distance.COSINE),
            )

    def add_audit(self, store_id: str, url: str, findings: list):
        text_content = f"Audit for {url}: " + " ".join(findings)
        vector = self.model.encode(text_content).tolist()
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=[
                models.PointStruct(
                    id=hash(url), # Simplified ID for MVP
                    vector=vector,
                    payload={"store_id": store_id, "url": url, "findings": findings}
                )
            ]
        )

    def search_context(self, store_id: str, query: str, limit: int = 3):
        vector = self.model.encode(query).tolist()
        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=vector,
            query_filter=models.Filter(
                must=[models.FieldCondition(key="store_id", match=models.MatchValue(value=store_id))]
            ),
            limit=limit
        )
        return [r.payload for r in results]
