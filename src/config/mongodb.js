import { MongoClient } from "mongodb";
import env from "./env.js";

const client = new MongoClient(env.MONGODB_URI)

let db;

export const connectDb = async () => {
  try {
    await client.connect();
    db = client.db(env.DB_NAME);
    console.log('Connect Db thành công!!');
  } catch (error) {
    console.log('Connect db thất bại ', error);
  }
}

export const closeDb = async () => {
    try {
      await client.close()
      console.log('Đóng kết nối thành công!!!');
    } catch (error) {
      console.log('Đóng kết nối thất bại!!!', error);
    }
}

export const getDb = () => {
  if(!db) throw new Error("Phải kết nối với db trước")
  return db
}

