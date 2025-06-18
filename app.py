from flask import Flask, render_template, request, redirect, session, url_for
import sqlite3

app = Flask(__name__)
app.secret_key = 'supersecretkey'  # Change this for production

# --- Database setup ---
def init_db():
    conn = sqlite3.connect('database.db')
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
    session.pop('admin', None)
    return redirect('/')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
