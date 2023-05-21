//BELUM JADIIII JANGAN DILIAT DULUUUUU


const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../util/db-config');

exports.addCompany = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const [row] = await conn.query(
      'SELECT `email_company` FROM `pelamar` WHERE `email_company`=?',
      [req.body.email_company]
    );

    if (row.length > 0) {
      return res.status(201).json({
        message: 'The E-mail already in use',
      });
    }

    const [rows] = await conn.query(
      'INSERT INTO `company`(`nama_company`,`deskripsi_company`,`alamat_company`, `kota_company`, `provinsi_company`, `email_company`, `telepon_company`, `website_company`) VALUES(?,?,?,?,?,?,?,?)',
      [req.body.nama_company, req.body.deskrispi_company, req.body.alamat_company, req.body.kota_company, req.body.provinsi_company, req.body.email_company, req.body.telepon_company, req.body.website_company]
    );

    if (rows.affectedRows === 1) {
      return res.status(201).json({
        message: 'The company has been successfully inserted.',
      });
    }
  } catch (err) {
    next(err);
  }
};