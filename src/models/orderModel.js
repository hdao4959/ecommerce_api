import { getDb } from "../config/mongodb.js";
import { ConvertToObjectId } from "../utils/ConvertToObjectId.js";
export const paymentStatus = {
  PENDING: 'pending', // Chưa thanh toán (mới tạo đơn hàng)
  SUCCESS: 'success', // Thanh toán thành công
  FAILED: 'failed', // Thanh toán thất bại
  CANCELED: 'canceled', // Người dùng hủy thanh toán
  EXPIRED: 'expired' //	Quá thời gian nhưng chưa thanh toán
}

export const orderStatus = {
  PENDING: 'pending', //Đơn hàng mới tạo, chưa xử lí,
  CONFIRMED: 'confirmed', //Đã xác nhận đơn (thường sau khi thanh toán thành công hoặc admin duyệt)
  PROCESSING: 'processing', // Đang xử lí, chuẩn bị hàng
  SHIPPING: 'shipping', // Đang giao hàng
  COMPLETED: 'completed', // Giao thành công
  CANCELED: 'canceled', // Đơn hàng bị huỷ (do User hoặc Admin)
  RETURNED: 'returned', // Đơn hàng bị trả lại
}
const COLLECTION = 'orders';
const collection = () => getDb().collection(COLLECTION);

const create = async (data, options = {}) => {
  const timestamp = Date.now();
  return await collection().insertOne({
    ...data,
    status: orderStatus.PENDING,
    payment_status: paymentStatus.PENDING,
    created_at: timestamp,
    updated_at: null
  }, options);
}

const getAll = async ({ conditions = {}, query = {}, projection = {} }) => {
  const sortObject = {}
  sortObject[query?.sortBy || 'created_at'] = query?.orderBy === 'asc' ? 1 : -1
  const limit = parseInt(query?.limit) || 10
  const skip = parseInt(query?.offset) || 0;
  return await collection().find(conditions, { projection }).sort(sortObject).skip(skip).limit(limit).toArray();
}

const findOne = async ({ payload = {}, projection = {} } = {}) => {
  if (payload._id) {
    payload._id = ConvertToObjectId(payload._id);
  }
  return await collection().findOne(payload, { projection });
}


const update = async (conditions, data, options = {}) => {
  return await collection().updateOne(
    conditions,
    {
      $set: data
    },
    options)
}

const findOneAndUpdate = async (conditions, data, options = {}) => {
  return await collection().findOneAndUpdate(
    conditions,
    {
      $set: data
    },
    {
      returnDocument: 'after'
    },
    options)
}

const countAll = () => {
  return collection().countDocuments();
}

const countFiltered = (condition = {}) => {
  return collection().countDocuments(condition)
}
export default {
  create, getAll, findOne, findOneAndUpdate, countAll, countFiltered, update
}