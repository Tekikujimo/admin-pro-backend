const { response } = require('express');

const Medico = require ('../models/medico');

const Hospital = require ('../models/hospital');


const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
                                .populate('usuario','nombre img')
                                .populate('hospital','nombre img');

    res.json({
        ok: true,
        medicos
    })
}


const getMedicoById = async (req, res = response) => {


    try {
        const id = req.params.id;
        const medico = await Medico.findById(id).populate('usuario','nombre img')
                                                 .populate('hospital','nombre img');  
    
    res.json({
      ok: true,
      medico
    });

    } catch (error) {
        console.log(error);

        res.json({
         ok: true,
         msg: 'Médico no encontrado'
        });  
    }


}


const crearMedico = async (req, res = response) =>  {

    const uid = req.uid;

    const medico = new Medico({ 
            usuario: uid,
            ...req.body 
        });


    console.log(uid);

    try {

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
    
}

const actualizarMedico = async (req, res = response) => {


    try {

        const id = req.params.id;
        const uid = req.uid;
        const hospitalId = req.body.hospital;
        const medico = await Medico.findById(id);

        if (!medico) {
            return  res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por Id'
            })
        }

        
        let cambiosMedico = {
            ...req.body,
            usuario: uid        
        }

        if(hospitalId) {

            const hospital = await Hospital.findById(hospitalId);
            
            if(!hospital){
                return  res.status(404).json({
                    ok: false,
                    msg: 'Hospital no encontrado por Id'
                })
            }

            cambiosMedico.hospital = hospital;
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new : true });

        res.json({
            ok: true,
            medico : medicoActualizado
        })
        
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}


const borrarMedico = async (req, res = response) => {

    try {
        const id = req.params.id;
        const medico = await Medico.findById(id);

        
        if (!medico) {
            return  res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por Id'
            })
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Médico eliminado'
        });
        
    } catch (error) {
        res.status(404).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }


}




module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}