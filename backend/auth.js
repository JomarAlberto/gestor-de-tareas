require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./database');

const router = express.Router();

router.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    res.status(400).json({ error: 'Nombre, email y password son obligatorios' });
    return;
  }

  try {
    const passwordHasheado = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, passwordHasheado],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            res.status(409).json({ error: 'Ese email ya está registrado' });
          } else {
            res.status(500).json({ error: err.message });
          }
          return;
        }
        res.status(201).json({ id: this.lastID, nombre, email });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar el registro' });
  }
});

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email y password son obligatorios' });
    return;
  }

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, usuario) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!usuario) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    if (!passwordCorrecta) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
  });
});

module.exports = router;