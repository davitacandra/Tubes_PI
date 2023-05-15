const { validationResult } = require('express-validator');
const conn = require('../db-config');

exports.updateUser = async (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    try {
      const userId = req.params.id;
  
      // Check if the user exists
      const [userRow] = await conn.execute(
        "SELECT * FROM `pelamar` WHERE `id`=?",
        [userId]
      );
  
      if (userRow.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }
  
      // Update user information
      const [rows] = await conn.execute(
        'UPDATE `pelamar` SET `nama_pelamar`=?, `email_pelamar`=?, `telepon_pelamar`=?, `alamat_pelamar`=?, `kota_pelamar`=?, `provinsi_pelamar`=?, `kualifikasi_pelamar`=?, `pengalaman_kerja`=? WHERE `id`=?',
        [req.body.nama_pelamar, req.body.email_pelamar, req.body.telepon_pelamar, req.body.alamat_pelamar, req.body.kota_pelamar, req.body.provinsi_pelamar, req.body.kualifikasi_pelamar, req.body.pengalaman_kerja, userId]
      );
  
      if (rows.affectedRows === 1) {
        return res.status(200).json({
          message: "User updated successfully",
        });
      }
  
      return res.status(500).json({
        message: "Failed to update user",
      });
    } catch (err) {
      next(err);
    }
  };

