import { getDb } from "../config/mongodb.js"

const COLLECTION = 'transactions'
const collection = () => getDb().collection(COLLECTION)

const create = async (data, options = {}) => {
  return await collection().insertOne(data, options);
}

const findOne = async({payload = {}, projection = {}}) => {
  return await collection().findOne(payload, {projection});
}

export default {
  create, findOne
}