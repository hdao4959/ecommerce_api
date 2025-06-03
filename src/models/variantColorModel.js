import { getDb } from "../config/mongodb.js";


const COLLECTION = 'variant_color';
const collection = () => getDb().collection(COLLECTION);
// const collection = () => getDb().collection(COLLECTION);

const insertMany = async (colors) => {
  return await collection().insertMany(colors)

}

const filter = async ({query= {}, projection= {}, limit = 0, sort = {}}) => {
  return await collection().find(query, {projection}).limit(limit).sort(sort).toArray()
}

export default {
  insertMany, filter
}