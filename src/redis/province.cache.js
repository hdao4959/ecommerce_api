import ErrorCustom from "../utils/ErrorCustom.js";
import redis from "./redis.js";
import axios from "axios";

const PROVINCES_KEY = 'location:provinces';

const getAll = async () => {
  try {
  const cached = await redis.get(PROVINCES_KEY);
  if (cached) {
    return JSON.parse(cached)
  }
    const { data } = await axios.get("https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1");
    const provinces = data.data.data;
    await redis.set(PROVINCES_KEY, JSON.stringify(provinces), "EX", 24 * 3600)
    return provinces
  } catch (error) {
    console.log('Lỗi khi gọi provinces cache');
    throw new ErrorCustom(error)
  }
}

const clearCache = async () => {
  try {
    await redis.del(PROVINCES_KEY)
  } catch (error) {
    console.log(('Lỗi khi xoá province cache'));
    throw new ErrorCustom(error)
  }
}

export default {
  getAll, clearCache
}