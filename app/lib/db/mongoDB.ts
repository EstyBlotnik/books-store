import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI || "";
let isConnected: boolean = false;

const connect = async () => {
  if (isConnected) {
    console.log("already connected!");
    return;
  }
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env"
    );
  }
  console.log(MONGODB_URI);
  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = db.connection.readyState === 1;
    console.log("Mongodb connection successfull !!!");
  } catch (error) {
    throw new Error("Error in connecting to mongoDB." + error);
  }
};
export default connect;
