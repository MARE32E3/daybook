from flask import Flask, render_template, jsonify
import json
import datetime
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/book')
def book_of_the_day():
    today = datetime.date.today().isoformat()
    # Store the last served date and book in a file
    state_file = 'state.json'
    if os.path.exists(state_file):
        with open(state_file, encoding='utf-8') as f:
            state = json.load(f)
    else:
        state = {}

    # If already served today, return the same book
    if state.get('date') == today and 'book' in state:
        return jsonify(state['book'])

    # Otherwise, pop the first book and update files
    with open('books.json', encoding='utf-8') as f:
        books = json.load(f)
    if not books:
        return jsonify({"title": "No more books!", "description": "Please add more books to books.json."})

    book = books.pop(0)
    # Save the updated books.json
    with open('books.json', 'w', encoding='utf-8') as f:
        json.dump(books, f, ensure_ascii=False, indent=2)
    # Append to pastbooks.json
    pastbooks = []
    if os.path.exists('pastbooks.json'):
        with open('pastbooks.json', encoding='utf-8') as f:
            pastbooks = json.load(f)
    pastbooks.append(book)
    with open('pastbooks.json', 'w', encoding='utf-8') as f:
        json.dump(pastbooks, f, ensure_ascii=False, indent=2)
    # Save state
    state = {'date': today, 'book': book}
    with open(state_file, 'w', encoding='utf-8') as f:
        json.dump(state, f, ensure_ascii=False, indent=2)
    return jsonify(book)

@app.route('/pastbooks')
def past_books():
    if os.path.exists('pastbooks.json'):
        with open('pastbooks.json', encoding='utf-8') as f:
            books = json.load(f)
    else:
        books = []
    return render_template('pastbooks.html', books=books)

if __name__ == '__main__':
    app.run(debug=True)