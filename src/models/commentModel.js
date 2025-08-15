import { getDb } from "../config/mongodb.js"

const COLLECTION = 'comments'
const collection = () => getDb().collection(COLLECTION)

const create = async (data, options = {}) => {
  if(!data) return 
  return await collection().insertOne(data, options);
}

const getAll = async ({conditions = {}, query, options = {}} = {} ) => {
  const sortObject = {
    [query?.sortBy || 'created_at']: query?.orderBy == "asc" ? 1 : -1
  }
  const limit = parseInt(query?.limit) || 10
  const skip = parseInt(query?.offset) || 0
  return await collection().find(conditions, options).sort(sortObject).skip(skip).limit(limit).toArray()
}

const join = async (stages = []) => {
  return await collection().aggregate(stages).toArray()
}
export default {
  create, getAll, join
}