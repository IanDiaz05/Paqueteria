# Paqueteria

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Creación de la BD
```sql
CREATE DATABASE IF NOT EXISTS paqueteria;
USE paqueteria;

-- Tabla de usuarios
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fname VARCHAR(255),
  lname VARCHAR(255),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin', 'delivery') DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

update users set role = 'admin' where id = 1;

-- Tabla de direcciones (solo para uso en paquetes)
CREATE TABLE addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  zip_code VARCHAR(10) NOT NULL,
  country VARCHAR(50) DEFAULT 'México',
  reference TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de paquetes (ligada al usuario, dirección y repartidor)
CREATE TABLE packages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address_id INT,
  delivery_id INT, -- Repartidor, puede ser NULL
  description VARCHAR(255) NOT NULL,
  weight DECIMAL(5,2) NOT NULL, -- kg
  size ENUM('S', 'M', 'L') DEFAULT 'M',
  declared_value DECIMAL(10,2),
  is_fragile BOOLEAN DEFAULT FALSE,
  recipient_fname VARCHAR(100) NOT NULL,
  recipient_lname VARCHAR(100),
  recipient_phone VARCHAR(20),
  recipient_email VARCHAR(50),
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  packaged_at DATETIME,
  dispatched_at DATETIME,
  in_transit_at DATETIME,
  out_for_delivery_at DATETIME,
  delivered_at DATETIME,
  delivery_notes TEXT,
  tracking_number VARCHAR(20) UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (address_id) REFERENCES addresses(id),
  FOREIGN KEY (delivery_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
## Llenar la BD con datos random
```sql
use paqueteria;

-- Insertar usuarios
INSERT INTO users (fname, lname, email, password, role) VALUES
('Andrea', 'López', 'andrea.lopez@example.com', '12345', 'admin'),
('Marco', 'Ramírez', 'marco.ramirez@example.com', '12345', 'delivery'),
('Sandra', 'Mendoza', 'sandra.mendoza@example.com', '12345', 'delivery'),
('Luis', 'Gómez', 'luis.gomez@example.com', '12345', 'customer'),
('Carmen', 'Vega', 'carmen.vega@example.com', '12345', 'customer'),
('Jorge', 'Santos', 'jorge.santos@example.com', '12345', 'customer'),
('Lucía', 'Navarro', 'lucia.navarro@example.com', '12345', 'customer'),
('Raúl', 'Ortega', 'raul.ortega@example.com', '12345', 'customer'),
('Daniela', 'Campos', 'daniela.campos@example.com', '12345', 'customer'),
('Iván', 'Ríos', 'ivan.rios@example.com', '12345', 'customer');


-- Insertar direcciones
INSERT INTO addresses (street, city, state, zip_code, reference) VALUES
('Calle 10 #123', 'Cancún', 'Quintana Roo', '77500', 'Frente al OXXO'),
('Av. Kabah 55', 'Cancún', 'Quintana Roo', '77516', 'Cerca del parque'),
('Calle 24', 'Mérida', 'Yucatán', '97000', 'Junto al banco'),
('Blvd. Colosio 300', 'Cancún', 'Quintana Roo', '77560', 'Frente al aeropuerto'),
('Av. Juárez', 'Playa del Carmen', 'Quintana Roo', '77710', 'Por el ADO'),
('Calle 8 Nte', 'Playa del Carmen', 'Quintana Roo', '77720', 'Zona centro'),
('Av. La Luna', 'Cancún', 'Quintana Roo', '77535', 'Plaza comercial'),
('Calle 16', 'Mérida', 'Yucatán', '97100', 'Detrás de Soriana'),
('Calle 7', 'Cancún', 'Quintana Roo', '77509', 'Entre Av. Tulum y Uxmal'),
('Av. López Portillo', 'Cancún', 'Quintana Roo', '77520', 'Frente a la gasolinera'),
('Calle 2', 'Mérida', 'Yucatán', '97050', 'Col. Centro'),
('Calle 12', 'Campeche', 'Campeche', '24000', 'Cerca del mercado'),
('Av. Bonampak', 'Cancún', 'Quintana Roo', '77500', 'Torre 1'),
('Calle 50', 'Mérida', 'Yucatán', '97115', 'A espaldas del Chedraui'),
('Calle 5', 'Valladolid', 'Yucatán', '97780', 'Frente al parque principal'),
('Av. Hidalgo 67', 'León', 'Guanajuato', '37000', 'Zona centro'),
('Calle Reforma 150', 'CDMX', 'CDMX', '01000', 'Edificio azul'),
('Av. Universidad', 'Aguascalientes', 'Aguascalientes', '20100', 'Frente a UAA'),
('Calle 14 Sur', 'Puebla', 'Puebla', '72500', 'Atrás del cine'),
('Av. Revolución', 'CDMX', 'CDMX', '11800', 'Frente al monumento'),
('Av. Paseo Montejo', 'Mérida', 'Yucatán', '97070', 'Entre 31 y 33'),
('Calle 9', 'Tlaxcala', 'Tlaxcala', '90000', 'Por la terminal'),
('Av. Patria', 'Guadalajara', 'Jalisco', '44100', 'Frente al ITESO'),
('Calle 11', 'Querétaro', 'Querétaro', '76000', 'Col. Centro'),
('Av. Del Sol', 'Cancún', 'Quintana Roo', '77539', 'Cerca del Walmart'),
('Av. Huayacán', 'Cancún', 'Quintana Roo', '77500', 'Por la rotonda'),
('Calle 13', 'Mérida', 'Yucatán', '97203', 'Detrás del súper'),
('Av. Chichén Itzá', 'Cancún', 'Quintana Roo', '77500', 'Por la glorieta'),
('Av. Andrés Quintana Roo', 'Cancún', 'Quintana Roo', '77535', 'Cerca de Plaza Outlet'),
('Calle 19', 'Tulum', 'Quintana Roo', '77780', 'A lado del restaurante'),
('Av. Nichupté', 'Cancún', 'Quintana Roo', '77530', 'Zona residencial'),
('Calle 4', 'Chetumal', 'Quintana Roo', '77000', 'Centro'),
('Av. Insurgentes', 'Chetumal', 'Quintana Roo', '77010', 'Frente a la prepa'),
('Calle 6', 'Bacalar', 'Quintana Roo', '77930', 'Por la laguna'),
('Av. Costera', 'Bacalar', 'Quintana Roo', '77930', 'Vista al lago'),
('Av. 135', 'Cancún', 'Quintana Roo', '77539', 'Cerca de la gasolinera'),
('Calle 15', 'Isla Mujeres', 'Quintana Roo', '77400', 'Frente a la playa'),
('Av. Coba', 'Tulum', 'Quintana Roo', '77760', 'Zona arqueológica'),
('Av. Central', 'Cancún', 'Quintana Roo', '77516', 'Por la iglesia'),
('Calle 22', 'Puerto Morelos', 'Quintana Roo', '77580', 'Zona portuaria'),
('Av. Tulum', 'Cancún', 'Quintana Roo', '77500', 'Por el mercado 28'),
('Av. Las Torres', 'Cancún', 'Quintana Roo', '77560', 'Plaza comercial'),
('Calle 30', 'CDMX', 'CDMX', '03000', 'Cerca del metro'),
('Av. Vallarta', 'Guadalajara', 'Jalisco', '44110', 'Frente al parque'),
('Calle 31', 'Mérida', 'Yucatán', '97118', 'Col. Montecristo'),
('Av. Tecnológico', 'Toluca', 'Estado de México', '50000', 'Zona industrial'),
('Calle 17', 'Campeche', 'Campeche', '24020', 'Zona sur'),
('Calle 23', 'Tuxtla Gutiérrez', 'Chiapas', '29000', 'Col. centro'),
('Av. Central Oriente', 'San Cristóbal', 'Chiapas', '29200', 'Zona turística'),
('Av. 20 de Noviembre', 'Oaxaca', 'Oaxaca', '68000', 'Centro histórico');


-- Insertar paquetes
INSERT INTO packages (user_id, address_id, delivery_id, description, weight, size, declared_value, is_fragile,
  recipient_fname, recipient_lname, recipient_phone, recipient_email, tracking_number)
VALUES
(4, 1, 2, 'Zapatos deportivos', 1.50, 'M', 1200.00, FALSE, 'Pedro', 'Jiménez', '5551234567', 'pedro@example.com', 'TRK100001'),
(5, 2, 3, 'Laptop usada', 2.30, 'M', 8500.00, TRUE, 'Luis', 'Morales', '5552345678', 'luis@example.com', 'TRK100002'),
(6, 3, 2, 'Audífonos', 0.25, 'S', 500.00, TRUE, 'Carla', 'Pérez', '5553456789', 'carla@example.com', 'TRK100003'),
(7, 4, 3, 'Ropa de invierno', 3.10, 'L', 2000.00, FALSE, 'Sandra', 'Mejía', '5554567890', 'sandra@example.com', 'TRK100004'),
(8, 5, NULL, 'Libros', 2.00, 'M', 950.00, FALSE, 'Esteban', 'Hernández', '5555678901', 'esteban@example.com', 'TRK100005'),
(9, 6, 3, 'Tablet nueva', 0.80, 'S', 6000.00, TRUE, 'María', 'González', '5556789012', 'maria@example.com', 'TRK100006'),
(10, 7, NULL, 'Reloj inteligente', 0.40, 'S', 2200.00, TRUE, 'Antonio', 'Díaz', '5557890123', 'antonio@example.com', 'TRK100007'),
(4, 8, 3, 'Cámara fotográfica', 1.10, 'S', 7500.00, TRUE, 'Liliana', 'Mora', '5558901234', 'liliana@example.com', 'TRK100008'),
(5, 9, 2, 'Juguetes', 2.90, 'L', 1300.00, FALSE, 'Raúl', 'Sánchez', '5559012345', 'raul@example.com', 'TRK100009'),
(6, 10, NULL, 'Lámpara de escritorio', 1.20, 'M', 450.00, TRUE, 'Fabiola', 'Núñez', '5560123456', 'fabiola@example.com', 'TRK100010'),
(7, 11, 3, 'Disco duro externo', 0.50, 'S', 1200.00, TRUE, 'Pablo', 'Zamora', '5561234567', 'pablo@example.com', 'TRK100011'),
(8, 12, 2, 'Maleta de viaje', 5.50, 'L', 2200.00, FALSE, 'Alicia', 'Ruiz', '5562345678', 'alicia@example.com', 'TRK100012'),
(9, 13, 3, 'Juguete para bebé', 1.10, 'M', 380.00, FALSE, 'Lorenzo', 'Delgado', '5563456789', 'lorenzo@example.com', 'TRK100013'),
(10, 14, 2, 'Impresora', 4.00, 'L', 2800.00, TRUE, 'Isabel', 'Cortés', '5564567890', 'isabel@example.com', 'TRK100014'),
(4, 15, NULL, 'Bicicleta plegable', 6.50, 'L', 4500.00, FALSE, 'Tomás', 'Vargas', '5565678901', 'tomas@example.com', 'TRK100015'),
(5, 16, 3, 'Monitor 24 pulgadas', 3.80, 'L', 3200.00, TRUE, 'Ángela', 'Navarro', '5566789012', 'angela@example.com', 'TRK100016'),
(6, 17, 2, 'Maquillaje', 0.60, 'S', 900.00, TRUE, 'Natalia', 'Franco', '5567890123', 'natalia@example.com', 'TRK100017'),
(7, 18, 3, 'Accesorios para celular', 0.30, 'S', 350.00, FALSE, 'Ricardo', 'Valdez', '5568901234', 'ricardo@example.com', 'TRK100018'),
(8, 19, NULL, 'Jarrón artesanal', 2.20, 'M', 1100.00, TRUE, 'Yolanda', 'Castro', '5569012345', 'yolanda@example.com', 'TRK100019'),
(9, 20, 2, 'Botella de vino', 1.30, 'M', 700.00, TRUE, 'Óscar', 'Luna', '5570123456', 'oscar@example.com', 'TRK100020'),
(10, 21, 3, 'Teclado inalámbrico', 0.70, 'S', 600.00, FALSE, 'Vanessa', 'Silva', '5571234567', 'vanessa@example.com', 'TRK100021'),
(4, 22, NULL, 'Paquete de herramientas', 4.50, 'L', 1500.00, FALSE, 'Emilio', 'Carrillo', '5572345678', 'emilio@example.com', 'TRK100022'),
(5, 23, 2, 'Caja de galletas', 1.00, 'M', 300.00, FALSE, 'Lorena', 'Reyes', '5573456789', 'lorena@example.com', 'TRK100023'),
(6, 24, 3, 'Lentes de sol', 0.20, 'S', 800.00, TRUE, 'Gerardo', 'Martínez', '5574567890', 'gerardo@example.com', 'TRK100024'),
(7, 25, 2, 'Cuadro decorativo', 2.60, 'M', 1700.00, TRUE, 'Berenice', 'Campos', '5575678901', 'berenice@example.com', 'TRK100025'),
(8, 26, NULL, 'Estuche de arte', 2.00, 'M', 1300.00, FALSE, 'Alberto', 'Peña', '5576789012', 'alberto@example.com', 'TRK100026'),
(9, 27, 3, 'Ropa deportiva', 2.80, 'L', 1200.00, FALSE, 'Melissa', 'Pacheco', '5577890123', 'melissa@example.com', 'TRK100027'),
(10, 28, 2, 'Parlante portátil', 1.40, 'M', 1100.00, TRUE, 'Mauricio', 'Estrada', '5578901234', 'mauricio@example.com', 'TRK100028'),
(4, 29, 3, 'Maletín ejecutivo', 2.10, 'M', 1900.00, FALSE, 'Pamela', 'Jiménez', '5579012345', 'pamela@example.com', 'TRK100029'),
(5, 30, NULL, 'Set de cocina', 4.20, 'L', 2500.00, FALSE, 'Héctor', 'Aguirre', '5580123456', 'hector@example.com', 'TRK100030'),
(6, 31, 2, 'Base de laptop', 1.60, 'M', 650.00, FALSE, 'Ana', 'Salinas', '5581234567', 'ana@example.com', 'TRK100031'),
(7, 32, 3, 'Termo de acero', 0.80, 'S', 300.00, TRUE, 'Javier', 'Guerrero', '5582345678', 'javier@example.com', 'TRK100032'),
(8, 33, 2, 'Paquete de camisetas', 1.90, 'M', 700.00, FALSE, 'Alejandra', 'Mendoza', '5583456789', 'alejandra@example.com', 'TRK100033'),
(9, 34, NULL, 'Horno eléctrico', 5.80, 'L', 4100.00, TRUE, 'Eduardo', 'Bravo', '5584567890', 'eduardo@example.com', 'TRK100034'),
(10, 35, 3, 'Maleta escolar', 2.70, 'M', 950.00, FALSE, 'Mónica', 'Suárez', '5585678901', 'monica@example.com', 'TRK100035'),
(4, 36, 2, 'Escritorio armado', 6.30, 'L', 6000.00, TRUE, 'Joaquín', 'Gallegos', '5586789012', 'joaquin@example.com', 'TRK100036'),
(5, 37, NULL, 'Silla plegable', 3.90, 'L', 2300.00, FALSE, 'Patricia', 'López', '5587890123', 'patricia@example.com', 'TRK100037'),
(6, 38, 2, 'Envío de documentos', 0.20, 'S', 100.00, FALSE, 'Ivonne', 'Benítez', '5588901234', 'ivonne@example.com', 'TRK100038'),
(7, 39, 3, 'Cargador portátil', 0.35, 'S', 400.00, TRUE, 'Félix', 'Guzmán', '5589012345', 'felix@example.com', 'TRK100039'),
(8, 40, 2, 'Set de libros', 3.10, 'L', 1500.00, FALSE, 'Paola', 'Ortega', '5590123456', 'paola@example.com', 'TRK100040'),
(9, 41, NULL, 'Equipo de sonido', 6.70, 'L', 7100.00, TRUE, 'Erick', 'Lozano', '5591234567', 'erick@example.com', 'TRK100041'),
(10, 42, 3, 'Tetera eléctrica', 1.80, 'M', 950.00, FALSE, 'Silvia', 'Cardona', '5592345678', 'silvia@example.com', 'TRK100042'),
(4, 43, 2, 'Libreta personalizada', 0.50, 'S', 250.00, TRUE, 'César', 'Blanco', '5593456789', 'cesar@example.com', 'TRK100043'),
(5, 44, 3, 'Decoración navideña', 2.40, 'M', 850.00, FALSE, 'Elena', 'Herrera', '5594567890', 'elena@example.com', 'TRK100044'),
(6, 45, NULL, 'Tarjeta gráfica', 1.30, 'M', 5800.00, TRUE, 'Arturo', 'Silva', '5595678901', 'arturo@example.com', 'TRK100045'),
(7, 46, 2, 'Caja sorpresa', 1.10, 'M', 300.00, FALSE, 'Lucero', 'Nieto', '5596789012', 'lucero@example.com', 'TRK100046'),
(8, 47, 3, 'Cámara de seguridad', 1.90, 'M', 3100.00, TRUE, 'Ramón', 'Carranza', '5597890123', 'ramon@example.com', 'TRK100047'),
(9, 48, NULL, 'Micrófono condensador', 0.90, 'S', 1700.00, TRUE, 'Jazmín', 'Robles', '5598901234', 'jazmin@example.com', 'TRK100048'),
(6, 49, 2, 'Teclado mecánico', 0.90, 'S', 1800.00, TRUE, 'Luis', 'Soto', '5569876543', 'luis.soto@example.com', 'TRK100049'),
(7, 50, 3, 'Guitarra acústica', 4.30, 'L', 4500.00, TRUE, 'Fernando', 'Cano', '5568765432', 'fernando@example.com', 'TRK100050');

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

// ######### TABLA DE PAQUETES

// 1. Estadísticas generales del dashboard
app.get('/dashboard/stats', (req, res) =>  {
  Promise.all([
    db.promise().query('SELECT COUNT(*) as totalPackages FROM packages'),
    db.promise().query('SELECT COUNT(*) as delivered FROM packages WHERE delivered_at IS NOT NULL'),
    db.promise().query('SELECT COUNT(*) as inTransit FROM packages WHERE in_transit_at IS NOT NULL AND delivered_at IS NULL'),
    db.promise().query('SELECT COUNT(*) as pending FROM packages WHERE dispatched_at IS NULL')
  ])
  .then(([total, delivered, inTransit, pending]) => {
    res.json({
      totalShipments: total[0][0].totalPackages,
      delivered: delivered[0][0].delivered,
      inTransit: inTransit[0][0].inTransit,
      pending: pending[0][0].pending
    });
  })
  .catch(err => {
    console.error('Error en dashboard stats:', err);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  });
});

// 2. Paquetes totales para el dashboard
app.get('/packages/recent', (req, res) => {
  db.query(`
    SELECT 
      p.id,
      p.tracking_number,
      CONCAT(a.city, ', ', a.state) as destination,
      CASE 
        WHEN p.delivered_at IS NOT NULL THEN 'entregado'
        WHEN p.out_for_delivery_at IS NOT NULL THEN 'en reparto'
        WHEN p.in_transit_at IS NOT NULL THEN 'en tránsito'
        WHEN p.dispatched_at IS NOT NULL THEN 'procesamiento'
        ELSE 'registrado'
      END as status
    FROM packages p
    LEFT JOIN addresses a ON p.address_id = a.id
    ORDER BY p.registered_at DESC`,
    (err, results) => {
      if (err) {
        console.error('Error en packages/recent:', err);
        return res.status(500).json({ message: 'Error al obtener paquetes recientes' });
      }
      res.json(results);
    }
  );
}
);

// 3. distribucion tamano de paquetes
app.get('/packages/size-distribution', (req, res) => {
  db.query(`
    SELECT 
      CASE 
        WHEN size = 'S' THEN 'Chico'
        WHEN size = 'M' THEN 'Mediano'
        WHEN size = 'L' THEN 'Grande'
        ELSE 'Desconocido'
      END as size,
      COUNT(*) as total
    FROM packages
    GROUP BY size
    ORDER BY total DESC
  `, (err, results) => {
    if (err) {
      console.error('Error al obtener la distribución de tamaños:', err);
      return res.status(500).json({ message: 'Error al obtener la distribución de tamaños' });
    }
    res.json(results);
  });
});
// Estadísticas de estados de paquetes
app.get('/packages/status-distribution', (req, res) => {
  db.query(`
    SELECT 
      CASE 
        WHEN delivered_at IS NOT NULL THEN 'Entregado'
        WHEN out_for_delivery_at IS NOT NULL THEN 'En reparto'
        WHEN in_transit_at IS NOT NULL THEN 'En tránsito'
        WHEN dispatched_at IS NOT NULL THEN 'Procesando'
        ELSE 'Registrado'
      END as status,
      COUNT(*) as total,
      ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM packages), 1) as percentage
    FROM packages
    GROUP BY status
    ORDER BY total DESC
  `, (err, results) => {
    if (err) return handleError(res, err, 'Estados de paquetes');
    res.json(results);
  });
});

// Evolución mensual de envíos
app.get('/packages/monthly-trend', (req, res) => {
  db.query(`
    SELECT 
      DATE_FORMAT(registered_at, '%Y-%m') as month,
      COUNT(*) as registered,
      SUM(CASE WHEN delivered_at IS NOT NULL THEN 1 ELSE 0 END) as delivered
    FROM packages
    WHERE registered_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(registered_at, '%Y-%m')
    ORDER BY month ASC
  `, (err, results) => {
    if (err) return handleError(res, err, 'Tendencia mensual');
    res.json(results);
  });
});
// Evolución DIARIA de envíos (últimos 15 días)
app.get('/packages/daily-trend', (req, res) => {
  db.query(`
    SELECT 
      DATE(registered_at) as day,
      COUNT(*) as registered,
      SUM(CASE WHEN delivered_at IS NOT NULL THEN 1 ELSE 0 END) as delivered,
      ROUND(SUM(CASE WHEN delivered_at IS NOT NULL THEN 1 ELSE 0 END) / COUNT(*) * 100, 1) as delivery_rate
    FROM packages
    WHERE registered_at >= DATE_SUB(CURDATE(), INTERVAL 15 DAY)
    GROUP BY DATE(registered_at)
    ORDER BY day ASC
  `, (err, results) => {
    if (err) return handleError(res, err, 'Tendencia diaria');
    
    // Formatear fechas para mejor visualización (ej: "Lun 15")
    const formattedResults = results.map(item => ({
      ...item,
      day_short: new Date(item.day).toLocaleDateString('es-MX', { 
        weekday: 'short', 
        day: 'numeric' 
      }).replace('.', '') // Ej: "Lun 15"
    }));
    
    res.json(formattedResults);
  });
});

// Rendimiento de repartidores
app.get('/delivery/performance', (req, res) => {
  db.query(`
    SELECT 
      CONCAT(u.fname, ' ', u.lname) as delivery_name,
      COUNT(p.id) as total,
      SUM(CASE WHEN p.delivered_at IS NOT NULL THEN 1 ELSE 0 END) as delivered,
      ROUND(AVG(TIMESTAMPDIFF(HOUR, p.dispatched_at, p.delivered_at)), 1) as avg_hours
    FROM packages p
    JOIN users u ON p.delivery_id = u.id
    WHERE u.role = 'delivery'
    GROUP BY p.delivery_id, delivery_name
    ORDER BY delivered DESC
    LIMIT 5
  `, (err, results) => {
    if (err) return handleError(res, err, 'Rendimiento repartidores');
    res.json(results);
  });
});

// Función auxiliar para errores
function handleError(res, err, context) {
  console.error(`Error en ${context}:`, err);
  res.status(500).json({ message: `Error al obtener ${context}` });
}

// registrar paquete
app.post('/packages', (req, res) => {
  const {
    fname,
    lname,
    email,
    phone,
    street,
    city,
    state,
    zipcode,
    country,
    reference,
    description,
    weight,
    size,
    declared_value,
    is_fragile,
    delivery_notes,
    user_id,
  } = req.body;

  // Validar datos obligatorios
  if (!user_id || !description || !weight || !fname || !street || !city || !state || !zipcode) {
    return res.status(400).json({ message: 'Faltan datos obligatorios para registrar el paquete' });
  }

  // Validar tamaño del paquete
  if (!['S', 'M', 'L'].includes(size)) {
    return res.status(400).json({ message: 'El tamaño del paquete no es válido' });
  }

  // Validar peso
  if (isNaN(weight) || weight <= 0) {
    return res.status(400).json({ message: 'El peso del paquete no es válido' });
  }

  // Insertar dirección
  db.query(
    'INSERT INTO addresses (street, city, state, zip_code, country, reference) VALUES (?, ?, ?, ?, ?, ?)',
    [street, city, state, zipcode, country || 'México', reference],
    (err, addressResult) => {
      if (err) {
        console.error('Error al registrar dirección:', err);
        return res.status(500).json({ message: 'Error al registrar dirección' });
      }

      const address_id = addressResult.insertId;

      // Insertar paquete
      db.query(
        `INSERT INTO packages (
          user_id, address_id, description, weight, size, declared_value, is_fragile,
          recipient_fname, recipient_lname, recipient_phone, recipient_email, delivery_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          user_id, address_id, description, weight, size, declared_value || 0, is_fragile || false,
          fname, lname, phone, email, delivery_notes
        ],
        (err, packageResult) => {
          if (err) {
            console.error('Error al registrar paquete:', err);
            return res.status(500).json({ message: 'Error al registrar paquete' });
          }

          const packageId = packageResult.insertId;
          const trackingNumber = `PAQ-${String(packageId).padStart(6, '0')}`;

          // Actualizar el paquete con el número de guía
          db.query(
            'UPDATE packages SET tracking_number = ? WHERE id = ?',
            [trackingNumber, packageId],
            (err) => {
              if (err) {
                console.error('Error al actualizar número de guía:', err);
                return res.status(500).json({ message: 'Error al actualizar número de guía' });
              }

              // Responder con el trackingNumber
              res.status(201).json({
                message: 'Paquete registrado correctamente',
                trackingNumber: trackingNumber,
              });
            }
          );
        }
      );
    }
  );
});

// tracking de paquete
app.get('/packages/track/:trackingNumber', (req, res) => {
  const { trackingNumber } = req.params;

  db.query(`
    SELECT 
      p.id,
      p.tracking_number,
      p.description,
      CONCAT(p.recipient_fname, ' ', p.recipient_lname) as recipient_name,
      p.recipient_phone,
      p.recipient_email,
      CONCAT(a.street, ', ', a.city, ', ', a.state, ', ', a.zip_code, ', ', a.country) as destination,
      CASE 
        WHEN p.delivered_at IS NOT NULL THEN 'Entregado'
        WHEN p.out_for_delivery_at IS NOT NULL THEN 'En reparto'
        WHEN p.in_transit_at IS NOT NULL THEN 'En tránsito'
        WHEN p.dispatched_at IS NOT NULL THEN 'Procesando'
        ELSE 'Registrado'
      END as status,
      p.registered_at,
      p.packaged_at,
      p.dispatched_at,
      p.in_transit_at,
      p.out_for_delivery_at,
      p.delivered_at,
      p.delivery_notes
    FROM packages p
    LEFT JOIN addresses a ON p.address_id = a.id
    WHERE p.tracking_number = ?
  `, [trackingNumber], (err, results) => {
    if (err) {
      console.error('Error al rastrear el paquete:', err);
      return res.status(500).json({ message: 'Error al rastrear el paquete' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Paquete no encontrado' });
    }

    res.json(results[0]);
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
