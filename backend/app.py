# backend/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()  # Load environment variables

app = Flask(__name__)
CORS(app)  # Allow frontend requests

# Polygon.io API Helper
def fetch_polygon_data(symbol):
    api_key = os.getenv("POLYGON_API_KEY")
    url = f"https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/2023-01-01/2023-12-31?apiKey={api_key}"
    response = requests.get(url)
    return response.json()

# NewsAPI Helper
def fetch_news(query):
    api_key = os.getenv("NEWS_API_KEY")
    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={api_key}"
    response = requests.get(url)
    return response.json()

# Routes
@app.route('/api/stock/<symbol>')
def get_stock(symbol):
    data = fetch_polygon_data(symbol)
    return jsonify(data)

@app.route('/api/news')
def get_news():
    query = request.args.get('query', 'stock market')
    news = fetch_news(query)
    return jsonify(news)

if __name__ == '__main__':
    app.run(debug=True)

    # Add to backend/app.py
from transformers import pipeline

sentiment_pipeline = pipeline('sentiment-analysis')

@app.route('/api/sentiment')
def analyze_sentiment():
    text = request.args.get('text')
    if not text:
        return jsonify({"error": "Missing text parameter"}), 400
    result = sentiment_pipeline(text)
    return jsonify(result)