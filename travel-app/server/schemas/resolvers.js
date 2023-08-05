const { Profile, Review, TravelDestination } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
const stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc'); // update?

const firstResolvers = {
  Query: {
  profiles: async () => {
    return Profile.find();
  },

  profile: async (parent, { profileId }) => {
    return Profile.findOne({ _id: profileId });
  },
  // By adding context to our query, we can retrieve the logged in user without specifically searching for them
  me: async (parent, args, context) => {
    if (context.user) {
      return Profile.findOne({ _id: context.user._id });
    }
    throw new AuthenticationError('You need to be logged in!');
  },
  travelDestinations: async() => {
    return TravelDestination.find();
  },
  travelDestination: async (parent, {destinationId}) => {
    return TravelDestination.findOne({_id: destinationId});
  },
},

Mutation: {
  addProfile: async (parent, { name, email, password }) => {
    const profile = await Profile.create({ name, email, password });
    const token = signToken(profile);

    return { token, profile };
  },
  login: async (parent, { email, password }) => {
    const profile = await Profile.findOne({ email });

    if (!profile) {
      throw new AuthenticationError('No profile with this email found!');
    }

    const correctPw = await profile.isCorrectPassword(password);

    if (!correctPw) {
      throw new AuthenticationError('Incorrect password!');
    }

    const token = signToken(profile);
    return { token, profile };
  },
  
  // Set up mutation so a logged in user can only remove their profile and no one else's
  removeProfile: async (parent, args, context) => {
    if (context.user) {
      return Profile.findOneAndDelete({ _id: context.user._id });
    }
    throw new AuthenticationError('You need to be logged in!');
  },

  addTravelDestination: async (parent, { name, description, location, images }) => {
    return TravelDestination.create({ name, description, location, images });
  },
  addReview: async (parent, { destinationId, travelerName, rating, comment }) => {
    // You may want to perform additional validation before adding a review.
    const destination = await TravelDestination.findById(destinationId);
    if (!destination) {
      throw new Error('Travel destination not found!');
    }
    
    const newReview = {
      travelerName,
      rating,
      comment,
    };
    
    destination.reviews.push(newReview);
    await destination.save();
    
    return destination;
  },
},
}
    
const secondResolvers  = {
  Query: {
    categories: async () => {
      return await Category.find();
    },
    products: async (parent, { category, name }) => {
      const params = {};

      if (category) {
        params.category = category;
      }

      if (name) {
        params.name = {
          $regex: name
        };
      }

      return await Product.find(params).populate('category');
    },
    product: async (parent, { _id }) => {
      return await Product.findById(_id).populate('category');
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        user.orders.sort((a, b) => b.purchaseDate - a.purchaseDate);

        return user;
      }

      throw new AuthenticationError('Not logged in');
    },
    order: async (parent, { _id }, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate({
          path: 'orders.products',
          populate: 'category'
        });

        return user.orders.id(_id);
      }

      throw new AuthenticationError('Not logged in');
    },
    checkout: async (parent, args, context) => {
      const url = new URL(context.headers.referer).origin;
      const order = new Order({ products: args.products });
      const line_items = [];

      const { products } = await order.populate('products');

      for (let i = 0; i < products.length; i++) {
        const product = await stripe.products.create({
          name: products[i].name,
          description: products[i].description,
          images: [`${url}/images/${products[i].image}`]
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: products[i].price * 100,
          currency: 'usd',
        });

        line_items.push({
          price: price.id,
          quantity: 1
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${url}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${url}/`
      });

      return { session: session.id };
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    addOrder: async (parent, { products }, context) => {
      console.log(context);
      if (context.user) {
        const order = new Order({ products });

        await User.findByIdAndUpdate(context.user._id, { $push: { orders: order } });

        return order;
      }

      throw new AuthenticationError('Not logged in');
    },
    updateUser: async (parent, args, context) => {
      if (context.user) {
        return await User.findByIdAndUpdate(context.user._id, args, { new: true });
      }

      throw new AuthenticationError('Not logged in');
    },
    updateProduct: async (parent, { _id, quantity }) => {
      const decrement = Math.abs(quantity) * -1;

      return await Product.findByIdAndUpdate(_id, { $inc: { quantity: decrement } }, { new: true });
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    }
  }
};
// Merge the two resolver objects
const resolvers = {
  Query: {
    ...firstResolvers.Query,
    ...secondResolvers.Query,
  },
  Mutation: {
    ...firstResolvers.Mutation,
    ...secondResolvers.Mutation,
  },
};
module.exports = resolvers;

