import sqlite3

# Connect to (or create) the database
conn = sqlite3.connect('skillswap.db')
c = conn.cursor()

# Create the users_auth table
c.execute('''
CREATE TABLE IF NOT EXISTS users_auth (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    password TEXT NOT NULL
)
''')

conn.commit()
conn.close()

print("✅ users_auth table created successfully.")
