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
    updated_at: timestamp
  }, options);
}

const findOne = async ({ payload = {}, projection = {} } = {}) => {
  return await collection().findOne(payload, { projection });
}

const findOneAndUpdate = async (id, data) => {
  return await collection().findOneAndUpdate(
    { _id: ConvertToObjectId(id) },
    {
      $set: data
    },
  {
    returnDocument: 'after'
  })
}
export default {
  create, findOne, findOneAndUpdate
}