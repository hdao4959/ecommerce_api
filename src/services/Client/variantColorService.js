import variantColorModel from "../../models/variantColorModel.js";

const filter = async ({filter = {}, projection = {}, limit = 0, sort = {}}) => {
  return await variantColorModel.filter({filter, projection, limit, sort})
}
export default {
  filter
}