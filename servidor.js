const express = require('express');
const app = express();
const port = 3000;
const db = require("./db.js");
const Publicacion = require('./Usuario.js');
const {check, validationResult} = require('express-validator');
const multer = require('multer');
const Sequelize = require('sequelize');



app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());




app.set('view engine', 'ejs');
app.set('views', './public/views/');

// Configura Multer para manejar la carga de archivos
const storage = multer.memoryStorage();  // Almacena los datos binarios en memoria
const upload = multer({ storage: storage });




// Conéctate a la base de datos
try{
  db.authenticate();
  db.sync();
  console.log("Conexión correcta a la base de datos");

} catch(error){
  console.log(error);
}

app.post('/registro', upload.single('foto'), async (req, res)=>{
   //Validación
   await check('nombre').notEmpty().withMessage("El nombre es obligatorio").run(req);
   await check('ubicacion').notEmpty().withMessage("La ubicacion es obligatorio").run(req);
   await check('servicios').notEmpty().withMessage("Los servicios son obligatorio").run(req);
   await check('numero').notEmpty().withMessage("El numero es obligatorio").run(req);
  
   let resultado = validationResult(req);

   //Estraer los datos
   const {nombre, ubicacion, servicios, numero, horario} = req.body;
   const foto = req.file.buffer;

   if(resultado.isEmpty()){
    let mensaje;
       try{
           //Almacenar publicacion
      const publicacion =  await Publicacion.create({
          nombre,
          servicios,
          ubicacion,
          foto,
          horario,
          numero
          });
          mensaje = "Publicado con éxito"

          res.render('registrado', {mensaje})
         }catch{
          mensaje = "Error al registrar la publicación"
          res.render('registrado', {mensaje})
         }
   }
   else{
       res.render('Debes llenar todos los datos')
   }
});

app.get('/publicaciones', async(req,res)=>{
  const publicaciones = await Publicacion.findAll();
  res.render('publicaciones', { publicaciones });  
});


// En tu archivo de rutas.js o donde manejes las rutas
app.get('/masInformacion/:id', async(req, res) => {
  let idPublicacion = req.params.id; // Por ejemplo, ":123"
 
 
  
  const publicacion = await Publicacion.findOne({ where: { id: idPublicacion } });
  res.render('masInformacion', { idPublicacion, publicacion });
});


// Ruta para la búsqueda
app.post('/buscar', async (req, res) => {
  const { term } = req.body;

  try {
    const publicaciones = await Publicacion.findAll({
      where: {
        servicios: {
          [Sequelize.Op.like]: `%${term}%`,
        },
      },
    });

    // Renderiza los resultados o envíalos como JSON, según tus necesidades
    res.render('publicaciones', { publicaciones });
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
    res.status(500).send('Error interno del servidor');
  }
});





app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


