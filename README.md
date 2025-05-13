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
INSERT INTO packages (
  user_id, address_id, delivery_id, description, weight, size, declared_value, is_fragile,
  recipient_fname, recipient_lname, recipient_phone, recipient_email,
  registered_at, packaged_at, dispatched_at, in_transit_at, out_for_delivery_at, delivered_at,
  delivery_notes, tracking_number
) VALUES
(7, 49, 6, 'Laptop usada', 2.74, 'L', 4962.09, FALSE, 'Judith', 'Peres', '+48(7)6475938242', 'oscar92@despacho.net', '2025-05-04 10:37:00', '2025-05-04 13:37:00', NULL, NULL, NULL, NULL, 'Pendiente de asignar repartidor', 'PAQ-000001'),
(5, 9, 1, 'Pelotas deportivas', 8.03, 'L', 9831.3, TRUE, 'Benito', 'Moreno', '(593)877-8408x016', 'pmerino@barajas-espino.com', '2025-05-03 08:46:00', NULL, NULL, NULL, NULL, NULL, 'Daños leves en empaque', 'PAQ-000002'),
(8, 36, 1, 'Tablet', 4.45, 'L', 6476.15, TRUE, 'Evelio', 'Collado', '(711)587-1484x1858', 'maria19@mateo.com', '2025-05-05 11:28:00', '2025-05-05 14:28:00', NULL, NULL, NULL, NULL, 'Requiere reprogramar entrega', 'PAQ-000003'),
(1, 6, 6, 'Zapatos deportivos', 6.2, 'M', 2590.33, FALSE, 'Dulce María', 'Esparza', '(094)711-2201', 'octavio33@hotmail.com', '2025-05-01 09:58:00', '2025-05-01 12:58:00', NULL, NULL, NULL, NULL, 'Pendiente de asignar repartidor', 'PAQ-000004'),
(9, 29, 1, 'Audífonos', 9.93, 'L', 9980.12, FALSE, 'Rolando', 'Perea', '1-477-515-9179x5330', 'garayjose-emilio@gmail.com', '2025-05-01 10:35:00', '2025-05-01 13:35:00', NULL, NULL, NULL, NULL, 'Daños leves en empaque', 'PAQ-000005'),
(9, 14, 9, 'Suplementos', 5.96, 'M', 1097.99, FALSE, 'Isabela', 'Polanco', '+12(3)0989101399', 'xbustos@arce-zelaya.com', '2025-05-03 12:15:00', '2025-05-03 15:15:00', NULL, NULL, NULL, NULL, 'Pendiente de asignar repartidor', 'PAQ-000006'),
(1, 40, 10, 'Cámara digital', 4.87, 'S', 6851.49, TRUE, 'Eloisa', 'Escalante', '1-173-008-6914x13145', 'anelsantacruz@yahoo.com', '2025-05-02 08:53:00', NULL, NULL, NULL, NULL, NULL, 'Requiere reprogramar entrega', 'PAQ-000007'),
(7, 46, 8, 'Cámara digital', 5.31, 'S', 8524.96, FALSE, 'Alfredo', 'Ybarra', '06345792302', 'olga41@del.biz', '2025-05-05 10:28:00', '2025-05-05 12:28:00', '2025-05-05 14:28:00', '2025-05-05 16:28:00', '2025-05-05 18:28:00', '2025-05-05 20:28:00', 'Daños leves en empaque', 'PAQ-000008'),
(2, 21, 9, 'Ropa de invierno', 4.97, 'L', 3485.65, TRUE, 'Rebeca', 'Sauceda', '(564)280-7150', 'eveliorosario@yahoo.com', '2025-05-02 08:46:00', '2025-05-02 10:46:00', '2025-05-02 12:46:00', NULL, NULL, NULL, 'Pendiente de asignar repartidor', 'PAQ-000009'),
(6, 28, NULL, 'Ropa de invierno', 7.87, 'L', 2343.98, TRUE, 'Santiago', 'Loera', '(599)246-6109x35233', 'avanegas@gmail.com', '2025-05-01 08:40:00', NULL, NULL, NULL, NULL, NULL, 'Rechazado por el destinatario', 'PAQ-000010'),
(2, 26, 1, 'Tablet', 8.37, 'S', 556.64, TRUE, 'Karla', 'Vanegas', '(027)142-7878x900', 'hugo70@yahoo.com', '2025-05-02 09:45:00', NULL, NULL, NULL, NULL, NULL, 'Paquete fuera para entrega hoy', 'PAQ-000011'),
(1, 44, NULL, 'Suplementos', 4.37, 'S', 8391.85, TRUE, 'Elena', 'Ulibarri', '120-665-0300x89131', 'gilberto21@osorio.com', '2025-05-02 08:41:00', '2025-05-02 10:41:00', '2025-05-02 12:41:00', NULL, NULL, NULL, 'No se encontró al destinatario', 'PAQ-000012'),
(1, 39, 1, 'Gafas de sol', 2.15, 'M', 9063.11, FALSE, 'María Cristina', 'Carrillo', '285-124-0003', 'josefina90@hotmail.com', '2025-05-05 09:44:00', '2025-05-05 11:44:00', '2025-05-05 13:44:00', NULL, NULL, NULL, 'Pendiente de asignar repartidor', 'PAQ-000013'),
(3, 22, 8, 'Cámara digital', 1.35, 'M', 6722.94, TRUE, 'Sandra', 'Saldaña', '1-765-823-6940x22455', 'mirelessilvano@gmail.com', '2025-05-04 13:26:00', '2025-05-04 15:26:00', '2025-05-04 17:26:00', '2025-05-04 19:26:00', '2025-05-04 21:26:00', NULL, 'Entregado a vecino', 'PAQ-000014'),
(5, 10, 8, 'Zapatos deportivos', 4.69, 'S', 3491.98, TRUE, 'Alma', 'Jimínez', '(294)568-2417', 'manzanaresdiego@madrid-padron.com', '2025-05-05 10:08:00', '2025-05-05 12:08:00', '2025-05-05 14:08:00', NULL, NULL, NULL, 'Registrado pero aún no empacado', 'PAQ-000015'),
(6, 38, 10, 'Pelotas deportivas', 1.5, 'M', 4002.57, FALSE, 'Helena', 'Pedroza', '01877551717', 'madridisrael@hotmail.com', '2025-05-01 08:38:00', NULL, NULL, NULL, NULL, NULL, 'Daños leves en empaque', 'PAQ-000016'),
(3, 16, 3, 'Ropa interior', 3.91, 'L', 5767.88, FALSE, 'Cristal', 'de la Crúz', '961-113-3060x16884', 'tviera@hotmail.com', '2025-05-01 11:55:00', '2025-05-01 13:55:00', '2025-05-01 15:55:00', '2025-05-01 17:55:00', '2025-05-01 19:55:00', NULL, 'No se encontró al destinatario', 'PAQ-000017'),
(2, 17, 2, 'Ropa interior', 5.37, 'M', 9098.79, TRUE, 'Esteban', 'Piña', '05349263511', 'hferrer@otero.com', '2025-05-01 11:20:00', '2025-05-01 13:20:00', '2025-05-01 15:20:00', '2025-05-01 17:20:00', '2025-05-01 19:20:00', '2025-05-01 21:20:00', 'Entregado a vecino', 'PAQ-000018'),
(4, 36, 10, 'Audífonos', 8.41, 'S', 9870.85, FALSE, 'Esmeralda', 'Concepción', '03765821972', 'fsoliz@hotmail.com', '2025-05-04 10:00:00', '2025-05-04 12:00:00', '2025-05-04 14:00:00', NULL, NULL, NULL, 'Requiere reprogramar entrega', 'PAQ-000019'),
(10, 7, 3, 'Ropa de invierno', 6.16, 'S', 8761.81, FALSE, 'Irene', 'Samaniego', '389.305.5508x249', 'sverduzco@barraza.com', '2025-05-02 08:30:00', '2025-05-02 11:30:00', NULL, NULL, NULL, NULL, 'En tránsito - última ubicación: CDMX', 'PAQ-000020'),
(1, 18, 7, 'Ropa de invierno', 8.64, 'S', 6604.96, FALSE, 'Andrés', 'Garza', '040-752-2758', 'velaaurora@hotmail.com', '2025-05-01 14:09:00', '2025-05-01 17:09:00', NULL, NULL, NULL, NULL, 'Entregado sin novedades', 'PAQ-000021'),
(4, 44, 4, 'Suplementos', 3.28, 'M', 9396.7, TRUE, 'Norma', 'Zapata', '06348967699', 'abregodulce@industrias.com', '2025-05-05 13:31:00', '2025-05-05 15:31:00', '2025-05-05 17:31:00', '2025-05-05 19:31:00', '2025-05-05 21:31:00', NULL, 'Requiere reprogramar entrega', 'PAQ-000022'),
(3, 14, 6, 'Material escolar', 3.05, 'S', 1680.03, FALSE, 'Miguel', 'Iglesias', '(666)022-3450', 'jperales@zarate.com', '2025-05-03 14:23:00', '2025-05-03 17:23:00', NULL, NULL, NULL, NULL, 'Rechazado por el destinatario', 'PAQ-000023'),
(1, 3, 4, 'Juguetes', 1.66, 'L', 3037.4, FALSE, 'Jesús', 'Patiño', '+97(6)7017200992', 'ulloavioleta@yahoo.com', '2025-05-05 09:18:00', NULL, NULL, NULL, NULL, NULL, 'Paquete fuera para entrega hoy', 'PAQ-000024'),
(1, 20, 2, 'Bicicleta', 7.34, 'M', 4151.06, FALSE, 'Eloisa', 'Olivera', '109.795.1942x641', 'oroscomaria@espino-resendez.com', '2025-05-03 11:06:00', NULL, NULL, NULL, NULL, NULL, 'No se encontró al destinatario', 'PAQ-000025'),
(8, 22, 5, 'Ropa de invierno', 4.9, 'L', 5077.8, TRUE, 'Alvaro', 'Arenas', '408.993.3188x684', 'luisvalles@bravo.com', '2025-05-03 10:47:00', '2025-05-03 13:47:00', NULL, NULL, NULL, NULL, 'Pendiente de asignar repartidor', 'PAQ-000026'),
(10, 25, 10, 'Audífonos', 0.85, 'S', 2140.79, TRUE, 'Berta', 'Pelayo', '076-607-5415', 'munozalta-gracia@montero-dominguez.com', '2025-05-01 11:00:00', NULL, NULL, NULL, NULL, NULL, 'Requiere reprogramar entrega', 'PAQ-000027'),
(9, 19, 7, 'Bolsas de mano', 7.93, 'L', 6857.17, FALSE, 'Josefina', 'Batista', '230.310.4509x3227', 'tmontanez@grupo.com', '2025-05-01 10:14:00', '2025-05-01 13:14:00', NULL, NULL, NULL, NULL, 'Pendiente de asignar repartidor', 'PAQ-000028'),
(7, 13, 5, 'Ropa de invierno', 0.83, 'L', 470.67, FALSE, 'Mario', 'Loya', '(852)911-8942', 'carmengarica@yahoo.com', '2025-05-02 08:31:00', '2025-05-02 11:31:00', NULL, NULL, NULL, NULL, 'Entregado sin novedades', 'PAQ-000029'),
(4, 40, 2, 'Ropa de invierno', 2.14, 'M', 3744.09, TRUE, 'Nancy', 'Guerra', '245.602.9061', 'lucialuna@collado.com', '2025-05-01 12:31:00', NULL, NULL, NULL, NULL, NULL, 'Entregado a vecino', 'PAQ-000030'),
(7, 34, 7, 'Teléfono celular', 8.37, 'M', 6423.63, TRUE, 'Teodoro', 'Mota', '03758066065', 'jose-emiliolozada@yahoo.com', '2025-05-05 12:59:00', '2025-05-05 15:59:00', NULL, NULL, NULL, NULL, 'Daños leves en empaque', 'PAQ-000031'),
(6, 3, 8, 'Libros', 8.77, 'L', 7884.83, FALSE, 'Aurora', 'Escalante', '04189276266', 'maria-elenamolina@corporacin.info', '2025-05-05 10:45:00', '2025-05-05 12:45:00', '2025-05-05 14:45:00', '2025-05-05 16:45:00', '2025-05-05 18:45:00', NULL, 'Entregado sin novedades', 'PAQ-000032'),
(2, 15, 2, 'Laptop usada', 3.14, 'M', 3439.82, TRUE, 'Emilia', 'Lozano', '+79(7)0341489267', 'igomez@lemus.com', '2025-05-02 14:41:00', '2025-05-02 17:41:00', NULL, NULL, NULL, NULL, 'Entregado a vecino', 'PAQ-000033'),
(9, 33, NULL, 'Material escolar', 1.09, 'L', 7626.89, TRUE, 'Yolanda', 'Arevalo', '+46(8)9671454391', 'iglesiashilda@casanova-tamayo.com', '2025-05-04 14:13:00', '2025-05-04 16:13:00', '2025-05-04 18:13:00', NULL, NULL, NULL, 'No se encontró al destinatario', 'PAQ-000034'),
(7, 39, 9, 'Herramientas', 8.54, 'S', 6638.45, TRUE, 'Dalia', 'Barreto', '(448)298-3816x864', 'knieto@hotmail.com', '2025-05-02 10:32:00', '2025-05-02 13:32:00', NULL, NULL, NULL, NULL, 'No se encontró al destinatario', 'PAQ-000035'),
(5, 20, 6, 'Gafas de sol', 8.14, 'S', 1805.2, TRUE, 'Citlali', 'Cortez', '01669728457', 'mateosaenz@hotmail.com', '2025-05-02 10:46:00', '2025-05-02 13:46:00', NULL, NULL, NULL, NULL, 'Entregado sin novedades', 'PAQ-000036'),
(8, 27, 2, 'Bolsas de mano', 8.92, 'L', 7228.45, TRUE, 'Mónica', 'Matías', '074.270.9305x760', 'ortegaabraham@arguello-carrillo.com', '2025-05-03 11:02:00', '2025-05-03 14:02:00', NULL, NULL, NULL, NULL, 'Entregado sin novedades', 'PAQ-000037'),
(2, 31, 2, 'Zapatos deportivos', 0.52, 'L', 1500.48, FALSE, 'Genaro', 'Loya', '329.431.6756x25662', 'ofeliamata@gmail.com', '2025-05-01 13:35:00', '2025-05-01 16:35:00', NULL, NULL, NULL, NULL, 'No se encontró al destinatario', 'PAQ-000038'),
(2, 4, 9, 'Ropa interior', 6.22, 'M', 6574.63, FALSE, 'Emilio', 'Escobar', '1-566-763-3739x060', 'escobarjose@delgadillo.org', '2025-05-02 11:51:00', '2025-05-02 13:51:00', '2025-05-02 15:51:00', '2025-05-02 17:51:00', '2025-05-02 19:51:00', '2025-05-02 21:51:00', 'En tránsito - última ubicación: CDMX', 'PAQ-000039'),
(9, 13, NULL, 'Gafas de sol', 4.56, 'S', 4663.61, TRUE, 'Héctor', 'Briseño', '1-845-670-8869x77473', 'alma00@gmail.com', '2025-05-01 08:31:00', '2025-05-01 11:31:00', NULL, NULL, NULL, NULL, 'Requiere reprogramar entrega', 'PAQ-000040'),
(10, 37, 3, 'Herramientas', 1.12, 'L', 7838.08, FALSE, 'Jerónimo', 'Acosta', '(021)639-6837', 'sandra19@matos-medrano.net', '2025-05-05 10:07:00', NULL, NULL, NULL, NULL, NULL, 'Rechazado por el destinatario', 'PAQ-000041'),
(7, 6, 1, 'Reloj inteligente', 0.82, 'M', 7783.42, TRUE, 'María Eugenia', 'Meléndez', '080-351-3853', 'zacarias44@hernandez.com', '2025-05-04 11:43:00', '2025-05-04 13:43:00', '2025-05-04 15:43:00', '2025-05-04 17:43:00', '2025-05-04 19:43:00', NULL, 'Registrado pero aún no empacado', 'PAQ-000042'),
(2, 23, 1, 'Ropa de invierno', 3.72, 'S', 3585.36, TRUE, 'Alvaro', 'Malave', '(107)770-6777x1113', 'lilianagallardo@bermudez.biz', '2025-05-01 14:14:00', '2025-05-01 17:14:00', NULL, NULL, NULL, NULL, 'Pendiente de asignar repartidor', 'PAQ-000043'),
(4, 1, 3, 'Ropa de invierno', 7.53, 'M', 3817.48, TRUE, 'Alfredo', 'Dueñas', '732.455.6184', 'margarita89@teran.com', '2025-05-05 09:54:00', NULL, NULL, NULL, NULL, NULL, 'No se encontró al destinatario', 'PAQ-000044'),
(2, 31, 5, 'Cámara digital', 1.48, 'S', 3749.95, FALSE, 'Adriana', 'Casanova', '126.334.0886x0164', 'estela84@laboratorios.net', '2025-05-03 10:59:00', '2025-05-03 12:59:00', '2025-05-03 14:59:00', NULL, NULL, NULL, 'Rechazado por el destinatario', 'PAQ-000045'),
(2, 7, 8, 'Material escolar', 3.22, 'M', 8997.22, TRUE, 'Homero', 'Menchaca', '574.922.0885', 'ceballosleonardo@gmail.com', '2025-05-02 10:32:00', '2025-05-02 12:32:00', '2025-05-02 14:32:00', NULL, NULL, NULL, 'Entregado a vecino', 'PAQ-000046'),
(1, 9, 9, 'Zapatos deportivos', 4.06, 'L', 917.47, FALSE, 'Diana', 'Segovia', '02379332365', 'ncardenas@soto.com', '2025-05-03 12:26:00', '2025-05-03 15:26:00', NULL, NULL, NULL, NULL, 'Entregado a vecino', 'PAQ-000047'),
(5, 41, 5, 'Audífonos', 2.63, 'L', 3818.71, TRUE, 'Minerva', 'Reséndez', '(038)277-8514', 'uespino@club.com', '2025-05-04 11:00:00', '2025-05-04 13:00:00', '2025-05-04 15:00:00', NULL, NULL, NULL, 'Paquete fuera para entrega hoy', 'PAQ-000048'),
(6, 19, 7, 'Audífonos', 9.51, 'S', 2914.31, TRUE, 'Felix', 'Montalvo', '1-345-240-5980x250', 'alvaradofabiola@gmail.com', '2025-05-04 11:11:00', '2025-05-04 13:11:00', '2025-05-04 15:11:00', NULL, NULL, NULL, 'No se encontró al destinatario', 'PAQ-000049'),
(6, 34, 2, 'Tablet', 4.73, 'L', 1047.69, TRUE, 'Adán', 'Gastélum', '510-562-3762x54256', 'parragabino@hotmail.com', '2025-05-03 08:53:00', '2025-05-03 10:53:00', '2025-05-03 12:53:00', NULL, NULL, NULL, 'Registrado pero aún no empacado', 'PAQ-000050');
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
