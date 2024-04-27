const mongoose = require('mongoose');
require('dotenv').config()
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      // dbConnection = conn.connection.db
      // console.log(dbConnection)
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  };
  
  module.exports = connectDB