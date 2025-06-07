import productsModel from "../../models/productsModel.js";

const getAll = async ({query = {}, projection = {}}) => {
  return await productsModel.getAll({query, projection});
}

const findOneBy = async({payload = {}, projection = {}})=> {
  return await productsModel.findOneBy({payload, projection});
}

const filter = async ({filter = {}, projection = {}}) => {
  return await productsModel.filter({filter, projection})
}
export default {
  getAll, findOneBy, filter
}