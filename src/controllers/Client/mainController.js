import colorService from "../../services/Client/colorService.js";
import productService from "../../services/Client/productService.js";
import variantColorService from "../../services/Client/variantColorService.js";
import variantService from "../../services/Client/variantService.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import { errorResponse, successResponse } from "../../utils/response.js";
import env from "../../config/env.js";
import dateFormat from 'dateformat'
import querystring from 'qs'
import crypto, { sign } from 'crypto'
import sortObject from "../../utils/sortObject.js";
import orderService from "../../services/Client/orderService.js";
import itemService from "../../services/Client/orderItemsService.js";
import ErrorCustom from "../../utils/ErrorCustom.js";
import { orderStatus, paymentStatus } from "../../models/orderModel.js";
import transactionService from "../../services/Client/transactionService.js";
import cartService from "../../services/Client/cartService.js";

const homePage = async (req, res, next) => {
  try {
    const products = await productService.getForHomePage(req.query);

    return successResponse(res, {
      data: {
        ...products,
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

const cartPage = async (req, res, next) => {
  try {
    const itemsCart = await cartService.cartPage(req);
    return successResponse(res, {
      data: {
        ...itemsCart
      }
    }, 200)


  } catch (error) {
    next(error)
  }
}

const checkoutPage = async (req, res, next) => {
  try {
    const arrayVariantAddColor = await orderService.checkoutPage(req)
    return successResponse(res, {
      data: {
        items: arrayVariantAddColor
      }
    }, 200)


  } catch (error) {
    next(error)
  }
}

const createPaymentUrl = async (req, res, next) => {
  try {
    const body = req.body
    const orderCreated = await orderService.create({
      name: body.name,
      phone_number: body.phoneNumber,
      email: body.email,
      province: body.province,
      district: body.district,
      ward: body.ward,
      note: body.note,
      amount: body.amount
    })

    const itemMap = body.items.reduce((acc, item) => {
      acc[item._id.toString()] = item
      return acc
    }, {})

    let variantColor = [];
    for (const item of body.items) {

      const varColor = await variantColorService.findOne({
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

    const colors = await colorService.filter({
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

    let variants = await variantService.filter({
      filter: {
        _id: { $in: variantIds }
      },
      projection: {
        is_active: 0
      }
    })
    const productIds = variants.map(v => ConvertToObjectId(v.product_id));

    const products = await productService.filter({
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

    await itemService.insertMany(itemsOrder);


    let ipAddr = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
    if (ipAddr === '::1') ipAddr = '127.0.0.1';

    // var ipAddr = req.headers['x-forwarded-for'] ||
    // req.connection.remoteAddress ||
    // req.socket.remoteAddress ||
    // req.connection.socket.remoteAddress;

    var tmnCode = env.TMN_CODE;

    var secretKey = env.SECRET_KEY
    var vnpUrl = env.VNP_URL
    var returnUrl = env.VNP_RETURN_URL;

    var date = new Date();

    var createDate = dateFormat(date, 'yyyymmddHHMMss');
    // var orderId = dateFormat(date, 'HHMMss');
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

    return successResponse(res, {
      data: {
        vnpUrl: vnpUrl
      }
    }, 200)

  } catch (error) {
    next(error)
  }

}

const getVnpIpn = async (req, res, next) => {
  try {
    var vnpay_Params = {
      ...req.query
    };
    var secureHash = vnpay_Params['vnp_SecureHash'];
    delete vnpay_Params['vnp_SecureHash']
    delete vnpay_Params['vnp_SecureHashType']

    const sorted = sortObject(vnpay_Params)

    vnpay_Params = sortObject(vnpay_Params);

    var secretKey = env.SECRET_KEY;
    var signData = querystring.stringify(vnpay_Params, { encode: false })
    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')


    if (secureHash === signed) {

      // // xử lí đơn hàng,
      var orderId = vnpay_Params['vnp_TxnRef'];
      let paymentStt = paymentStatus.SUCCESS
      switch (vnpay_Params['vnp_ResponseCode']) {
        case '00':
          paymentStt = paymentStatus.SUCCESS
          break;
        case '11':
          paymentStt = paymentStatus.EXPIRED
          break;
        case '24':
          paymentStt = paymentStatus.CANCELED
          break;
        default:
          paymentStt = paymentStatus.FAILED
      }

      const order = await orderService.findOneAndUpdate(orderId, {
        payment_status: paymentStt
      })

      const existTransaction = await transactionService.findOne({
        payload: {
          transaction_no: vnpay_Params['vnp_TransactionNo']
        }
      })

      if (existTransaction) {
        return res.status(200).json({ RspCode: '200', Message: 'Transaction already processed' })
      }

      await transactionService.create({
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
      var rspCode = vnpay_Params['vnp_ResponseCode'];

      res.status(200).json({ RspCode: '00', Message: 'success' })
    } else {

      res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    }

  } catch (error) {
    next(error)
  }
}

export default {
  homePage, cartPage, checkoutPage, createPaymentUrl, getVnpIpn
}