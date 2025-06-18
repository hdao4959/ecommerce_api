import ErrorCustom from "../utils/ErrorCustom.js";
import redis from "./redis.js";
import axios from "axios";

const PROVINCE_KEY = 'location:provinces';

const get = async () => {
  try {
  const cached = await redis.get(PROVINCE_KEY);
  if (cached) {
    return JSON.parse(cached)
  }
    const { data } = await axios.get("https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1");
    const provinces = data.data.data;
    await redis.set(PROVINCE_KEY, JSON.stringify(provinces), "EX", 24 * 3600)
    return provinces
  } catch (error) {
    console.log('Lỗi khi gọi province cache');
    throw new ErrorCustom(error)
  }
}

const clearCache = async () => {
  try {
    await redis.del(PROVINCE_KEY)
  } catch (error) {
    console.log(('Lỗi khi xoá province cache'));
    throw new ErrorCustom(error)
  }
}

export default {
  get, clearCache
}