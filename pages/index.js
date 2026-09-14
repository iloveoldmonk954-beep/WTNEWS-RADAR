import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch news on load
    fetchNews()
  }, [])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/news')
      const data = await response.json()
      setNews(data)
    } catch (error) {
      console.error('Error fetching news:', error)
    }
    setLoading(false)
  }

  return (
    <div className="container">
      <Head>
        <title>WT NEWS RADAR</title>
        <meta name="description" content="Indian Defense News Aggregator" />
      </Head>

      <header className="header">
        <h1>🛰️ WT NEWS RADAR</h1>
        <p>Indian Defense News</p>
      </header>

      <main className="main">
        {loading ? (
          <div className="loading">Loading defense news...</div>
        ) : (
          <div className="news-grid">
            {news.map((item, index) => (
              <div key={index} className="news-card">
                <h2>{item.title}</h2>
                <p className="source">{item.source}</p>
                <p className="date">{new Date(item.date).toLocaleDateString()}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Read More →
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: #0a0e1a;
          color: #ffffff;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          text-align: center;
          padding: 40px 0;
          border-bottom: 2px solid #1e3a2e;
        }

        .header h1 {
          font-size: 2.5rem;
          margin: 0;
          color: #4ade80;
        }

        .header p {
          color: #94a3b8;
          margin-top: 10px;
        }

        .main {
          max-width: 1200px;
          margin: 40px auto;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #4ade80;
          font-size: 1.2rem;
        }

        .news-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .news-card {
          background: #1a1f2e;
          border: 1px solid #2d3748;
          border-radius: 8px;
          padding: 24px;
          transition: transform 0.2s, border-color 0.2s;
        }

        .news-card:hover {
          transform: translateY(-4px);
          border-color: #4ade80;
        }

        .news-card h2 {
          font-size: 1.25rem;
          margin: 0 0 12px 0;
          color: #ffffff;
          line-height: 1.4;
        }

        .source {
          color: #4ade80;
          font-weight: 600;
          margin: 8px 0;
          font-size: 0.9rem;
        }

        .date {
          color: #94a3b8;
          font-size: 0.85rem;
          margin: 4px 0 16px 0;
        }

        .news-card a {
          color: #4ade80;
          text-decoration: none;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .news-card a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr;
          }
          
          .header h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  )
}
