import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/ImageGallery.css';

// Helper function to truncate description
const truncateDescription = (description, maxWords) => {
  const words = description.split(' ');
  if (words.length > maxWords) {
    return words.slice(0, maxWords).join(' ') + '...';
  }
  return description;
};

const ImageGallery = ({ searchTerm }) => {
  const [images, setImages] = useState([]);

  const apiKey = 'A5E6QDbDgZa618PBobf7-ajYzGPwg8srq_28y91V60o';
  const searchUrl = `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${apiKey}`;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(searchUrl);
        if (response.data.results) {
          setImages(response.data.results);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [searchTerm, searchUrl]);

  return (
    <div>
      <h2>Images of {searchTerm}</h2>
      <div className="image-gallery">
        {images.map((image) => (
          <div key={image.id} className="image-container">
            <img src={image.urls.regular} alt={image.alt_description} />
            <p>{truncateDescription(image.description || image.alt_description, 10)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
