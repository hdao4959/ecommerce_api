import { ObjectId } from "mongodb"
import ErrorCustom from "./ErrorCustom.js"

export const ConvertToObjectId = (id) => {
  return ObjectId.isValid(id) ? new ObjectId(id) : (() => { throw new ErrorCustom("Id không hợp lệ")})()
}

