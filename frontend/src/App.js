// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function App() {
  const [stock, setStock] = useState(null);
  const [news, setNews] = useState([]);

  // Fetch stock data (e.g., Apple)
  useEffect(() => {
    axios.get('http://localhost:5000/api/stock/AAPL')
      .then(res => {
        const results = res.data.results;
        setStock(results);
      });
  }, []);

  // Fetch news
  useEffect(() => {
    axios.get('http://localhost:5000/api/news?query=stocks')
      .then(res => {
        setNews(res.data.articles.slice(0, 5)); // Show top 5 news
      });
  }, []);

  // Chart data
  const chartData = {
    labels: stock?.map(entry => new Date(entry.t).toLocaleDateString()),
    datasets: [{
      label: 'AAPL Stock Price',
      data: stock?.map(entry => entry.c), // Closing price
      borderColor: 'green',
    }]
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Stock Dashboard</h1>
      
      {/* Stock Chart */}
      {stock && <Line data={chartData} />}

      {/* News Section */}
      <h2>Latest News</h2>
      {news.map((article, index) => (
        <div key={index} style={{ margin: '10px 0', padding: 10, border: '1px solid #ddd' }}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <h3>{article.title}</h3>
          </a>
          <p>{article.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;

// Add to your React component
const [sentiment, setSentiment] = useState(null);

// Analyze headline sentiment
const analyzeSentiment = async (headline) => {
  const res = await axios.get(`http://localhost:5000/api/sentiment?text=${encodeURIComponent(headline)}`);
  setSentiment(res.data[0]);
};

// Use in news section:
{news.map((article, index) => (
  <div key={index}>
    <h3>{article.title}</h3>
    <button onClick={() => analyzeSentiment(article.title)}>
      Analyze Sentiment
    </button>
    {sentiment && (
      <p>Sentiment: {sentiment.label} ({Math.round(sentiment.score * 100)}%)</p>
    )}
  </div>
))}