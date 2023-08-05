const { Schema, model } = require('mongoose');

const reviewSchema = new Schema({
    travelerName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  });
  
  const Review = model('Review', reviewSchema);
  
  module.exports = Review;
  