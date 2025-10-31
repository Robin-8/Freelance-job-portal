const jwt = require('jsonwebtoken');

const generateToken = async (user) => {
  console.log('🟢 [SIGN] process.env.JWT_SECRET =', process.env.JWT_SECRET);
  return jwt.sign(
    { id: user._id, email: user.email,role:user.role},
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = { generateToken };
