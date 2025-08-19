import productsModel from "../../models/productsModel.js";
import wishlistModel from "../../models/wishlistModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";

const create = async (user, data) => {
  const product_id = ConvertToObjectId(data.productId)
  const products = await productsModel.countFiltered({
    _id: product_id
  })

  if (products === 0) throw new ErrorCustom('Sản phẩm không tồn tại!')
  const user_id = ConvertToObjectId(user.id)

  const existProductInWishlist = await wishlistModel.findOne({
    product_id,
    user_id
  })

  if (existProductInWishlist) {
    await wishlistModel.destroy({
      user_id, product_id
    })
    return {
      message: 'Đã xoá sản phẩm khỏi danh sách yêu thích!',
      action: "removed"
    }
  } else {
    await wishlistModel.create({
      user_id, product_id,
      created_at: Date.now(),
      updated_at: null,
      delete_at: null
    });
    return {
      message: 'Đã thêm sản phẩm vào danh sách yêu thích!',
      action: "added"
    }
  }

}
export default {
  create
}