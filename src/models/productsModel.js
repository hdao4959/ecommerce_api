import { getDb } from "../config/mongodb.js"

const COLLECTION = 'products'

const getAll = async () => {
    await getDb().collection(COLLECTION).find({}).toArray();
}

const create = async (data) => {
  await getDb().collection(COLLECTION).insertOne(data)
}

export default {
  getAll, create
}