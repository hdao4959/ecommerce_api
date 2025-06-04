import variantModel from "../../models/variantModel.js";

const filter = async ({filter = {}, projection = {}}) => {
  return await variantModel.filter({filter, projection});
}



export default {
  filter
}