import Category from "../models/categoryModel.js"

const getAll = async () => {
  return await Category.getAll();
}

const create = async (data) => {
  console.log(data);
  
  const exist = await Category.findBy({name: data?.name});
  if(exist){
    throw new Error('Tên danh mục đã tồn tại!')
  }

  if(data.parent_id){
    const existParentCategory  = await Category.findById(data.parent_id);
    if(!existParentCategory){
      throw new Error('Danh mục cha không tồn tại!')
    }
  }

  return await Category.create(data);
}

const update = async(id, data) => {
  const exist = await Category.findById(id);
  if(!exist){
    throw new Error('Danh mục này không tồn tại!')
  }
  const existName = await Category.findBy({name: data?.name, _id: {
    $ne: id
  }})

  if(existName){
    throw new Error('Tên danh mục này đã tồn tại!')
  }

  if(data?.parent_id){
    const existParentCategory = await Category.findBy({parent_id: id});
    if(!existParentCategory){
      throw new Error('Danh mục cha không tồn tại!')
    }
  }
  return await Category.updateById(id, data);
}


const destroy = async (id) => {
  const exist = await Category.findById(id);
  if(!exist){
    throw new Error('Danh mục này không tồn tại!');
  }
  return await Category.deleteById(id);
}

export default {
  getAll,
  create,
  update, 
  destroy
}