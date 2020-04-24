/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/
const jwt = require("jsonwebtoken");

const secrets = require("../api/secrets");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  const secret = secrets.jwtSecret;

  if(token){
  // verify that the token is valid
  jwt.verify(token, secret, (err, decodedToken) => {
      // if everything is good with the token, the error will be undefined
      if(err){
          res.status(401).json({ message: 'I find your lack of authorization disturbing.' })
      } else{
          req.decodedToken = decodedToken; // not required
          next();
      }
  })
} else {
  res.status(400).json({ message: 'Please login first'})
}
};
