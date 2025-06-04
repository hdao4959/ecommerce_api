import colorModel from "../../models/colorModel.js"

const filter = async ({filter = {}, projection = {}}) => {
  return await colorModel.filter({filter, projection})
}

export default {
  filter
}