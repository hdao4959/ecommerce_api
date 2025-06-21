import userModel from "../models/userModel.js";

const loginWithGoogle = async (data) => {
  const existAccount = await userModel.findOneBy({
    payload: {
      googleId: data.sub
    }
  })
  const newData = {
    ...data,
    googleId: data.sub
  }
  delete newData.sub
// Đã từng đăng nhập bằng google
  if(!existAccount){
    delete newData.created_at;
    return await userModel.create({
      ...newData,
      phone_number: null,
      address: null,
    });
  }
  // Chưa từng đăng nhập bằng google
  return await userModel.update(existAccount._id, newData);
}

export default {
  loginWithGoogle
}