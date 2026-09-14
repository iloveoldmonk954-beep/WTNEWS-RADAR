const Parser = require('rss-parser')
const parser = new Parser()

// Defense news sources
const SOURCES = [
  {
    name: 'Ministry of Defence',
    url: 'https://pib.gov.in/RssMain.aspx?ModId=7&Lang=1',
    tier: 1
  },
  {
    name: 'PIB Defence',
    url: 'https://pib.gov.in/RssMain.aspx?ModId=13&Lang=1',
    tier: 1
  },
  {
    name: 'Livefist Defence',
    url: 'https://www.livefistdefence.com/feed',
    tier: 3
  },
  {
    name: 'The Hindu',
    url: 'https://www.thehindu.com/news/national/feeder/default.rss',
    tier: 2
  }
]

// Defense keywords for filtering
const DEFENSE_KEYWORDS = [
  'DRDO', 'HAL', 'defence', 'defense', 'military', 'army', 'navy', 'air force',
  'missile', 'BrahMos', 'Rafale', 'Tejas', 'border', 'Pakistan', 'China',
  'LAC', 'procurement', 'Indian Army', 'Indian Navy', 'Indian Air Force'
]

// Check if article contains defense keywords
function hasDefenseKeywords(title, content) {
  const text = `${title} ${content}`.toLowerCase()
  return DEFENSE_KEYWORDS.some(keyword => 
    text.includes(keyword.toLowerCase())
  )
}

export default async function handler(req, res) {
  try {
    const allNews = []

    // Fetch from all sources
    for (const source of SOURCES) {
      try {
        const feed = await parser.parseURL(source.url)
        
        feed.items.forEach(item => {
          // Filter by keywords
          if (hasDefenseKeywords(item.title, item.contentSnippet || '')) {
            allNews.push({
              title: item.title,
              link: item.link,
              date: item.pubDate || item.isoDate,
              source: source.name,
              tier: source.tier,
              snippet: item.contentSnippet?.substring(0, 200) + '...' || ''
            })
          }
        })
      } catch (err) {
        console.error(`Error fetching ${source.name}:`, err.message)
      }
    }

    // Sort by date (newest first)
    allNews.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Return top 50
    res.status(200).json(allNews.slice(0, 50))
    
  } catch (error) {
    console.error('Error in news API:', error)
    res.status(500).json({ error: 'Failed to fetch news' })
  }
}
