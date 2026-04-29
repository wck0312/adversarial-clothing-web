SET NAMES utf8mb4;

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

INSERT INTO users (name, email, phone, password) VALUES
(
  CONVERT(0xEC9588EBB3B4 USING utf8mb4),
  'acweb@gmail.com',
  '010-2222-2222',
  '$2b$10$ubcfx077xziOMloyHJAc1u6Ixx02cwazuhtD7s8drODgCpX3lkGhu'
);

INSERT INTO products (name, category, price, image_url) VALUES
('기본 흰색 티셔츠', 'tshirt', 19000, '/images/tshirt-front.png'),
('기본 검정 티셔츠', 'tshirt', 19000, '/images/tshirt-back.png'),
('오버핏 후드티', 'hoodie', 39000, '/images/hoodie.png');

INSERT INTO designs (
  user_id,
  product_id,
  title,
  front_image_url,
  back_image_url,
  patch_x,
  patch_y,
  patch_width,
  patch_height
) VALUES
(
  1,
  1,
  '전면 패치 예시',
  '/images/sample-front-design.png',
  '/images/sample-back-design.png',
  120,
  160,
  80,
  80
);