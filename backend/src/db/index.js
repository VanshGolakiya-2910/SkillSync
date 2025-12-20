import mongoose from "mongoose";

const connectDB = async() => {
    try{
        console.log("🔍 MONGO_URI from .env:", process.env.MONGO_URI);
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log("mongodb connected successfully : ", connectionInstance.connection.host) 
    }
    catch (err){
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}
export default  connectDB
