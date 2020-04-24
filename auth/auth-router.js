const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 

const Users = require("./user-model");
const secrets = require("../api/secrets");

router.post('/register', (req, res) => {
  let user = req.body; // username, password

  // rounds are 2 to the N times
  const rounds = process.env.HASH_ROUNDS || 8;

  // hash the user.password
  const lockdown = bcrypt.hashSync(user.password, rounds)
  // update the user to use the hash
  user.password = lockdown;

  Users.add(user).then(saved => {
  res.status(201).json(saved)
  }).catch(error => {
  console.log(error);
  res.status(500).json({ errorMessage: error.message })
  })
});

router.post('/login', (req, res) => {
  let {username, password } = req.body;

  // search for the user using the username
  Users.findBy({ username })
  .then(([user]) => { 
  // if we find the user also check if the passwords match
  if(user && bcrypt.compareSync(password, user.password)){
    // produce a token
    const token = generateToken(user)
    
    // send the token to the client
    res.status(200).json({ message: `Welcome ${username}`, token})
  } else {
    res.status(401).json({ message: 'I find your lack of credentials disturbing'})
  }

  }).catch(error => {
  console.log(error);
  res.status(500).json({ errorMessage: error.message })
  })
});

function generateToken(user){
  // the data
  const payload = {
    userId: user.id,
    username: user.username
  }
  // the secret requires secrets file
  const secret = secrets.jwtSecret;

  const options = {
    expiresIn: '1d'
  }

  return jwt.sign(payload, secret, options)
};

module.exports = router;
