import mongoose from "mongoose";

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || '');
        console.log(`mongodb connected: ${conn.connection.host}`);
    } catch (error) {
      console.log('error connecting database', error);
      process.exit(1)
    }
};

export default connectdb;