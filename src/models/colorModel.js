import { getDb } from "../config/mongodb.js";

const COLLECTION = 'colors';
const collection = () => getDb().collection(COLLECTION);

const getAll = async () => {
  return await collection().find({}).toArray();
}
const create = async (data) => {
  return await collection().insertOne(data);
}

const findOneBy = async (payload) => {
  return await collection().findOne(payload);
}

export default {
  getAll, create, findOneBy
}