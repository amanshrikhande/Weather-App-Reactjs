import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    };

    fetchSuggestions();
  }, [city, apiKey]);

  const fetchWeather = async (selectedCity) => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) throw new Error("City not found");

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCity(e.target.value);
  };

  const handleSuggestionClick = (selectedCity) => {
    setCity(selectedCity);
    setSuggestions([]);
    fetchWeather(selectedCity);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchWeather(city);
    }
  };

  return (
    < div className="app-container" >
      <h1 className="title">Weather Dashboard</h1>

      <div className="input-container">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input-box"
        />

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((item, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item.name)}
                className="suggestion-item"
              >
                {item.name}, {item.state ? item.state + ", " : ""}
                {item.country}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <div className="loader">Loading...</div>}
      {error && <p className="error">{error}</p>}

      {
        weather && (
          <div className="weather-box">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              className="weather-icon"
            />
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>
            <p>
              {weather.weather[0].main} - {weather.weather[0].description}
            </p>
            <p>Temperature: {weather.main.temp}°C</p>
            <p>Feels like: {weather.main.feels_like}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
          </div>
        )
      }
    </div >
  );
}

export default App;
