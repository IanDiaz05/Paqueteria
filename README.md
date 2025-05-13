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
INSERT INTO users (email, password, fname, lname, role) VALUES
('cliente1@email.com', 'password123', 'Juan', 'Pérez', 'customer'),
('cliente2@email.com', 'password123', 'María', 'Gómez', 'customer'),
('admin@empresa.com', 'admin123', 'Carlos', 'Ruiz', 'admin'),
('repartidor1@empresa.com', 'delivery123', 'Luis', 'Martínez', 'delivery'),
('repartidor2@empresa.com', 'delivery123', 'Ana', 'Sánchez', 'delivery');

-- Insertar direcciones
INSERT INTO addresses (street, city, state, zip_code, country, reference) VALUES
('Av. Principal', 'Ciudad de México', 'CDMX', '06000', 'MEX', 'Casa techo de lamina'),
('Calle Reforma', 'Ciudad de México', 'CDMX', '06600', 'USA', 'homeless afuera'),
('Boulevard López Mateos', 'Guadalajara', 'Jalisco', '44100', 'ESP', ''),
('Paseo de la Reforma', 'Ciudad de México', 'CDMX', '06500', 'USA', ''),
('Calle Norte', 'Monterrey', 'Nuevo León', '64000', 'MEX', 'detras de oxxo');

-- Insertar paquetes
INSERT INTO packages (
  user_id, address_id, delivery_id, description, weight, size, declared_value,
  is_fragile, recipient_fname, recipient_lname, recipient_phone, recipient_email,
  registered_at, packaged_at, dispatched_at, in_transit_at, out_for_delivery_at,
  delivered_at, delivery_notes, tracking_number
) VALUES
(1, 2, 3, 'Laptop HP Pavilion', 2.50, 'M', 1200.00, TRUE, 'Carlos', 'Ramírez', '5551234567', 'carlos.r@example.com',
 '2025-05-01 09:00:00', '2025-05-01 10:00:00', '2025-05-01 12:00:00', '2025-05-01 15:00:00', '2025-05-01 17:00:00', '2025-05-01 19:00:00', 'Handle with care', 'PAQ-000001'),
(4, 5, NULL, 'Box of books', 5.00, 'L', 200.00, FALSE, 'Lucía', 'Gómez', '5559876543', 'lucia.g@example.com',
 '2025-05-02 08:30:00', '2025-05-02 09:00:00', NULL, NULL, NULL, NULL, 'Drop at front door', 'PAQ-000002'),
(2, 3, 1, 'Smartphone Samsung Galaxy', 0.30, 'S', 850.00, TRUE, 'Miguel', 'Torres', '5551112222', 'miguel.t@example.com',
 '2025-05-03 14:00:00', '2025-05-03 15:00:00', '2025-05-03 16:00:00', '2025-05-03 18:00:00', '2025-05-03 19:00:00', '2025-05-03 20:00:00', 'Call before delivery', 'PAQ-000003'),
(7, 6, 5, 'Gift package', 1.20, 'S', 50.00, FALSE, 'Ana', NULL, '5553334444', 'ana@example.com',
 '2025-05-04 11:00:00', '2025-05-04 12:00:00', '2025-05-04 13:00:00', NULL, NULL, NULL, NULL, 'PAQ-000004'),
(3, 1, 2, 'Kitchen appliance', 3.75, 'L', 400.00, TRUE, 'Pedro', 'López', '5556667777', 'pedro.l@example.com',
 '2025-05-05 10:15:00', '2025-05-05 11:00:00', '2025-05-05 13:00:00', '2025-05-05 16:00:00', '2025-05-05 18:00:00', NULL, 'Deliver after 6 PM', 'PAQ-000005');

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
      CONCAT('PAQ-', LPAD(p.id, 6, '0')) as tracking_number,
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

// nuevo paquete
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
    user_id
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

          res.status(201).json({ message: 'Paquete registrado correctamente' });
        }
      );
    }
  );
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
