import sqlite3

def get_connection():
    conn = sqlite3.connect("manga.db")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS reading_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            current_chapter INTEGER NOT NULL,
            status TEXT NOT NULL,
            notes TEXT,
            last_read TEXT,
            created_at TEXT
        )
    """)
    conn.commit()
    conn.close()
