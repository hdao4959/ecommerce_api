import userModel from "../models/userModel.js";

const loginWithGoogle = async (data) => {
  const existAccount = await userModel.findOneBy({
    payload: {
      google_id: data.googleId
    }
  })

  if(!existAccount){
    return await userModel.create(data);
  }
  return 0
}

export default {
  loginWithGoogle
}