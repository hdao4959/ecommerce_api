import axios from "axios";
import redis from "./redis.js"
import ErrorCustom from "../utils/ErrorCustom.js";

const getDistrictKey = (districtCode) => {
  return `location:ward:${districtCode}`
}

const getAll = async (districtCode) => {
  try {
    const cached = await redis.get(getDistrictKey(districtCode));
    if(cached){
      return JSON.parse(cached)
    }

    const {data} = await axios.get(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`)
    const wards = data.data.data;
    await redis.set(getDistrictKey(districtCode), JSON.stringify(wards), "EX", 3600 * 24);
    return wards
  } catch (error) {
    console.log('Lỗi khi lấy district cache');
    throw new ErrorCustom(error)
  }
}

const clearCache = async (districtCode) => {
  try {
    return await redis.del(getDistrictKey(districtCode));
  } catch (error) {
    console.log('Lỗi khi xoá ward cache');
    throw new ErrorCustom(error)
  }
}

export default {
  getAll, clearCache
}