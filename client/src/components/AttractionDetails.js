import React from 'react';

const AttractionDetails = ({ attraction }) => {
  return (
    <div className="attraction-details">
      <h2>{attraction.name}</h2>
      <img src={attraction.image} alt={attraction.name} />
      <p>{attraction.description}</p>
      {/* Display other attraction details like ratings, reviews, etc. */}
    </div>
  );
};

export default AttractionDetails;
