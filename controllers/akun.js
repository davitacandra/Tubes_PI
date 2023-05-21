const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const conn = require('../util/db-config');

//Register User 
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const [row] = await conn.query('SELECT `email` FROM `user` WHERE `email`=?', [
      req.body.email,
    ]);

    if (row.length > 0) {
      return res.status(409).json({
        message: 'The email is already in use',
      });
    }

    const hashPass = await bcrypt.hash(req.body.password, 12);

    const [userRow] = await conn.query(
      'INSERT INTO `user`(`email`,`password`,`role`) VALUES(?,?,?)',
      [req.body.email, hashPass, 'Pelamar']
    );

    if (userRow.affectedRows === 1) {
      const userId = userRow.insertId;
      
      const [pelamarRow] = await conn.query(
        'INSERT INTO `pelamar`(`id_user`) VALUES(?)',
        [userId]
      );

      if (pelamarRow.affectedRows === 1) {
        return res.status(201).json({
          message: 'The user and pelamar data have been successfully inserted.',
        });
      }
    }
    
    console.error('Failed to insert user and pelamar data:', userRow); // Log the userRow variable for debugging

    return res.status(500).json({
      message: 'Failed to insert user and pelamar data',
    });
  } catch (err) {
    next(err);
  }
};

// GetUser untuk yang Login, jadi yang muncul khusus data dia sendiri aja
exports.getUser = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer') ||
      !req.headers.authorization.split(' ')[1]
    ) {
      return res.status(422).json({
        message: 'Please provide the token',
      });
    }

    const theToken = req.headers.authorization.split(' ')[1];

    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');

    const [row] = await conn.execute(
      'SELECT `id`,`email` FROM `user` WHERE `id`=?',
      [decoded.id]
    );

    if (row.length > 0) {
      return res.json({
        user: row[0],
      });
    }

    res.json({
      message: 'No user found',
    });
  } catch (err) {
    next(err);
  }
};

// Update / Edit khusus untuk 'Pelamar' doang
exports.updatePelamar = async (req, res, next) => {
  try {
    // Retrieve the user's ID from the decoded token
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'the-super-strong-secrect');
    const userId = decoded.id;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // Return validation errors if any
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      // Check if the user exists and has the role of 'Pelamar'
      const [userRow] = await conn.execute(
        'SELECT * FROM `user` WHERE `id` = ? AND `role` = "Pelamar"',
        [userId]
      );

      if (userRow.length === 0) {
        // Return an error response if user not found or not authorized
        return res.status(404).json({
          message: 'User not found or not authorized',
        });
      }

      // Update the user's data in the 'pelamar' table
      const [rows] = await conn.execute(
        'UPDATE `pelamar` SET `nama_pelamar`=?, `telepon_pelamar`=?, `alamat_pelamar`=?, `kota_pelamar`=?, `provinsi_pelamar`=?, `kualifikasi_pelamar`=?, `pengalaman_kerja`=? WHERE `id_user`=?',
        [
          req.body.nama_pelamar,
          req.body.telepon_pelamar,
          req.body.alamat_pelamar,
          req.body.kota_pelamar,
          req.body.provinsi_pelamar,
          req.body.kualifikasi_pelamar,
          req.body.pengalaman_kerja,
          userId,
        ]
      );

      if (rows.affectedRows === 1) {
        // Return a success response if user data updated successfully
        return res.status(200).json({
          message: 'User data updated successfully',
        });
      }

      // Return an error response if failed to update user data
      return res.status(500).json({
        message: 'Failed to update user data',
      });
    } catch (err) {
      // Handle the error during the update process
      console.error('Error during updatePelamar:', err);
      return res.status(500).json({
        message: 'Failed to update user data',
      });
    }
  } catch (err) {
    // Handle the error during token verification
    console.error('Error during token verification:', err);
    return res.status(500).json({
      message: 'Failed to update user data',
    });
  }
};

//Delete User
// Delete User
exports.deleteUser = async (req, res, next) => {
  try {
    // Retrieve the user's ID from the decoded token
    const decoded = jwt.verify(req.headers.authorization.split(' ')[1], 'the-super-strong-secrect');
    const userId = decoded.id;

    const { id } = req.params;

    // Check if there are dependent records in the `pelamar` table
    const [dependentRows] = await conn.execute('SELECT * FROM `pelamar` WHERE `id_user` = ?', [id]);

    if (dependentRows.length > 0) {
      // If there are dependent records, you can either delete them or update them as per your requirements
      // Example: Delete the dependent records
      await conn.execute('DELETE FROM `pelamar` WHERE `id_user` = ?', [id]);
    }

    // Proceed to delete the user from the `user` table
    const [result] = await conn.execute('DELETE FROM `user` WHERE `id` = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    return res.json({
      message: 'User deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};