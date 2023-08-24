from fastapi import FastAPI
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("pkshatech/simcse-ja-bert-base-clcmlp", device="cpu")
app = FastAPI()


@app.get("/embedding")
def create_embedding(sentence: str):
    """文章を受け取り、ベクトル化した結果を返すAPI"""
    embeddings = model.encode(sentence)
    return {"sentence": sentence, "embedding": embeddings.tolist()}
