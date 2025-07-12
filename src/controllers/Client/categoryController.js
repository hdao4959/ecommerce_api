import categoryService from "../../services/Client/categoryService.js"
import { errorResponse, successResponse } from "../../utils/response.js";
const getAllActive = async (req, res, next) => {
  try {
   const result = await categoryService.getAllActive();
    return successResponse(res, {
      data: {
        ... result
      }
    })
  } catch (error) {
    next(error)
  }
}

const getProductsOfCategory = async (req, res, next) =>{
  try {
    const id = req.params?.id;
    const products = await categoryService.getProductsOfCategory(id, req.query)
    return successResponse(res, {
      data: {
        ...products
      }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getAllActive, getProductsOfCategory
}