const router = require('express').Router();
const { body } = require('express-validator');
const register = require('./controllers/regist');
const login = require('./controllers/login');
const getUser = require('./controllers/getUser');

router.post(
  '/register',
  [
    body('nama_pelamar', 'The name must be filled').notEmpty().escape().trim(),
    body('email_pelamar', 'Invalid email address').notEmpty().escape().trim().isEmail(),
    body('password_pelamar', 'The Password must be of minimum 8 characters length')
      .notEmpty()
      .trim()
      .isLength({ min: 8 }),
  ],
  register.register
);

router.post(
  '/login',
  [
    body('email_pelamar', 'Invalid email address').notEmpty().escape().trim().isEmail(),
    body('password_pelamar', 'The Password must be of minimum 8 characters length')
      .notEmpty()
      .trim()
      .isLength({ min: 8 }),
  ],
  login.login
);

router.get('/getuser', getUser.getUser);

module.exports = router;