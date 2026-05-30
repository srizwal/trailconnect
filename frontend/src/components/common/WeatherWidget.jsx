import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Droplets } from 'lucide-react';

// Mock weather data (replace with OpenWeatherMap API in production)
const MOCK_WEATHER = {
  temp: 12,
  feelsLike: 8,
  humidity: 65,
  windSpeed: 18,
  condition: 'Partly Cloudy',
  icon: 'cloud',
  forecast: [
    { day: 'Today', icon: 'cloud', high: 14, low: 6 },
    { day: 'Tomorrow', icon: 'sun', high: 18, low: 8 },
    { day: 'Day 3', icon: 'rain', high: 10, low: 4 },
    { day: 'Day 4', icon: 'sun', high: 20, low: 9 },
    { day: 'Day 5', icon: 'cloud', high: 15, low: 7 },
  ],
};

const WeatherIcon = ({ icon, size = 20 }) => {
  const props = { size, color: icon === 'sun' ? '#f59e0b' : icon === 'rain' ? '#60a5fa' : '#94a3b8' };
  if (icon === 'sun') return <Sun {...props} />;
  if (icon === 'rain') return <CloudRain {...props} />;
  return <Cloud {...props} />;
};

export default function WeatherWidget({ location = 'Trek Location' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call — replace with:
    // fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`)
    setTimeout(() => {
      setWeather({ ...MOCK_WEATHER, temp: Math.round(8 + Math.random() * 12) });
      setLoading(false);
    }, 800);
  }, [location]);

  if (loading) return <div className="skeleton" style={{ height: 120, borderRadius: 12 }} />;

  return (
    <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1a4a35 100%)', borderRadius: 12, padding: '1.25rem', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.78rem', opacity: 0.7, marginBottom: 2 }}>📍 {location}</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'Syne' }}>{weather.temp}°</span>
            <span style={{ opacity: 0.7, fontSize: '0.88rem' }}>C</span>
          </div>
          <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{weather.condition}</p>
        </div>
        <WeatherIcon icon={weather.icon} size={48} />
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', opacity: 0.8 }}>
          <Thermometer size={14} /> Feels {weather.feelsLike}°
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', opacity: 0.8 }}>
          <Droplets size={14} /> {weather.humidity}%
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', opacity: 0.8 }}>
          <Wind size={14} /> {weather.windSpeed} km/h
        </div>
      </div>

      <div style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '0.75rem' }}>
        {weather.forecast.map((f, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 4px' }}>
            <p style={{ fontSize: '0.68rem', opacity: 0.6, marginBottom: 4 }}>{f.day}</p>
            <WeatherIcon icon={f.icon} size={16} />
            <p style={{ fontSize: '0.72rem', marginTop: 3 }}>{f.high}° <span style={{ opacity: 0.5 }}>{f.low}°</span></p>
          </div>
        ))}
      </div>
    </div>
  );
}
