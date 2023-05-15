const router = require('express').Router();
const { body } = require('express-validator');
const register = require('./controllers/regist');
const login = require('./controllers/login');
const getUser = require('./controllers/getUser');
const updateUser = require('./controllers/updateUser');
const deleteUser = require('./controllers/deleteUser');

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

router.put('/updateuser/:id',
  [
    body('nama_pelamar', "The name must be filled").notEmpty().escape().trim(),
    body('email_pelamar', "Invalid email address").notEmpty().escape().trim().isEmail(),
    body('telepon_pelamar', "The phone number must be filled").notEmpty().escape().trim(),
    body('alamat_pelamar', "The phone number must be filled").notEmpty().escape().trim(),
    body('kota_pelamar', "The city must be filled").notEmpty().escape().trim(),
    body('provinsi_pelamar', "The province must be filled").notEmpty().escape().trim(),
    body('kualifikasi_pelamar', "The qualification must be filled").notEmpty().escape().trim(),
    body('pengalaman_kerja', "The experience must be filled").notEmpty().escape().trim(),
  ],
  updateUser.updateUser
);

router.delete('/deleteuser/:id', deleteUser.deleteUser);

module.exports = router;