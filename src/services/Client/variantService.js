import variantModel from "../../models/variantModel.js";

const filter = async (filter) => {
  return await variantModel.filter(filter);
}

export default {
  filter
}