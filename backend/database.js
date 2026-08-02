const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./tareas.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT NOT NULL,
    completada INTEGER DEFAULT 0
  )
`);

module.exports = db;