const jwt = require('jsonwebtoken');

const SECRET = '123';

class JWT {
  static verify(token) {
    try {
      return jwt.verify(token, SECRET);
    } catch {
      return null;
    }
  }

  static sign(data) {
    return jwt.sign(data, SECRET, { expiresIn: '30 days' });
  }
}

module.exports = JWT;
