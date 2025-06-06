import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  BUILD_MODE: process.env.BUILD_MODE,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
}


export default env