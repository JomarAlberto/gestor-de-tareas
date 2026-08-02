require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./database');
const authRouter = require('./auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRouter); 

const verificarToken = require('./middlewares'); 

app.get('/tareas', verificarToken, (req, res) => {
  db.all('SELECT * FROM tareas WHERE usuario_id = ?', [req.usuarioId], (err, filas) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(filas);
  });
});


app.post('/tareas', verificarToken, (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    res.status(400).json({ error: 'El texto de la tarea es obligatorio' });
    return;
  }

  db.run(
    'INSERT INTO tareas (texto, usuario_id) VALUES (?, ?)',
    [texto, req.usuarioId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID, texto, completada: 0, usuario_id: req.usuarioId });
    }
  );
});

app.put('/tareas/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { completada } = req.body;

  db.run(
    'UPDATE tareas SET completada = ? WHERE id = ? AND usuario_id = ?',
    [completada, id, req.usuarioId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      res.json({ mensaje: 'Tarea actualizada' });
    }
  );
});

app.delete('/tareas/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  db.run(
    'DELETE FROM tareas WHERE id = ? AND usuario_id = ?',
    [id, req.usuarioId],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      res.json({ mensaje: 'Tarea eliminada' });
    }
  );
});

app.get('/tareas', (req, res) => {
  db.all('SELECT * FROM tareas', [], (err, filas) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(filas);
  });
});

app.post('/tareas', (req, res) => {
  const { texto } = req.body;

  if (!texto) {
    res.status(400).json({ error: 'El texto de la tarea es obligatorio' });
    return;
  }

  db.run('INSERT INTO tareas (texto) VALUES (?)', [texto], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID, texto, completada: 0 });
  });
});

app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const { completada } = req.body;

  db.run(
    'UPDATE tareas SET completada = ? WHERE id = ?',
    [completada, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Tarea no encontrada' });
        return;
      }
      res.json({ mensaje: 'Tarea actualizada' });
    }
  );
});

app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tareas WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Tarea no encontrada' });
      return;
    }
    res.json({ mensaje: 'Tarea eliminada' });
  });
});






app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});