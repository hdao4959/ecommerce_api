import districtCache from "../redis/district.cache.js";
import provinceCache from "../redis/province.cache.js"
import wardCache from "../redis/ward.cache.js";
import ErrorCustom from "../utils/ErrorCustom.js";

const getProvinces = async () => {
  return await provinceCache.getAll();
}

const getDistricts = async (provinceCode) => {
  if (!provinceCode) throw new ErrorCustom('Bạn chưa cung cấp mã province cho việc lấy danh sách Quận/huyện');
  return await districtCache.getAll(provinceCode)
}

const getWards = async (districtCode) => {
  if (!districtCode) throw new ErrorCustom('Bạn chưa cung cấp mã district cho việc lấy danh sách Phường/xã')
    return wardCache.getAll(districtCode);
}
export default {
  getProvinces, getDistricts, getWards
}