# Paqueteria

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Creación de la BD

```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fname VARCHAR(100) NOT NULL,
  lname VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role ENUM('customer', 'admin', 'delivery') DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  alias VARCHAR(50) NOT NULL COMMENT 'Casa, Trabajo, etc.',
  street VARCHAR(255) NOT NULL,
  ext_number VARCHAR(20),
  int_number VARCHAR(20),
  neighborhood VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  country VARCHAR(50) DEFAULT 'México',
  instructions TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  weight DECIMAL(5,2) NOT NULL COMMENT 'en kg',
  length DECIMAL(5,2) COMMENT 'en cm',
  width DECIMAL(5,2) COMMENT 'en cm',
  height DECIMAL(5,2) COMMENT 'en cm',
  declared_value DECIMAL(10,2),
  is_fragile BOOLEAN DEFAULT FALSE,
  is_perishable BOOLEAN DEFAULT FALSE,
  is_dangerous BOOLEAN DEFAULT FALSE,
  special_instructions TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE shipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(20) UNIQUE NOT NULL,
  package_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  delivery_id INT COMMENT 'Repartidor asignado',
  origin_address_id INT NOT NULL,
  destination_address_id INT NOT NULL,
  status ENUM(
    'registrado', 
    'recolectado', 
    'en_centro', 
    'en_transito', 
    'en_reparto', 
    'entregado', 
    'fallido',
    'cancelado'
  ) DEFAULT 'registrado',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  collected_at DATETIME,
  in_transit_at DATETIME,
  out_for_delivery_at DATETIME,
  delivered_at DATETIME,
  delivery_notes TEXT,
  recipient_signature VARCHAR(255),
  
  FOREIGN KEY (package_id) REFERENCES packages(id),
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (delivery_id) REFERENCES users(id),
  FOREIGN KEY (origin_address_id) REFERENCES addresses(id),
  FOREIGN KEY (destination_address_id) REFERENCES addresses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

```

## Servidor Node para BD

### Instalar dependencias para el server
primero, crear una carpeta (en cualquier ubicacion) para instalar el servidor express js.

una vez creada la carpeta, (por ejemplo 'paqueteria_backend/'), ejecutar los siguientes comandos:
```bash
npm init -y
npm install express mysql2 bcryptjs jsonwebtoken cors body-parser
```

Despues, en la carpeta del backend crear el archivo `index.js`, y pegar el siguiente codigo:

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

### Encender Servidor Express js
Una vez hecho los pasos anteriores, encender el servidor con:
```bash
node ./index.js
```
