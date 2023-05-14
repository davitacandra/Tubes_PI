const conn = require('../db-config');

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Perform the deletion operation in the database
    const [result] = await conn.execute(
      'DELETE FROM `pelamar` WHERE `id` = ?',
      [id]
    );

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
