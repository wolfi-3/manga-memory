from fastapi import FastAPI
from database import get_connection, init_db
from pydantic import BaseModel
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

@app.get("/reads")
def get_reads():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM reading_items").fetchall()
    conn.close()
    return [dict(row) for row in rows]

class ReadingItem(BaseModel):
    title: str
    current_chapter: int
    status: str
    notes: Optional[str] = None

@app.post("/reads")
def create_read(item: ReadingItem):
    conn = get_connection()
    conn.execute(
        "INSERT INTO reading_items (title, current_chapter, status, notes, last_read, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (item.title, item.current_chapter, item.status, item.notes, "", "")
    )
    conn.commit()
    conn.close()
    return {"message": "created"}

class ReadingItemUpdate(BaseModel):
    title: Optional[str] = None
    current_chapter: Optional[int] = None
    status: Optional[str] = None
    notes: Optional[str] = None

@app.put("/reads/{item_id}")
def update_read(item_id: int, item: ReadingItemUpdate):
    conn = get_connection()
    existing = conn.execute("SELECT * FROM reading_items WHERE id=?", (item_id,)).fetchone()

    if existing is None:
        conn.close()
        return {"error": "not found"}

    title = item.title if item.title is not None else existing["title"]
    current_chapter = item.current_chapter if item.current_chapter is not None else existing["current_chapter"]
    status = item.status if item.status is not None else existing["status"]
    notes = item.notes if item.notes is not None else existing["notes"]

    conn.execute(
        "UPDATE reading_items SET title=?, current_chapter=?, status=?, notes=? WHERE id=?",
        (title, current_chapter, status, notes, item_id)
    )
    conn.commit()
    conn.close()
    return {"message": "updated"}

@app.delete("/reads/{item_id}")
def delete_read(item_id: int):
    conn = get_connection()
    conn.execute("DELETE FROM reading_items WHERE id=?", (item_id,))
    conn.commit()
    conn.close()
    return {"message": "deleted"}
