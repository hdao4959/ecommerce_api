import ErrorCustom from "../utils/ErrorCustom.js";
import redis from "./redis.js";
import axios from "axios";

const getDistrictKey = (provinceCode) => {
  return `location:districts:${provinceCode}`;
}

const getAll = async (provinceCode) => {
  try {
    const cached = await redis.get(getDistrictKey(provinceCode));
    if(cached){
      return JSON.parse(cached)
    }

    // const {data} = await axios.get(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`)
    const {data} = await axios.get(`https://provinces.open-api.vn/api/v1/p/${provinceCode}?depth=2`)
    const districts = data.districts
    await redis.set(getDistrictKey(provinceCode), JSON.stringify(districts), "EX", 3600 * 24)
    return districts
  } catch (error) {
    console.log("Lỗi khi lấy district cache");
    throw new ErrorCustom(error)
  }
}

const clearCache = async (provinceCode) => {
  try {
    if(!provinceCode){
      throw new ErrorCustom("Bạn chưa cung cấp province code");
    }
    return await redis.del(getDistrictKey(provinceCode))
  } catch (error) {
    console.log('Lỗi khi xoá district cache');
    throw new ErrorCustom(error)
  }
}

export default {
  getAll, clearCache
}