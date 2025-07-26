import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteMany = async (images) => {
  if (images?.length === 0) return
  await Promise.all(
    images.map(async (image) => {
      try {
        const filePath = path.join(__dirname, '../../../' + image);
        await fs.promises.unlink(filePath)
      } catch (error) {
        console.log('Lỗi xoá file:', error);
      }
    })

  )
}

export default {
  deleteMany
}