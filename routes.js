const router = require('express').Router();
const { body } = require('express-validator');
const akunController = require('./controllers/akun');
const authController = require('./controllers/auth');

router.post(
  '/register',
  [
    body('email', 'Invalid email address').notEmpty().escape().trim().isEmail(),
    body('password', 'The Password must be of minimum 8 characters length')
      .notEmpty()
      .trim()
      .isLength({ min: 8 }),
  ],
  akunController.register
);

router.get('/getuser', akunController.getUser);

router.put(
  '/updatepelamar/:id',
  [
    body('nama_pelamar', 'The name must be filled').notEmpty().escape().trim(),
    body('telepon_pelamar', 'The phone number must be numeric and minimum 8 numbers').optional().escape().trim().isNumeric().isLength({ min: 12 }),
    body('alamat_pelamar', 'The address must be filled').optional().escape().trim(),
    body('kota_pelamar', 'The city must be filled').optional().escape().trim(),
    body('provinsi_pelamar', 'The province must be filled').optional().escape().trim(),
    body('kualifikasi_pelamar', 'The qualification must be filled').optional().escape().trim(),
    body('pengalaman_kerja', 'The experience must be filled').optional().escape().trim(),
  ],
  akunController.updatePelamar
);

router.delete('/deleteuser/:id', akunController.deleteUser);

router.post('/login', authController.login);
router.post('/logout', authController.logout);

module.exports = router;