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

const homePage = async (req, res, next) => {
  try {
    const products = await productService.getAll({
      projection: { created_at: 0, updated_at: 0, deleted_at: 0, status: 0, is_active: 0 },
      query: { is_active: true }
    });
    // Mảng các id sản phẩm
    const productIds = products.map(product => product._id)
    // 1 đối tượng gồm nhiều đôi tượng sản phẩm, gồm key là id sản phẩm và giá trị là sản phẩm
    const productMap = products.reduce((acc, product) => {
      acc[product._id.toString()] = product
      return acc
    }, {})

    const variants = await variantService.filter({
      filter: { product_id: { $in: productIds }, is_active: true }
    }

    );
    // Mảng gồm các id variant
    const variantIds = variants.map((variant) => variant._id)
    // 1 đối tượng gồm nhiều đối tượng variant, có key là id của từng variant
    const variantMap = variants.reduce((acc, variant) => {
      acc[variant._id.toString()] = { ...variant, colors: [] }
      return acc
    }, {})

    const variantColor = await variantColorService.filter({ query: { is_active: true, variant_id: { $in: variantIds } }, sort: { _id: -1 } })
    for (const key in variantColor) {
      const varColor = variantColor[key]
      variantMap[varColor.variant_id.toString()].colors.push(varColor)
    }

    const convertObjectProductsToArray = Object.values(productMap);

    const newArrayProducts = convertObjectProductsToArray.map((product) => {
      const variants = Object.values(variantMap).filter(v => v.product_id.toString() == product._id.toString());
      return {
        ...product,
        variants: variants
      }
    })

    return successResponse(res, {
      data: {
        products: newArrayProducts,
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

const cartPage = async (req, res, next) => {
  try {
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
    const variantColor = await variantColorService.filter({
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

    const colors = await colorService.filter({
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
    const variants = await variantService.filter({
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
    const products = await productService.filter({
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
    return successResponse(res, {
      data: {
        items: arrayVariantAddColor
      }
    }, 200)


  } catch (error) {
    next(error)
  }
}

const checkoutPage = async (req, res, next) => {
  try {
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
    const variantColor = await variantColorService.filter({
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

    const colors = await colorService.filter({
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
    const variants = await variantService.filter({
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
    const products = await productService.filter({
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
    var orderId = dateFormat(date, 'HHMMss');

    var amount = req.body.amount;
    var bankCode = req.body.bankCode || '';

    var orderInfo = req.body.orderDescription || 'Thanh toán đơn hàng';
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

const getVnpIpn = async(req, res, next) => {
  try {
    const vnpay_Params = req.query;
    var secureHash = vnpay_Params['vnp_SecureHash'];
    delete vnpay_Params['vnp_SecureHash']
    delete vnpay_Params['vnp_SecureHashType']

    vnpay_Params = sortObject(vnpay_Params);
    var secretKey = env.SECRET_KEY;
    var signData = querystring.stringify(vnpay_Params, {encode: false})
    var hmac = crypto.createHmac('sha512', secretKey);
    var signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

    if(secureHash === signed){
      // xử lí đơn hàng,
      var orderId = vnpay_Params['vnp_TxnRef'];
      var rspCode = vnpay_Params['vnp_ResponseCode'];
      res.status(200).json({RspCode: '00', Message: 'success'})
    }else{
       res.status(200).json({RspCode: '97', Message: 'Fail checksum'})
    }
    console.log(req.query);
    
  } catch (error) {
    next(error)
  }
}

export default {
  homePage, cartPage, checkoutPage, createPaymentUrl, getVnpIpn
}