const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Crear la base de datos
const dbname = path.join(__dirname,'../db','javier.db');
const db = new sqlite3.Database(dbname,err=>{
  if(err) return console.error(err.message);
  console.log('Conexion Exitosa con la Base de Datos')
});

db.serialize(() => {

//------------------------------------------------------------------
// Crear la tabla "Productos" si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS agenda(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    img TEXT NOT NULL,
    numero INTEGER
    
  )
`);


});

function aggDato(req,res){
const {nombre,descripcion,img,numero} = req.body;
    
const sql = `INSERT INTO agenda(nombre, descripcion, img, numero) 
    VALUES (?, ?, ?, ?)`;

db.run(sql, [nombre,descripcion,img,numero], err => {
    if (err) return console.error(err.message);
    console.log('Registros Ingresados Correctamente a la base de datos ');
    res.redirect('/agenda');
});
}

function mostrar(req,res){
 const sql = `SELECT * FROM agenda`;
 db.all(sql,[],(err,rows)=>{
 console.log(rows,);
 if(err) return console.error(err.message);
 console.log('Leyendo Tabla agenda...')
 res.render('agenda.ejs',{modelo:rows});
})
}



function update(req,res){
  const id = req.params.id;

  const {nombre,descripcion,img,numero} = req.body;
  
  const sql = `UPDATE agenda SET nombre = ?, descripcion = ?, img = ?, numero = ? WHERE id = ?`;

  db.run(sql, [nombre,descripcion,img,numero,id], err => {
  if (err) return console.error(err.message);
  console.log(`contacto actualizado = contacto : ${id}`);
  res.redirect('/agenda');
  });

}


function mostrarUpdate(req,res){

  const id = req.params.id;
  const sql = `SELECT * FROM agenda WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return console.error(err.message);
    res.render('update.ejs', {modelo:row});
  })

}

function borrar(req,res){
 const id = req.params.id;
  console.log('Consulta Eliminar');
  const sql = `
    DELETE FROM agenda WHERE id = ?
  `;
  db.run(sql, [id], err => {
    if (err) {
      res.status(500).send({ error: err.message });
      return console.error(err.message);
    }
    console.log('contacto eliminado');
    res.redirect('/agenda');
  });
}

function mostrarborrar(req,res){
  const id = req.params.id;
const sql = `SELECT * FROM agenda WHERE id = ?`;
db.get(sql, [id], (err, row) => {
  if (err){
    res.status(500).send({ error: err.message });
    return console.error(err.message);
  }
  res.render('delete.ejs', { modelo:row});
});
}




//_-------------------------------------------------
module.exports={
 aggDato,
 mostrar,
 update,
 mostrarUpdate,
 borrar,
 mostrarborrar
}