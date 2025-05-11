# Paqueteria

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Creación de la BD

````
CREATE DATABASE paqueteria;
USE paqueteria;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  fname VARCHAR(255),
  lname VARCHAR(255),
  role ENUM('customer', 'admin', 'delivery') DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Direcciones (simplificada)
CREATE TABLE addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  alias VARCHAR(50) NOT NULL COMMENT 'Casa, Trabajo, etc.',
  street VARCHAR(255) NOT NULL,
  ext_number VARCHAR(20) NOT NULL,
  int_number VARCHAR(20),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  country VARCHAR(50) DEFAULT 'México',
  instructions TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de Envíos/Paquetes (completa con los 5 estados de Estafeta)
CREATE TABLE shipments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tracking_number VARCHAR(20) UNIQUE NOT NULL,
  
  -- Información del paquete
  description VARCHAR(255) NOT NULL,
  weight DECIMAL(5,2) NOT NULL COMMENT 'en kg',
  dimensions VARCHAR(20) COMMENT 'Largo x Ancho x Alto en cm',
  package_type ENUM('documento', 'paquete', 'sobre', 'caja') NOT NULL,
  declared_value DECIMAL(10,2),
  is_fragile BOOLEAN DEFAULT FALSE,
  special_instructions TEXT,
  
  -- Relaciones
  sender_id INT NOT NULL,
  recipient_id INT NOT NULL,
  origin_address_id INT NOT NULL,
  destination_address_id INT NOT NULL,
  delivery_person_id INT NULL COMMENT 'Puede ser NULL hasta asignación',
  
  -- Estados específicos de Estafeta
  status ENUM(
    'recibido_estafeta',  -- Recibido por Estafota
    'procesamiento',      -- Procesamiento
    'transito',           -- Tránsito
    'ruta_entrega',       -- Ruta de entrega
    'entregado',          -- Entregado
    'cancelado'           -- Cancelado
  ) DEFAULT 'recibido_estafeta',
  
  -- Fechas importantes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  received_at DATETIME COMMENT 'Cuando lo recibe Estafota',
  processed_at DATETIME COMMENT 'Inicio de procesamiento',
  in_transit_at DATETIME COMMENT 'Cuando sale en tránsito',
  out_for_delivery_at DATETIME COMMENT 'Cuando sale a reparto',
  delivered_at DATETIME COMMENT 'Fecha de entrega',
  cancelled_at DATETIME COMMENT 'Fecha de cancelación',
  
  -- Información de entrega
  delivery_notes TEXT,
  recipient_signature VARCHAR(255),
  
  -- Llaves foráneas
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (recipient_id) REFERENCES users(id),
  FOREIGN KEY (origin_address_id) REFERENCES addresses(id),
  FOREIGN KEY (destination_address_id) REFERENCES addresses(id),
  FOREIGN KEY (delivery_person_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




  


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

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paqueteria'
});

// ######### LOGIN Y REGISTRO

// registro clientes
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
        return res.status(500).json({ message: 'Error en el servidor' });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }

      const user = results[0];
      const validPassword = await bcrypt.compare(password, user.password);
      
      if (!validPassword) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }

      // Generar el token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        'secreto',
        rememberMe ? {} : { expiresIn: '1h' }
      );      
      res.json({ token, name: user.fname, role: user.role, message: 'Inicio de sesión exitoso' });
    }
  );
});

// ######### TABLA CLIENTES

// Obtener clientes
app.get('/clients', (req, res) => {
  db.query('SELECT id, email, fname, lname FROM users WHERE role="customer"', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener clientes' });
    res.json(results);
  });
});

// ######### TABLA DE EMPLEADOS
// obtener empleados
app.get('/employees', (req, res) => {
  db.query('SELECT id, email, fname, lname, role FROM users WHERE role IN ("admin", "delivery")', (err, results) => {
    if (err) return res.status(500).json({ message: 'Error al obtener los empleados' });
    res.json(results);
  });
});

// registrar empleado
app.post('/registerEmployee', async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  // Validar que el rol sea válido
  if (!['admin', 'delivery'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido. Solo se permiten "admin" o "delivery".' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'INSERT INTO users (email, password, fname, lname, role) VALUES (?, ?, ?, ?, ?)',
    [email, hashedPassword, firstName, lastName, role],
    (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ message: 'Error al registrar usuario' });
      }
      res.status(201).json({ message: 'Empleado registrado correctamente' });
    }
  );
});

// Editar un empleado
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { fname, lname, email, role } = req.body;

  // Validar que el rol sea válido
  if (!['admin', 'delivery'].includes(role)) {
    return res.status(400).json({ message: 'Rol inválido. Solo se permiten "admin" o "delivery".' });
  }

  db.query(
    'UPDATE users SET fname = ?, lname = ?, email = ?, role = ? WHERE id = ?',
    [fname, lname, email, role, id],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar empleado:', err);
        return res.status(500).json({ message: 'Error al actualizar empleado' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Empleado no encontrado' });
      }

      res.status(200).json({ message: 'Empleado actualizado correctamente' });
    }
  );
});

// Eliminar un empleado
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar empleado:', err);
      return res.status(500).json({ message: 'Error al eliminar empleado' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    res.status(200).json({ message: 'Empleado eliminado correctamente' });
  });
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
