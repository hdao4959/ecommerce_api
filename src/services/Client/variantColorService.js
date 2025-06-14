import variantColorModel from "../../models/variantColorModel.js";

const filter = async ({filter = {}, projection = {}, limit = 0, sort = {}}) => {
  return await variantColorModel.filter({filter, projection, limit, sort})
}

const findOne = async ({payload, projection = {}} = {}) => {
  
  return variantColorModel.findOne({payload, projection});
}
export default {
  filter, findOne
}