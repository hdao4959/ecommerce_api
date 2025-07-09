import variantColorModel from "../../models/variantColorModel.js"
import variantModel from "../../models/variantModel.js"
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import ErrorCustom from "../../utils/ErrorCustom.js";

const insertMany = async (idVariant, colors) => {
  idVariant = ConvertToObjectId(idVariant)
  const variant = await variantModel.findById(idVariant);
  if (!variant) {
    throw new ErrorCustom('Biến thể sản phẩm không tồn tại', 404)
  }
  const newArrayColor = colors.map(color => {
    const colorId = ConvertToObjectId(color._id);
    delete color._id
    return {
      ...color, 
      color_id: colorId,
      variant_id: idVariant
    }
  }
  )
  return variantColorModel.insertMany(newArrayColor)
}

export default {
  insertMany
}