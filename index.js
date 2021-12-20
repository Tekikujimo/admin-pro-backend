const express = require('express');
var cors = require('cors')
require('dotenv').config();

const  { dbConnection } = require('./database/config')

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

//Base de datos
dbConnection();

//console.log(process.env)

//diegomongodb
//9S82BXCxi83n0wkr


// Rutas
app.get('/', (req, res) => {

    res.status(400).json({
        ok: true,
        msg: 'Hola Mundo'
    })

});

app.listen( process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto ' + process.env.PORT);
})