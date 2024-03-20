const jwt = require("jsonwebtoken");

const jwtkeyval = process.env.KEY;

const authenticateToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(404).json({status:"error",message:"Token Invalid",data: {}});
  }
  try {
    const decoded = jwt.verify(token, jwtkeyval);
    req.user = decoded;
  } catch (err) {
    return res.status(403).json({status:"error",message:"Invalid Token",data: {}});
  }
  return next();
};

module.exports = authenticateToken;