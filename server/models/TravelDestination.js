const { Schema, model } = require('mongoose');

const travelDestinationSchema = new Schema({
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    reviews: [
      {
        travelerName: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
      },
    ],
    ratings: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      required: true,
    },
  });
  
  const TravelDestination = model('TravelDestination', travelDestinationSchema);
  
  module.exports = TravelDestination;
  