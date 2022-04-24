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

  static decode(token) {
    try {
      return jwt.decode(token);
    } catch (e) {
      return null;
    }
  }
}

module.exports = JWT;
