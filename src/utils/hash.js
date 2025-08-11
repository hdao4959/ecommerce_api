import bcrypt from 'bcrypt'
const saltRounds = 10;

const hashPassword = async (plainPassword) => {
  return await bcrypt.hash(plainPassword, saltRounds)
}

const checkPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export default {
  hashPassword, checkPassword
}