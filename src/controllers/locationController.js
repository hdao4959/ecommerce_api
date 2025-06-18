import districtCache from "../redis/district.cache.js";
import provinceCache from "../redis/province.cache.js";
import { successResponse } from "../utils/response.js";

const getProvinces = async (req, res, next) => {
  try {
    const provinces = await provinceCache.get();
    return successResponse(res, {data: {
      provinces: provinces
    }})
  } catch (error) {
    next(error)
  }
}

const getDistricts = async (req, res, next) => {
  try {
    
    const districts = await districtCache.get(req.query.provinceCode)
    return successResponse(res, {
      data: {
        districts: districts
      }
    })
  } catch (error) {
    next(error)
  }
}

export default {
  getProvinces, getDistricts
}