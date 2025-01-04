const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,    // This option is often used to remove deprecation warnings
            useFindAndModify: false  // This removes another deprecation warning
        });
        console.log('MongoDB connection SUCCESS');
    } catch (err) {
        console.error('MongoDB connection ERROR:', err);
        process.exit(1);
    }
};

module.exports = connectDB;