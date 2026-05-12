SET NAMES utf8mb4;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS designs;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  price INT NOT NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
  title VARCHAR(100) NOT NULL,
  front_image_url VARCHAR(255),
  back_image_url VARCHAR(255),
  patch_x INT,
  patch_y INT,
  patch_width INT,
  patch_height INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  color VARCHAR(50) NOT NULL,
  size VARCHAR(10) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  price INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, phone, password) VALUES (
  '안보',
  'acweb@gmail.com',
  '010-2222-2222',
  '$2b$10$ubcfx077xziOMloyHJAc1u6Ixx02cwazuhtD7s8drODgCpX3lkGhu'
);
