import productsModel from "../../models/productsModel.js";

const getAll = async ({query = {}, projection = {}}) => {
  return await productsModel.getAll({query, projection});
}

export default {
  getAll
}