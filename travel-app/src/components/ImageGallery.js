import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageGallery = ({ searchTerm }) => {
  const [images, setImages] = useState([]);

  const apiKey = 'A5E6QDbDgZa618PBobf7-ajYzGPwg8srq_28y91V60o';
  const searchUrl = `https://api.unsplash.com/search/photos?query=${searchTerm}&client_id=${apiKey}`;

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

  useEffect(() => {
    fetchImages();
  }, [searchTerm]);

  return (
    <div>
      <h2>Images of {searchTerm}</h2>
      <div className="image-gallery">
        {images.map((image) => (
          <img key={image.id} src={image.urls.regular} alt={image.alt_description} />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
