import variantColorModel from "../../models/variantColorModel.js";


const findOne = async ({payload, projection = {}} = {}) => {
  return variantColorModel.findOne({payload, projection});
}
export default {
  findOne
}