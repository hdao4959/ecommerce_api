import dotenv from "dotenv";
dotenv.config();

const env = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_NAME: process.env.DB_NAME,
  BUILD_MODE: process.env.BUILD_MODE,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  TMN_CODE: process.env.TMN_CODE,
  SECRET_KEY: process.env.SECRET_KEY,
  VNP_URL: process.env.VNP_URL,
  VNP_RETURN_URL: process.env.VNP_RETURN_URL,
  JWT_SECRET: process.env.JWT_SECRET
}


export default env