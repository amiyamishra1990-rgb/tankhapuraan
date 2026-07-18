import React, { useState, useEffect, useRef } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://tankhapuraan-backend-432180395696.asia-south1.run.app';

const NewsTicker = () => {
  const [items, setItems] = useState([]);
  const [paused, setPaused] = useState(false);
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;

    const load = () => {
      fetch(`${BACKEND_URL}/api/news`)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            setItems(data.items);
          }
        })
        .catch(() => { /* fail silently — ticker just stays hidden */ });
    };

    load();
    const interval = setInterval(load, 15 * 60 * 1000); // re-check every 15 min
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  // Duplicate the list so the CSS marquee loops seamlessly
  const loopItems = [...items, ...items];

  return (
    <div className="news-ticker" role="marquee" aria-label="Salary and labour law news updates">
      <div className="news-ticker-label">
        <i className="fas fa-bolt"></i> LIVE
      </div>
      <div className="news-ticker-track-wrap">
        <div
          className={`news-ticker-track${paused ? ' paused' : ''}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {loopItems.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-ticker-item"
            >
              <span className="news-ticker-source">{item.source}</span>
              <span className="news-ticker-title">{item.title}</span>
              <span className="news-ticker-dot">•</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
