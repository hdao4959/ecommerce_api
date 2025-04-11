import Category from "../models/category.model.js"

const getAll = async (req, res) => {
  try {
    const result = await Category.getAll();
    return res.json(result)
  } catch (error) {
    return res.status(500).json({
      message: 'Có lỗi xảy ra:',
      error: error.message || "Lỗi không xác định"
    })
  }
}


const create = async (req, res) => {
  try {
    const exist = await Category.findBy({'name': req?.body?.name})
    if(exist){
      return res.status(403).json({  message: "Tên danh mục đã tồn tại!!!" })
    }

    if(req.body.parent_id){
      const parent = await Category.findById(req.body.parent_id)
      if(!parent){
        return res.status(404).json({ message: "Danh mục cha không hợp lệ!!!"})
      }
    }

    await Category.create(req.body)
    return res.status(201).json({ message: "Thêm danh mục thành công!!!" })
   
  } catch (error) {
    return res.status(500).json({
      message: 'Có lỗi xảy ra',
      error: error.message || "Lỗi không xác định"
    })
  }
}

const update = async (req, res) => {
  try {
    
    const exist = await Category.findById(req.params.id);
    if(!exist){
      return res.status(404).json({ message: "Danh mục này không tồn tại!!!"})
    }
    await Category.updateById(req.params.id, req.body)

    return res.json({ message: "Cập nhật danh mục thành công!!!"})
  } catch (error) {
    return res.status(500).json({
      message: 'Có lỗi xảy ra',
      error: error.message || "Lỗi không xác định"
    })
  }
}

const destroy = async (req, res) =>{
  try {
    const categoryId = req.params.id;

    const deleted = await Category.deleteById(categoryId);
    if (!deleted) {
      return res.status(404).json({
        message: "Danh mục này không tồn tại"
      })
    }

    return res.status(200).json({
      message: "Xoá danh mục thành công!"
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Có lỗi xảy ra:',
      error: error.message || "Lỗi không xác định"
    })
  }
}

export default {
  getAll, create, update, destroy
} 