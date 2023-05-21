const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const conn = require('../util/db-config');

exports.login = async (req, res, next) => {
  // Validate the request body using express-validator
  const errors = validationResult(req);

  // If there are validation errors, return a 422 status code (Unprocessable Entity)
  // along with an array of error messages
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Retrieve the user record from the database based on the provided email
    const [row] = await conn.execute('SELECT * FROM `user` WHERE `email`=?', [email]);

    // Check if the user with the provided email exists
    if (row.length === 0) {
      return res.status(422).json({
        message: 'Invalid email address',
      });
    }

    // Compare the provided password with the hashed password stored in the database
    const passMatch = await bcrypt.compare(password, row[0].password);

    // Check if the password matches
    if (!passMatch) {
      return res.status(422).json({
        message: 'Incorrect password',
      });
    }

    // Generate a new JWT token with the user's ID and a secret key
    const accessToken = jwt.sign({ id: row[0].id }, 'the-super-strong-secrect', {
      expiresIn: '1h',
    });

    const refreshToken = jwt.sign({ id: row[0].id }, 'the-super-strong-refresh-token-secrect', {
      expiresIn: '1d',
    });

    // Return the generated tokens in the response
    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Perform any necessary logout operations (e.g., invalidate tokens, update user status, etc.)

    // Return a success message
    return res.json({
      message: 'Logout successful',
    });
  } catch (err) {
    next(err);
  }
};
