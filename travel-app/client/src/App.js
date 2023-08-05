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
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&appid=${apikey}&units=imperial`; 
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchTerm}&appid=${apikey}&units=imperial`;

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
    const forecastList = forecastData.list.slice(1, 4); 
    const forecastDestinations = forecastList.map((forecastItem, index) => {
      const forecastDate = new Date(forecastItem.dt_txt);
      const formattedDate = `Day ${index + 1}: ${forecastDate.toLocaleDateString('en-US')}`;
  
      return {
        name: weatherData.name,
        date: formattedDate, // Use the formatted date in the format "Day: Day 1: mm/dd/yyyy"
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
