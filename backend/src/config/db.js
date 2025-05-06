const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
    console.log('Mongo URI:', process.env.MONGO_URI); // Debugging log to check URI | only for debugging
    if (!process.env.MONGO_URI) {
        console.error('Mongo URI is not defined!');
        process.exit(1);  // Exit the app if URI is missing
        throw new Error('MONGO_URI is not defined in .env file'); // Error message for debugging log
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err.message);
        console.error('MongoDB connection error:', err); // for debugging
        // console.error('MongoDB connection error:', err.message); // for debugging
        process.exit(1); // Exit the app with failure
    }
};
module.exports = connectDB;
