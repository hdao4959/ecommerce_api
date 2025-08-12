import { successResponse } from "../../utils/response.js";
import authService from "../../services/authService.js";
import userService from "../../services/Client/userService.js";

const loginWithGoogle = async (req, res, next) => {
  try {
    const account = await authService.loginWithGoogle(req.body); 
    return successResponse(res, {
      data: {
        account
      }, message: 'Đăng nhập thành công'
    }, 200)

  } catch (error) {
    next(error)
  }
}

const getAccountByGoogleId = async (req, res, next) => {
  try {
    const { googleId } = req.body;
    const account = await userService.findOneBy({
      payload: { google_id: googleId },
      projection: { _id: 0, created_at: 0, updated_at: 0, deleted_at: 0 }
    })
    return successResponse(res, {
      data: {
        account
      }
    }, 200)
  } catch (error) {
    next(error)
  }
}

// const loginWithEmail = async (req, res, next) => {
//   try {

//   } catch (error) {
//     next(error)
//   }
// }

const register = async (req, res, next) => {
  try {
    console.log(req.body);
    
  } catch (error) {
    next(error)
  }
}
export default {
  loginWithGoogle, getAccountByGoogleId, register
  // , loginWithEmail
}