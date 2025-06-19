import locationService from "../services/locationService.js";
import { errorResponse, successResponse } from "../utils/response.js";

const getProvinces = async (req, res, next) => {
  try {
    const provinces = await locationService.getProvinces();
    return successResponse(res, {data: {
      provinces: provinces
    }})
  } catch (error) {
    next(error)
  }
}

const getDistricts = async (req, res, next) => {
  try {
    const provinceCode = req.query.provinceCode
    if(!provinceCode) return errorResponse(res, {message: 'Bạn chưa cung cấp mã Tỉnh/Thành phố'}, 400)

    const districts = await locationService.getDistricts(provinceCode)
    return successResponse(res, {
      data: {
        districts: districts
      }
    })
  } catch (error) {
    next(error)
  }
}

const getWards = async (req, res, next) => {
  try {
    const districtCode = req.query.districtCode;
    if(!districtCode) return errorResponse(res, {message: 'Bạn chưa cung cấp mã Quận/huyện'}, 400)
    const wards = await locationService.getWards(districtCode);
  return successResponse(res, {
    data: {
      wards: wards
    }
  })
  } catch (error) {
    next(error)
  }
}

export default {
  getProvinces, getDistricts, getWards
}