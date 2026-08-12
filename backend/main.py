from fastapi import FastAPI
from database import get_connection, init_db
from pydantic import BaseModel
from typing import Optional

app = FastAPI()

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

@app.put("/reads/{item_id}")
def update_read(item_id: int, item: ReadingItem):
    conn = get_connection()
    conn.execute(
        "UPDATE reading_items SET title=?, current_chapter=?, status=?, notes=? WHERE id=?",
        (item.title, item.current_chapter, item.status, item.notes, item_id)
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
