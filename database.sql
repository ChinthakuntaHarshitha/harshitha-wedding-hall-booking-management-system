CREATE DATABASE IF NOT EXISTS wedding_hall_booking;
USE wedding_hall_booking;

CREATE TABLE customers (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255)
);

CREATE TABLE halls (
    hall_id INT PRIMARY KEY AUTO_INCREMENT,
    hall_name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    capacity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    facilities TEXT,
    status VARCHAR(20) DEFAULT 'Available'
);

CREATE TABLE booking (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    hall_id INT NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
);

CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'Pending',
    FOREIGN KEY (booking_id) REFERENCES booking(booking_id)
);

INSERT INTO halls (hall_name, location, capacity, price, facilities, status) VALUES
('Sri Lakshmi Convention Hall','Kurnool',500,75000,'AC, Parking, Stage, Dining Hall, Generator','Available'),
('Royal Palace Function Hall','Kurnool',800,120000,'AC, Parking, Decoration, Dining Hall, Rooms','Available'),
('Golden Grand Hall','Adoni',600,90000,'AC, Parking, Stage, Catering Area','Available'),
('Sai Mahal','Yemmiganur',400,60000,'Parking, Dining Hall, Stage, Generator','Available');