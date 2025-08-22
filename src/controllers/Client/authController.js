import { errorResponse, successResponse } from "../../utils/response.js";
import authService from "../../services/Client/authService.js";
import userService from "../../services/Client/userService.js";

const loginWithGoogle = async (req, res, next) => {
  try {
    const result = await authService.loginWithGoogle(req.body); 
    return successResponse(res, {
      data: {
        ...result
      }, message: 'Đăng nhập thành công'
    }, 200)

  } catch (error) {
    next(error)
  }
}

const getAccountByGoogleId = async (req, res, next) => {
  try {
    const { googleId } = req.body;
    const account = await userService.getAccountByGoogleId(googleId)
    if(!account){
      return errorResponse(res, {
        message: 'Tài khoản không tồn tại!'
      })
    }

    return successResponse(res, {
      data: {
        account
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

const getInfoAccount = async(req, res, next) => {
  try {
    const account = await userService.getInfoAccount(req);
    return successResponse(res, {
      data: {
        account
      }
    })
  } catch (error) {
    next(error)
  }
}

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body)
    console.log(result);
    
    return successResponse(res, {
      data: {
        ...result
      },
      message: "Đăng ký tài khoản thành công!"
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
try {
  const result = await authService.login(req.body)
  return successResponse(res, {
    data: {
      ...result
    }
  })
} catch (error) {
  next(error)
}
}
export default {
  loginWithGoogle, getAccountByGoogleId, register, login, getInfoAccount
  // , loginWithEmail
}