# Paqueteria

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Servidor Node para BD

```js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a MySQL (configura con tus datos de XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paqueteria'
});

// Ruta de registro
app.post('/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  db.query(
    'INSERT INTO users (email, password, fname, lname) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, firstName,lastName],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Error al registrar' });
      res.status(201).json({ message: 'Usuario registrado correctamente' });
    }
  );
});

// Ruta de login
app.post('/login', (req, res) => {
  const { email, password, rememberMe } = req.body;

  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        console.error('Error en la base de datos:', err);
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (results.length === 0) {
        console.warn('Usuario no encontrado:', email);
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.warn('Contraseña incorrecta para el usuario:', email);
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }

      // Generar el token
      const token = jwt.sign(
        { id: user.id },
        'secreto',
        rememberMe ? {} : { expiresIn: '1h' }
      );

      console.log('Inicio de sesión exitoso para el usuario:', email);  
      res.json({ token, name: user.fname, role: user.role, user_id: user.id, message: 'Inicio de sesión exitoso' });
    }
  );
});

// Ruta protegida (ejemplo para dashboard)
app.get('/dashboard', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Acceso denegado');
  
  try {
    const verified = jwt.verify(token, 'secreto');
    res.json({ message: `Bienvenido al dashboard, usuario ${verified.id}` });
  } catch (err) {
    res.status(400).send('Token inválido');
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

```