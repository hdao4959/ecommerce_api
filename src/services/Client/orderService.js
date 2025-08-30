import env from "../../config/env.js";
import colorModel from "../../models/colorModel.js";
import notificationModel, { NOTIFICATION_REFERENCE_TYPE, NOTIFICATION_TYPE } from "../../models/notificationModel.js";
import orderItemModel from "../../models/orderItemModel.js";
import orderModel, { orderStatus, paymentStatus } from "../../models/orderModel.js";
import productsModel from "../../models/productsModel.js";
import transactionModel from "../../models/transactionModel.js";
import userModel from "../../models/userModel.js";
import variantColorModel from "../../models/variantColorModel.js";
import variantModel from "../../models/variantModel.js";
import { io, onlineUsers } from "../../server.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import sortObject from "../../utils/sortObject.js";
import dateFormat from 'dateformat'
import querystring from 'qs'
import crypto, { sign } from 'crypto'
import { formatPrice } from "../../utils/formatPrice.js";
import { client } from "../../config/mongodb.js";

const create = async (data) => {
  return await orderModel.create(data);
}

const findOne = async ({ payload = {}, projection = {} }) => {
  return await orderModel.findOne({ payload }, { projection });
}

const findOneAndUpdate = async (id, data) => {
  return await orderModel.findOneAndUpdate(id, data);
}

const checkoutPage = async (req) => {
  const { cart } = req.body;
  const newCart = JSON.parse(cart);

  // Mảng các id của item cart
  const seenCartItemIds = new Set();
  // Mảng các id của item cart đã được convert sang object id
  const cartItemIds = [];
  newCart.forEach(item => {
    if (!seenCartItemIds.has(item._id.toString())) {
      seenCartItemIds.add(item._id.toString());
      cartItemIds.push(ConvertToObjectId(item._id))
    }
  })

  // Tìm các biến thể sản phẩm từ cartItemIds;
  const variantColor = await variantColorModel.filter({
    filter: {
      _id: { $in: cartItemIds }
    }
  });

  const seenColorIds = new Set();
  const colorIds = [];
  variantColor.forEach(varColor => {
    const colorIdString = varColor.color_id.toString();
    if (!seenColorIds.has(colorIdString)) {
      seenColorIds.add(colorIdString);
      colorIds.push(ConvertToObjectId(varColor.color_id));
    }
  })

  const colors = await colorModel.filter({
    filter: {
      _id: { $in: colorIds }
    }, projection: {
      created_at: 0, updated_at: 0, deleted_at: 0, status: 0, is_active: 0
    }
  })

  const colorMap = colors.reduce((acc, color) => {
    acc[color._id.toString()] = color
    return acc
  }, {})

  const seenVariantIds = new Set();
  const variantIds = [];
  variantColor.forEach(varColor => {
    const variantIdString = varColor.variant_id.toString()
    if (!seenVariantIds.has(variantIdString)) {
      seenVariantIds.add(variantIdString)
      variantIds.push(varColor.variant_id)
    }
  })
  const variants = await variantModel.filter({
    filter: {
      _id: { $in: variantIds }
    }
  })

  const seenProductIds = new Set();
  const productIds = [];
  variants.forEach(variant => {
    const productIdString = variant.product_id.toString();
    if (!seenProductIds.has(productIdString)) {
      seenProductIds.add(productIdString);
      productIds.push(variant.product_id);
    }
  })
  const products = await productsModel.filter({
    filter: {
      _id: { $in: productIds }
    }, projection: {
      updated_at: 0, created_at: 0, delete_at: 0, status: 0, is_active: 0
    }
  })

  const productMap = products.reduce((acc, product) => {
    acc[product._id.toString()] = product
    return acc
  }, {})

  const variantAddedProduct = variants.map(variant => {
    return ({
      ...variant,
      product: productMap[variant.product_id.toString()]
    })
  })

  const variantAddedProductMap = variantAddedProduct.reduce((acc, varAddPrd) => {
    acc[varAddPrd._id.toString()] = varAddPrd;
    return acc
  }, {})

  const variantColorAddedVariantAndProduct = variantColor.map(varColor => {
    return ({
      ...varColor,
      variant: variantAddedProductMap[varColor.variant_id.toString()]
    })
  })

  const arrayVariantAddColor = variantColorAddedVariantAndProduct.map(v => {
    return ({
      ...v,
      color: colorMap[v.color_id]
    })
  })
  return arrayVariantAddColor
}

const createPaymentUrl = async (req) => {
  const body = req.body
  delete body?.firebaseToken
  const session = await client.startSession()
  session.startTransaction()
  try {
    const orderCreated = await orderModel.create({
      name: body.name,
      phone_number: body.phoneNumber,
      email: body.email,
      province_code: body.provinceCode,
      province_name: body.provinceName,
      district_code: body.districtCode,
      district_name: body.districtName,
      ward_code: body.wardCode,
      ward_name: body.wardName,
      address_detail: body.addressDetail,
      note: body.note,
      amount: body.amount,
      lat: body.lat,
      lng: body.lng
    })

    const itemMap = body.items.reduce((acc, item) => {
      acc[item._id.toString()] = item
      return acc
    }, {})

    let variantColor = [];
    for (const item of body.items) {

      const varColor = await variantColorModel.findOne({
        payload: {
          _id: item._id,
          is_active: true
        },
        projection: {
          is_active: 0
        }
      })


      if (!varColor) {
        throw new ErrorCustom('Sản phẩm không tồn tại hoặc đã ngừng bán', 400)
      }
      // const redisKey = `reserved-${item._id}`
      // const reservedQuantity = parseInt(await redis.get(redisKey)) || 0;

      // if(parseInt(varColor.stock) < parseInt(reservedQuantity)){
      //   throw new ErrorCustom('Sản phẩm không đủ số lượng để bán', 400)
      // }

      // await redis.incrby(redisKey, item.quantity);  
      // setTimeout(async () => {
      //   await redis.decrby(redisKey, item.quantity);
      // }, 15 * 60 * 1000)
      variantColor.push(varColor);
    }

    const colorIds = variantColor.map(varColor => ConvertToObjectId(varColor.color_id));
    const variantIds = variantColor.map(varColor => ConvertToObjectId(varColor.variant_id));

    const colors = await colorModel.filter({
      filter: {
        _id: { $in: colorIds }
      },
      projection: {
        created_at: 0, updated_at: 0, deleted_at: 0, is_active: 0, status: 0
      }
    })

    const colorMap = colors.reduce((acc, color) => {
      acc[color._id.toString()] = color.name;
      return acc
    }, {})

    let variants = await variantModel.filter({
      filter: {
        _id: { $in: variantIds }
      },
      projection: {
        is_active: 0,
        description: 0
      }
    })
    const productIds = variants.map(v => ConvertToObjectId(v.product_id));

    const products = await productsModel.filter({
      filter: {
        _id: { $in: productIds }
      }
    })

    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product.name
      return acc
    }, {})

    variants = variants.map(variant => ({
      ...variant,
      product_name: productMap[variant.product_id.toString()]
    }))

    const variantMap = variants.reduce((acc, variant) => {
      acc[variant._id.toString()] = {
        variant_name: variant.name,
        product_name: variant.product_name
      }
      return acc
    }, {})

    const itemsOrder = variantColor.map(varColor => (
      {
        order_id: orderCreated.insertedId,
        price: varColor.price,
        img: varColor.img,
        quantity: itemMap[varColor._id.toString()].quantity,
        color: colorMap[varColor.color_id.toString()],
        ...variantMap[varColor.variant_id.toString()]
      }
    ))

    await orderItemModel.insertMany(itemsOrder);

    let ipAddr = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    if (ipAddr === '::1') ipAddr = '127.0.0.1';

    var tmnCode = env.TMN_CODE;
    var secretKey = env.SECRET_KEY
    var vnpUrl = env.VNP_URL
    var returnUrl = env.VNP_RETURN_URL;
    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHMMss');
    var orderId = orderCreated.insertedId

    var amount = req.body.amount;
    var bankCode = req.body.bankCode || '';

    var orderInfo = req.body.orderDescription || `Thanh toán đơn hàng ${orderId}`;
    var orderType = req.body.orderType || 'other';
    var locale = req.body.language || 'vn';
    if (locale === null || locale === '') {
      locale = 'vn';
    }
    var currCode = 'VND';
    var vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    // vnp_Params['vnp_Merchant'] = ''
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
      vnp_Params['vnp_BankCode'] = bankCode;
    }
    vnp_Params = sortObject(vnp_Params);

    var signData = querystring.stringify(vnp_Params, { encode: false });
    var hmac = crypto.createHmac("sha512", secretKey);
    var secureHash = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = secureHash;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    await session.commitTransaction()
    return {
      vnpUrl
    }
  } catch (error) {
    await session.abortTransaction()
    throw error
  } finally {
    session.endSession()
  }
}

const getVnpIpn = async (req) => {
  if (!req) return

  var vnpay_Params = {
    ...req.query
  };
  var secureHash = vnpay_Params['vnp_SecureHash'];
  delete vnpay_Params['vnp_SecureHash']
  delete vnpay_Params['vnp_SecureHashType']

  vnpay_Params = sortObject(vnpay_Params);

  var secretKey = env.SECRET_KEY;
  var signData = querystring.stringify(vnpay_Params, { encode: false })
  var hmac = crypto.createHmac('sha512', secretKey);
  var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

  if (secureHash === signed) {

    // // xử lí đơn hàng,
    var orderId = vnpay_Params['vnp_TxnRef'];
    let paymentStt = paymentStatus.SUCCESS
    let status = orderStatus.PENDING
    switch (vnpay_Params['vnp_ResponseCode']) {
      case '00':
        paymentStt = paymentStatus.SUCCESS
        break;
      case '11':
        paymentStt = paymentStatus.EXPIRED
        status = orderStatus.CANCELED
        break;
      case '24':
        paymentStt = paymentStatus.CANCELED
        status = orderStatus.CANCELED
        break;
      default:
        paymentStt = paymentStatus.FAILED
        status = orderStatus.CANCELED
    }
    
    const order = await orderModel.findOneAndUpdate({
      _id: orderId
    }, {
      payment_status: paymentStt,
      status
    })

    const existTransaction = await transactionModel.findOne({
      payload: {
        transaction_no: vnpay_Params['vnp_TransactionNo']
      }
    })

    if (existTransaction) {
      return res.status(200).json({ RspCode: '200', Message: 'Transaction already processed' })
    }

    await transactionModel.create({
      order_id: ConvertToObjectId(vnpay_Params['vnp_TxnRef']), // Mã đơn hàng
      amount: vnpay_Params['vnp_Amount'] / 100, // Số tiền thanh toán
      payment_method: 'vnpay', // Phương thức thanh toán
      bank_code: vnpay_Params['vnp_BankCode'], // Mã ngân hàng thanh toán
      bank_tran_no: vnpay_Params['vnp_BankTranNo'], // Mã giao dịch tại ngân hàng
      cart_type: vnpay_Params['vnp_CartType'], // Loại tài khoản/thẻ (ATM, QRCODE),
      order_info: vnpay_Params['vnp_OrderInfo'], // Thông tin mô tả nội dung thanh toán
      pay_date: vnpay_Params['vnp_PayDate'], // Thời gian thanh toán (yyyyMMddHHmmss)
      response_code: vnpay_Params['vnp_ResponseCode'], // Mã phản hồi kết quả thanh toán
      transaction_no: vnpay_Params['vnp_TransactionNo'], // Mã giao dịch ghi nhận tại hệ thống VnPay
      transaction_status: vnpay_Params['vnp_TransactionStatus'], // Mã phản hồi kết quả thanh toán
      created_at: Date.now()
    })

    const admin = await userModel.findOne({
      role: "admin"
    })

    // Sử lí notification ở đây
    await notificationModel.create({
      type: NOTIFICATION_TYPE.order,
      is_read: false,
      user_id: admin._id,
      title: `Bạn có đơn hàng mới!`,
      content: `${order?.name} vừa đặt đơn hàng có giá ${formatPrice(order?.amount)}`,
      reference_type: NOTIFICATION_REFERENCE_TYPE.orders,
      reference_id: order?._id,
      created_at: Date.now(),
      updated_at: null,
      deleted_at: null
    })


    // Gửi thông báo cho admin
    const socketId = onlineUsers.get(admin._id.toString())

    if (socketId) {
      io.to(socketId).emit("notification_recent")
    }

    var rspCode = vnpay_Params['vnp_ResponseCode'];
    return 1
  } else {
    return 0
  }
}
export default {
  create, findOne, findOneAndUpdate, checkoutPage, createPaymentUrl, getVnpIpn
}