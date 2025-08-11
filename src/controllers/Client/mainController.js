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
    const result = orderService.createPaymentUrl(req)
    return successResponse(res, {
      data: {
        ...result
      }
    }, 200)

  } catch (error) {
    next(error)
  }

}

const getVnpIpn = async (req, res, next) => {
  try {

    const result = await orderService.getVnpIpn(req)
    if (result) {
      res.status(200).json({ RspCode: '00', Message: 'success' })
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    }
    // var vnpay_Params = {
    //   ...req.query
    // };
    // var secureHash = vnpay_Params['vnp_SecureHash'];
    // delete vnpay_Params['vnp_SecureHash']
    // delete vnpay_Params['vnp_SecureHashType']

    // vnpay_Params = sortObject(vnpay_Params);

    // var secretKey = env.SECRET_KEY;
    // var signData = querystring.stringify(vnpay_Params, { encode: false })
    // var hmac = crypto.createHmac('sha512', secretKey);
    // var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')


    // if (secureHash === signed) {

    //   // // xử lí đơn hàng,
    //   var orderId = vnpay_Params['vnp_TxnRef'];
    //   let paymentStt = paymentStatus.SUCCESS
    //   switch (vnpay_Params['vnp_ResponseCode']) {
    //     case '00':
    //       paymentStt = paymentStatus.SUCCESS
    //       break;
    //     case '11':
    //       paymentStt = paymentStatus.EXPIRED
    //       break;
    //     case '24':
    //       paymentStt = paymentStatus.CANCELED
    //       break;
    //     default:
    //       paymentStt = paymentStatus.FAILED
    //   }

    //   const order = await orderService.findOneAndUpdate(orderId, {
    //     payment_status: paymentStt
    //   })

    //   const existTransaction = await transactionService.findOne({
    //     payload: {
    //       transaction_no: vnpay_Params['vnp_TransactionNo']
    //     }
    //   })

    //   if (existTransaction) {
    //     return res.status(200).json({ RspCode: '200', Message: 'Transaction already processed' })
    //   }

    //   await transactionService.create({
    //     order_id: ConvertToObjectId(vnpay_Params['vnp_TxnRef']), // Mã đơn hàng
    //     amount: vnpay_Params['vnp_Amount'] / 100, // Số tiền thanh toán
    //     payment_method: 'vnpay', // Phương thức thanh toán
    //     bank_code: vnpay_Params['vnp_BankCode'], // Mã ngân hàng thanh toán
    //     bank_tran_no: vnpay_Params['vnp_BankTranNo'], // Mã giao dịch tại ngân hàng
    //     cart_type: vnpay_Params['vnp_CartType'], // Loại tài khoản/thẻ (ATM, QRCODE),
    //     order_info: vnpay_Params['vnp_OrderInfo'], // Thông tin mô tả nội dung thanh toán
    //     pay_date: vnpay_Params['vnp_PayDate'], // Thời gian thanh toán (yyyyMMddHHmmss)
    //     response_code: vnpay_Params['vnp_ResponseCode'], // Mã phản hồi kết quả thanh toán
    //     transaction_no: vnpay_Params['vnp_TransactionNo'], // Mã giao dịch ghi nhận tại hệ thống VnPay
    //     transaction_status: vnpay_Params['vnp_TransactionStatus'], // Mã phản hồi kết quả thanh toán
    //     created_at: Date.now()
    //   })

    //   // Sử lí notification ở đây


    //   var rspCode = vnpay_Params['vnp_ResponseCode'];

    //   res.status(200).json({ RspCode: '00', Message: 'success' })
    // } else {
    //   res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
    // }

  } catch (error) {
    next(error)
  }
}

const search = async (req, res, next) => {
  try {
    const result = await productService.getForSearchPage(req)
    return successResponse(res, {
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export default {
  homePage, cartPage, checkoutPage, createPaymentUrl, getVnpIpn, search
}