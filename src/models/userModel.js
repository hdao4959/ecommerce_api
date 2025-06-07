import { getDb } from "../config/mongodb.js"
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'users'
const collection = () => getDb().collection(COLLECTION);

const create = async (data) => {
  return await collection().insertOne(data);
}

const findOneBy = async ({payload = {}, projection = {}} = {}) => {
  if(payload.id){
    payload.id = ConvertToObjectId(payload.id);
  }
  return await collection().findOne(payload, {projection});
}

const update = async(id, data, options = {}) => {
  id = ConvertToObjectId(id);
  return await collection().updateOne({_id: id}, {$set: data}, options)
}


export default {
  create, findOneBy , update
}