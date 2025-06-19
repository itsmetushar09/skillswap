from flask import Flask, render_template, request, redirect, session, flash
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # used to manage sessions

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Change this for production


import os
print("Using DB:", os.path.abspath('skillswap.db'))

# --- Database setup ---
def init_db():
    conn = sqlite3.connect('skillswap.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            skill TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# --- Routes ---
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])

        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        try:
            cursor.execute('INSERT INTO users_auth (username, password) VALUES (?, ?)', (username, password))
            conn.commit()
            flash("Signup successful. You can now login.", "success")
            return redirect('/login')
        except:
            flash("Username already exists!", "error")
        conn.close()
    return render_template('signup.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = sqlite3.connect('database.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, password FROM users_auth WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()

        if user and check_password_hash(user[1], password):
            session['user_id'] = user[0]
            session['username'] = username
            return redirect('/')
        else:
            flash("Invalid credentials", "error")
    return render_template('login.html')


@app.route('/submit', methods=['POST'])
def submit():
    name = request.form['name']
    skill = request.form['skill']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (name, skill) VALUES (?, ?)', (name, skill))
    conn.commit()
    conn.close()
    return redirect('/users')

@app.route('/users')
def users():
    skill_filter = request.args.get('skill')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    if skill_filter:
        cursor.execute('SELECT name, skill FROM users WHERE skill LIKE ?', ('%' + skill_filter + '%',))
    else:
        cursor.execute('SELECT name, skill FROM users')
    data = cursor.fetchall()
    conn.close()
    return render_template('users.html', users=data, skill_filter=skill_filter)

@app.route('/reset', methods=['POST'])
def reset():
    if not session.get('admin'):
        return redirect('/admin')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users')
    conn.commit()
    conn.close()
    return redirect('/users')

# --- Admin Authentication ---
@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username == 'admin' and password == 'admin123':  # replace with secure method in production
            session['admin'] = True
            return redirect('/users')
        else:
            return render_template('admin.html', error="Invalid credentials")
    return render_template('admin.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


if __name__ == '__main__':
    init_db()
    app.run(debug=True)
