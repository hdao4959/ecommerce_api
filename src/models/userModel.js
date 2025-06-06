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


export default {
  create, findOneBy
}