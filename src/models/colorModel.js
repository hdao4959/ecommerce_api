import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'colors';
const collection = () => getDb().collection(COLLECTION);

const getAll = async () => {
  return await collection().find({}).sort({ _id: -1 }).toArray();
}

const getAllActive = async ({ projection = {} }) => {
  return await collection().find({ is_active: true }, { projection }).sort({ _id: -1 }).toArray();
}

const create = async (data) => {
  data.variant_id &&= ConvertToObjectId(data.variant_id);
  return await collection().insertOne(data);
}

const filter = async ({filter = {}, projection = {}}) => {
  
  return await collection().find(filter, {projection}).toArray()
}
const findOneBy = async (payload) => {
  const query = { ...payload };
  if (query._id) {
    query._id = ConvertToObjectId(query._id);
  }
  return await collection().findOne(query);
}

const destroy = async (id) => {
  console.log(id);

  return await collection().deleteOne({ _id: ConvertToObjectId(id) });
}
export default {
  getAll, getAllActive, create, findOneBy, filter, destroy
}