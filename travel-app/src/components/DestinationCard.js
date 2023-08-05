import React from 'react';

const DestinationCard = ({ destination }) => {
  const { name, date, temperature, description } = destination;

  return (
    <div className="destination-card">
      <h2>{name}</h2>
      <p>Date: {date}</p>
      <p>Temperature: {temperature}</p>
      <p>Description: {description}</p>
    </div>
  );
};

export default DestinationCard;
