import colorService from "../../services/Client/colorService.js";
import productService from "../../services/Client/productService.js";
import variantColorService from "../../services/Client/variantColorService.js";
import variantService from "../../services/Client/variantService.js";
import { ConvertToObjectId } from "../../utils/ConvertToObjectId.js";
import { errorResponse, successResponse } from "../../utils/response.js";
import env from "../../config/env.js";
import sortObject from "../../utils/sortObject.js";
import orderService from "../../services/Client/orderService.js";
import itemService from "../../services/Client/orderItemsService.js";
import ErrorCustom from "../../utils/ErrorCustom.js";
import { orderStatus, paymentStatus } from "../../models/orderModel.js";
import transactionService from "../../services/Client/transactionService.js";
import cartService from "../../services/Client/cartService.js";
import { decodeToken, verifyToken } from "../../middlewares/verifyToken.js";

const homePage = async (req, res, next) => {
  try {
    const user = decodeToken(req)
    if(user){
      req.user = user
    }
    
    const products = await productService.homePage(req);

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
    const result = await orderService.createPaymentUrl(req)
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