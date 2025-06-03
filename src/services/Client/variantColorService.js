import variantColorModel from "../../models/variantColorModel.js";

const filter = async ({query = {}, projection = {}, limit = 0, sort = {}}) => {
  
  return await variantColorModel.filter({query, projection, limit, sort})
}
export default {
  filter
}