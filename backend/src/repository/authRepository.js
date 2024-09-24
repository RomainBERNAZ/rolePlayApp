import User from '../models/User.js';

export const findByUsername = async (username) => {
  return await User.findOne({ username });
};

export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

export const create = async (userData) => {
  const newUser = new User(userData);
  return await newUser.save();
};
