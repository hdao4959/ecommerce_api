import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";

const COLLECTION = 'variant_color';
const collection = () => getDb().collection(COLLECTION);

const insertMany = async (colors, options = {}) => {
  return await collection().insertMany(colors, options)
}

const filter = async ({ filter = {}, limit = 0, sort = {}, options = {} }) => {
  return await collection().find(filter, options).limit(limit).sort(sort).toArray()
}

const findOne = async ({ payload = {}, projection = {} } = {}) => {
  if (payload?._id) {
    payload._id = ConvertToObjectId(payload._id);
  }
  return await collection().findOne(payload, { projection });
}

const deleteMany = async (conditions = {}, options = {}) => {
  if (!conditions) return null
  return await collection().deleteMany(conditions, options)
}

const join = async (stages) => {
  return await collection().aggregate(stages).toArray()
}

const insertAndUpdateMany = async (variantId, data) => {
  const operations = data.map(item => {
    const { color_id, variant_id, ...cloneItem } = item;
    return {
      updateOne: {
        filter: {
          variant_id: variantId,
          color_id: ConvertToObjectId(item.color_id)
        },
        update: {
          $set: cloneItem
        },
        upsert: true
      }
    }
  })

  if (!operations?.length) return
  return await collection().bulkWrite(operations)
}

export default {
  COLLECTION, insertMany, filter, findOne, deleteMany, join, insertAndUpdateMany
}