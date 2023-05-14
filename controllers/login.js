const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const conn = require('../db-config');


exports.login = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT * FROM `pelamar` WHERE `email_pelamar`=?",
            [req.body.email_pelamar]
          );

        if (row.length === 0) {
            return res.status(422).json({
                message: "Invalid email address",
            });
        }

        const passMatch = await bcrypt.compare(req.body.password_pelamar, row[0].password_pelamar);
        if(!passMatch){
            return res.status(422).json({
                message: "Incorrect password",
            });
        }

        const theToken = jwt.sign({id:row[0].id},'the-super-strong-secrect',{ expiresIn: '30s' });

        return res.json({
            token:theToken
        });

    }
    catch(err){
        next(err);
    }
}