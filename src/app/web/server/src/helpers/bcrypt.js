const bcrypt = require('bcrypt')

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  } catch (err) {
    console.error(err)
    throw err
  }
}

const comparePassword = async (pass, hashedPassword) => {
  try {
    return await bcrypt.compare(pass, hashedPassword)
  } catch (err) {
    console.error(err)
    throw err
  }
}

module.exports = {
  hashPassword,
  comparePassword
}
