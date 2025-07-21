import { getDb } from "../config/mongodb.js";

const COLLECTION = 'specifications';
const collection = () => getDb().collection(COLLECTION);

const getAll = async ({ conditions = {}, query = {}, projection = {} }) => {
  const sortObject = {
    [query?.sortBy || 'created']: query?.orderBy == 'asc' ? 1 : -1
  }
  const limit = parseInt(query?.limit) || 10;
  const skip = parseInt(query?.offset) || 0;
  return collection().find(conditions, {projection}).sort(sortObject).skip(skip).limit(limit).toArray();
}
const create = async (data, options = {}) => {
  return collection().insertOne(data, options);
}

const findOne = async ({ payload = {}, projection = {} }) => {
  return collection().findOne(payload, { projection })
}

const countAll = async () => {
  return collection().countDocuments();
}

const countFiltered = async (conditions = {}) => {
  return collection().countDocuments(conditions)
}
export default {
  COLLECTION, create, findOne, getAll, countAll, countFiltered
}