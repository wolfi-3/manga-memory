from database import get_connection

conn = get_connection()
conn.execute(
    "INSERT INTO reading_items (title, current_chapter, status, notes, last_read, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    ("Solo Leveling", 187, "reading", "", "2026-08-11", "2026-08-11")
)
conn.commit()
conn.close()
print("Seeded.")
