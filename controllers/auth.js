const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs/dist/bcrypt');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');

const login = async( req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if( !usuarioDB ){
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            })
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync( password, usuarioDB.password);

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            })       
        }

        // Generara el TOKEN --> JWT
       const token = await generarJWT( usuarioDB.id );

       res.json({
           ok: true,
           token
       });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const googleSignIn = async( req, res = response ) => {

    const googleToken = req.body.token;

    console.log("googleSIGIN VER SI PASA");
    console.log(googleToken);


    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });

        let usuario;

        if ( !usuarioDB ) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });

        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            //usuario.password = ''';

        }

        // Guardar en DB

        await usuario.save();

        // Generara el TOKEN --> JWT
       const token = await generarJWT( usuarioDB.id );


        res.json({
            ok: true,
            token
        });
          
    } catch (error) {
        res.status(401).json({
          ok: false,
          msg: 'Token no es correcto'
        })
        
    }

}


const renewToken = async (req, res = response) => {

    const uid = req.uid;

    // Generar el TOKEN --> JWT
    const token = await generarJWT( uid );

    // Obtener el usuario por UID
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        token,
        usuario
    })

}

module.exports = {
    login,
    googleSignIn,
    renewToken
}