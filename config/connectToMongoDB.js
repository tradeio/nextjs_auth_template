import mongoose from "mongoose";
import { MONGO_DB_CONNECTION_URI } from "./enums";
import "../backend/models/registerModels";

/**
 * @returns {Promise<mongoose.Connection>} 
 */
export default async function connectToMongoDB() {
  if(!mongoose.connection.readyState){
    //* .then() is used to force the function to wait for the promise to resolve
    await mongoose.connect(MONGO_DB_CONNECTION_URI).then(res => res);
    console.log("MongoDB connected");
  }
  return mongoose.connection;
}

/**
 * This is used for testing purposes.
 * (automated tests need to manually close the connection)
 */
export async function closeMongoDBConnection() {
  return mongoose.connection.close();
}