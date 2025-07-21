import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";


const COLLECTION = 'variant_color';
const collection = () => getDb().collection(COLLECTION);

const insertMany = async (colors, options = {}) => {
  return await collection().insertMany(colors, options)

}

const filter = async ({filter= {}, projection= {}, limit = 0, sort = {}}) => {
  return await collection().find(filter, {projection}).limit(limit).sort(sort).toArray()
}

const findOne = async ({payload = {}, projection = {}} = {}) => {
  
  if(payload?._id){
    payload._id = ConvertToObjectId(payload._id);
  }

  return await collection().findOne(payload, {projection});
}

const deleteMany = async(conditions = {}) => {
  if(!conditions) return null
  return await collection().deleteMany(conditions)
}

export default {
  COLLECTION, insertMany, filter, findOne, deleteMany
}