import ProductsModel from "../models/productsModel.js"

const getAll  =  (req, res) => {
  res.json('get all products')
}

const create = async (req, res) => {
  try {
    
    await ProductsModel.create(req.body)
    res.json(req.body)
    
  } catch (error) {
    console.log(error);
    
  }
}



export default  {
  getAll, create
}