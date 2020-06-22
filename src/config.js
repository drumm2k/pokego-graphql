import mongoose from 'mongoose';
require('dotenv').config();

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log(`Connected to mongo at ${process.env.MONGO_URI}`))
  .catch((err) => {
    console.log(`DB Connection Error: ${err.message}`);
  });
