import { OAuth2Client } from "google-auth-library";
import { errorResponse, successResponse } from "../utils/response.js";
import env from "../config/env.js";
import authService from "../services/authService.js";


const client = new OAuth2Client(env.GOOGLE_CLIENT_ID);

const loginWithGoogle = async (req, res, next) => {
  const {token} = req.body;
  try {
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.GOOGLE_CLIENT_ID
    })
    const payload = ticket?.getPayload();
    if(!payload){
      return errorResponse(res, {message: 'Invalid Google token'}, 400)
    }
    const {name, email, picture, sub} = payload

    await authService.loginWithGoogle({
      googleId: sub
    });

  
    return successResponse(res, {data: {
      name, email, picture, sub
    }, message: 'Đăng nhập thành công'}, 200)
    
  } catch (error) {
    console.log(error);
    
    next(error)
  }
}

export default {
  loginWithGoogle
}