import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'variant_specification';
const collection = () => getDb().collection(COLLECTION);

const insertMany = async (data, options = {}) => {
  return await collection().insertMany(data, options)
}

const deleteMany = async (conditions, options = {}) => {
  return await collection().deleteMany(conditions, options)
}

const filter = async (filter, options = {}) => {
  return await collection().find(filter, options).toArray()
}

const join = async (stages) => {
  return await collection().aggregate(stages).toArray();
}

const insertAndUpdateMany = async (idVariant, data) => {

  const operations = data.map(item => {
    const {_id, ...cloneItem} = item
    return {
    updateOne: {
      filter: {
        variant_id: idVariant,
        specification_id: _id
      },
      update: {
        $set: cloneItem
      }, 
      upsert: true
    }
  }
  })
  if(!operations?.length) return 
  return collection().bulkWrite(operations);
}

export default {
  COLLECTION,
  insertMany,
  deleteMany,
  filter,
  join,
  insertAndUpdateMany
}