# Paqueteria

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Creación de la BD

````
create database paqueteria;
use paqueteria;

-- Primero creamos las tablas sin relaciones
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  fname VARCHAR(255),
  lname VARCHAR(255),
  role ENUM('customer', 'admin', 'delivery') DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  type tinyint,
  alias VARCHAR(50) NOT NULL COMMENT 'Casa, Trabajo, etc.',
  street VARCHAR(255) NOT NULL,
  ext_number VARCHAR(20),
  int_number VARCHAR(20),
  neighborhood VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  country VARCHAR(50) DEFAULT 'México',
  instructions TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  weight DECIMAL(5,2) NOT NULL COMMENT 'en kg',
  size ENUM('S', 'M', 'L'),
  declared_value DECIMAL(10,2),
  is_fragile BOOLEAN DEFAULT FALSE,
  special_instructions TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ahora creamos shipments sin las FOREIGN KEY
CREATE TABLE shipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(20) UNIQUE NOT NULL,
  package_id INT NOT NULL,
  sender_id INT NOT NULL,
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
  delivered_at DATETIME,
  delivery_notes TEXT,
  recipient_signature VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE addresses ADD CONSTRAINT fk_address_user
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE shipments ADD CONSTRAINT fk_shipment_package
FOREIGN KEY (package_id) REFERENCES packages(id);

ALTER TABLE shipments ADD CONSTRAINT fk_shipment_sender
FOREIGN KEY (sender_id) REFERENCES users(id);

ALTER TABLE shipments ADD CONSTRAINT fk_shipment_delivery
FOREIGN KEY (delivery_id) REFERENCES users(id);

ALTER TABLE shipments ADD CONSTRAINT fk_shipment_origin
FOREIGN KEY (origin_address_id) REFERENCES addresses(id);

ALTER TABLE shipments ADD CONSTRAINT fk_shipment_destination
FOREIGN KEY (destination_address_id) REFERENCES addresses(id);
  


````
## Llenar la BD con datos random
````
-- Insertar usuarios
INSERT INTO users (email, password, fname, lname, role) VALUES
('cliente1@email.com', 'password123', 'Juan', 'Pérez', 'customer'),
('cliente2@email.com', 'password123', 'María', 'Gómez', 'customer'),
('admin@empresa.com', 'admin123', 'Carlos', 'Ruiz', 'admin'),
('repartidor1@empresa.com', 'delivery123', 'Luis', 'Martínez', 'delivery'),
('repartidor2@empresa.com', 'delivery123', 'Ana', 'Sánchez', 'delivery');

-- Insertar direcciones
INSERT INTO addresses (user_id, type, alias, street, ext_number, neighborhood, city, state, zip_code, country) VALUES
(1, 1, 'Casa', 'Av. Principal', '123', 'Centro', 'Ciudad de México', 'CDMX', '06000', 'México'),
(1, 2, 'Trabajo', 'Calle Reforma', '456', 'Juárez', 'Ciudad de México', 'CDMX', '06600', 'México'),
(2, 1, 'Departamento', 'Boulevard López Mateos', '789', 'San Ángel', 'Guadalajara', 'Jalisco', '44100', 'México'),
(3, 1, 'Oficina Central', 'Paseo de la Reforma', '101', 'Cuauhtémoc', 'Ciudad de México', 'CDMX', '06500', 'México'),
(4, 1, 'Domicilio Repartidor', 'Calle Norte', '202', 'Industrial', 'Monterrey', 'Nuevo León', '64000', 'México');

-- Insertar paquetes
INSERT INTO packages (description, weight, size, declared_value, is_fragile, special_instructions) VALUES
('Documentos importantes', 0.5, 'S', 500.00, FALSE, 'Entregar en recepción'),
('Laptop nueva', 2.3, 'M', 15000.00, TRUE, 'Manejar con cuidado - frágil'),
('Ropa deportiva', 1.8, 'M', 1200.00, FALSE, NULL),
('Jarrones de cerámica', 4.5, 'L', 3500.00, TRUE, 'FRÁGIL - No voltear'),
('Libros académicos', 3.2, 'L', 800.00, FALSE, NULL);

-- Insertar envíos
INSERT INTO shipments (tracking_number, package_id, sender_id, delivery_id, origin_address_id, destination_address_id, status, created_at) VALUES
('PAQ123456789', 1, 1, 4, 1, 2, 'entregado', '2023-11-01 09:00:00'),
('PAQ987654321', 2, 2, 5, 3, 1, 'en_reparto', '2023-11-02 10:30:00'),
('PAQ456123789', 3, 1, 4, 2, 3, 'en_transito', '2023-11-03 11:15:00'),
('PAQ789456123', 4, 2, NULL, 3, 1, 'registrado', '2023-11-04 14:20:00'),
('PAQ321654987', 5, 1, 5, 1, 3, 'recolectado', '2023-11-05 16:45:00');

-- Actualizar algunos envíos con fechas de entrega
UPDATE shipments SET delivered_at = '2023-11-01 16:30:00', recipient_signature = 'Juan Pérez' WHERE id = 1;
UPDATE shipments SET delivered_at = '2023-11-03 13:45:00', recipient_signature = 'María Gómez' WHERE id = 2;
````

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
      console.log('User:', user); // Verifica el rol del usuario

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.warn('Contraseña incorrecta para el usuario:', email);
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }

      // Generar el token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        'secreto',
        rememberMe ? {} : { expiresIn: '1h' }
      );      

      console.log('Inicio de sesión exitoso para el usuario:', email);  
      res.json({ token, name: user.fname, role: user.role, message: 'Inicio de sesión exitoso' });
    }
  );
});

// Ruta protegida (ejemplo para dashboard)
app.get('/dashboard', (req, res) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Acceso denegado');
  
  try {
    const verified = jwt.verify(token, 'secreto');
    if (verified.role !== 'admin') {
      return res.status(403).send('Acceso denegado: No tienes permisos suficientes');
    }
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
