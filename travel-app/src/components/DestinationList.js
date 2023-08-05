import React from 'react';
import DestinationCard from './DestinationCard';
import '../DestinationList.css'; 

const DestinationList = ({ destinations, onAttractionClick }) => {
  return (
    <div className="destination-list">
      {destinations.map((destination, index) => (
        <DestinationCard
          key={index}
          destination={destination}
          onAttractionClick={onAttractionClick}
        />
      ))}
    </div>
  );
};

export default DestinationList;
