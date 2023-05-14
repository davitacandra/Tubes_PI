const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../db-config');

exports.register = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const [row] = await conn.query(
      'SELECT `email_pelamar` FROM `pelamar` WHERE `email_pelamar`=?',
      [req.body.email_pelamar]
    );

    if (row.length > 0) {
      return res.status(201).json({
        message: 'The E-mail already in use',
      });
    }

    const hashPass = await bcrypt.hash(req.body.password_pelamar, 12);

    const [rows] = await conn.query(
      'INSERT INTO `pelamar`(`nama_pelamar`,`email_pelamar`,`password_pelamar`) VALUES(?,?,?)',
      [req.body.nama_pelamar, req.body.email_pelamar, hashPass]
    );

    if (rows.affectedRows === 1) {
      return res.status(201).json({
        message: 'The user has been successfully inserted.',
      });
    }
  } catch (err) {
    next(err);
  }
};