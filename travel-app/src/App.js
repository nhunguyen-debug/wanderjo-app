import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import DestinationList from './components/DestinationList';
import AttractionDetails from './components/AttractionDetails';
import ImageGallery from './components/ImageGallery'; // Import the ImageGallery component
import './App.css';

const App = () => {
  const [destinations, setDestinations] = useState([]);
  const [selectedAttraction, setSelectedAttraction] = useState(null);

  const handleSearch = async (searchTerm) => {
    try {
      const apikey = 'ea081e7c8189b40b973d3d4c71f263d0';
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apikey}`;
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${apikey}`;

      const [weatherResponse, forecastResponse] = await Promise.all([
        fetch(weatherUrl),
        fetch(forecastUrl)
      ]);

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Unable to fetch weather data');
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();

      // Update destinations state with the fetched data
      const newDestinations = processWeatherAndForecastData(weatherData, forecastData);
      setDestinations(newDestinations);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAttractionClick = (attraction) => {
    setSelectedAttraction(attraction);
  };

  const handleAttractionClose = () => {
    setSelectedAttraction(null);
  };

  const processWeatherAndForecastData = (weatherData, forecastData) => {
    // Extract relevant information from weatherData
    const { name, main, weather } = weatherData;
    const { temp } = main;
    const description = weather[0].description;
  
    // Extract relevant information from forecastData
    const forecastList = forecastData.list.slice(1, 4); // Get the next 3-day forecast
    const forecastDestinations = forecastList.map((forecastItem, index) => {
      const dayNumber = index + 1; // Calculate the day number (Day 1, Day 2, etc.)
  
      return {
        name: weatherData.name,
        date: `Day ${dayNumber}`, // Use the day number in the date field
        temperature: forecastItem.main.temp,
        description: forecastItem.weather[0].description,
      };
    });
  
    // Create the newDestinations array with both current weather and forecast destinations
    const newDestinations = [
      {
        name,
        date: 'Today',
        temperature: temp,
        description,
      },
      ...forecastDestinations,
    ];
  
    return newDestinations;
  };

  return (
    <div className="app">
      <Header />
      <SearchBar onSearch={handleSearch} />
      {selectedAttraction ? (
        <AttractionDetails attraction={selectedAttraction} onClose={handleAttractionClose} />
      ) : (
        <>
          <DestinationList destinations={destinations} onAttractionClick={handleAttractionClick} />
          <ImageGallery searchTerm={destinations.length > 0 ? destinations[0].name : ''} />
        </>
      )}
      <footer>
        This is Project 3 From Rice
      </footer>
    </div>
  );
};

export default App;
