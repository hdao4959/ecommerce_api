import Category from "../models/category.model.js"
import categorySchema from "../validators.js/category.validate.js";

const getAll = async (req, res) => {
  try {
    const result = await Category.getAll();
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi xảy ra: '. error
    })
  }
}


const create = async (req, res) => {
  try {


    await Category.create(value)
    res.status(201).json({
      message: "Thêm danh mục thành công!!!"
    })
  } catch (error) {
    res.status(500).json({
      message: 'Có lỗi xảy ra: '. error
    })
  }
}

export default {
  create, getAll
}