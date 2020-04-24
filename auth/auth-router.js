const router = require('express').Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); 

router.post('/register', (req, res) => {
  let user = req.body; // username, password

  // rounds are 2 to the N times
  const rounds = process.env.HASH_ROUNDS || 8;

  // hash the user.password
  const lockdown = bcrypt.hashSync(user.password, rounds)
  // update the user to use the hash
  user.password = lockdown;

  Users.create(user).then(saved => {
  res.status(201).json(saved)
  }).catch(error => {
  console.log(error);
  res.status(500).json({ errorMessage: error.message })
  })
});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
