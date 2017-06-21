'use strict';
const firebase = require('firebase');
const db = firebase.database();
const refUsuario = db.ref().child('usuario');
const service = require('.././services');
const objResponse = require('.././models/modelResponse');
const User = firebase.model('User');
const config = require('.././config');
const dbConfiguration = require('.././database/configDatabase');
//Estrategia de autentificacion con Google
let GoogleStrategy = require('passport-google').Strategy;
//Estrategia de autentificacion con Facebook
let FacebookStrategy = require('passport-facebook').Strategy;

//exportarmos el module para que sea manejable
module.exports = function(passport){
    //serialo al usuario para almacenarlo en la session
    passport.serializeUser((user, done)=>{
        done(null,user);
    });

    //Desearializa el objeto usuario almaenado en la sesion
    //para poder obtenerlo
    passport.deserializeUser((obj, done)=>{
        done(null,obj);
    });

    //configuramos del autentificaco con Facebook
    passport.use(new FacebookStrategy({
       clienteID        : config.facebook.id,
       clienteSecret    : config.facebook.secret,
       callbackURL      :'/aut/facebook/callback',
       profileFields    : ['id','displayName','provider','photos']
    }, ((accessToken,refreshToken,profile,done)=>{
        User.findOne({provider_id: profile.id},function(err,user){
            if(err)throw(err);
            if(!err && user!=null)return done(null,user);
            //si el usuario ya existe lo devolvera y en caso contrario
            //lo va a crear y lo guardara en la base de datos de Firebase
            let nuevo_usuario = new User({
                provider_id     : profile.id,
                provider        : profile.provider,
                name            : profile.displayName,
                photo           : profile.photos[0].value
            });
            nuevo_usuario.save(function(err){
                if(err)throw err;
                done(null,user);
            });
        });
    })

    ));
};
