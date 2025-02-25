DROP DATABASE comp7780_GroupProject;

CREATE DATABASE comp7780_GroupProject;

USE comp7780_GroupProject;

# employee
DROP TABLE employee;

CREATE TABLE employee (
empl_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
empl_name VARCHAR(20) NOT NULL,
empl_email VARCHAR(20) NOT NULL,
empl_phone VARCHAR(12),
empl_hire_date DATE,
empl_salary FLOAT NOT NULL
);

DESC employee;

INSERT INTO employee VALUES (NULL, 'LI Han', 'empl1@abc.com', '415-123-4567', '2020-01-01', 5000),
(NULL, 'LI Yifan', 'empl2@abc.com', '415-234-5678', '2020-06-01', 5000),
(NULL, 'DENG SHiwei', 'empl3@abc.com', '415-345-6789', '2021-02-01', 5000);

# customers
DROP TABLE customer;

CREATE TABLE customer (
cust_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
cust_username VARCHAR(20) NOT NULL,
cust_password VARCHAR(64),
cust_email VARCHAR(20) NOT NULL,
cust_name VARCHAR(20) NOT NULL,
cust_phone VARCHAR(12),
cust_credit_limit FLOAT NOT NULL
);

DESC customer;

INSERT INTO customer VALUES (NULL, 'cust1', NULL, 'cust1@xyz.com', 'Cust1', '415-123-4567', 5000),
(NULL, 'cust2', NULL, 'cust2@xyz.com', 'Cust2', '415-234-5678', 6000),
(NULL, 'cust3', NULL, 'cust3@xyz.com', 'Cust3', '415-345-6789', 5000),
(NULL, 'cust4', NULL, 'cust4@xyz.com', 'Cust4', '415-456-7890', 5000);

# products 
DROP TABLE product;

CREATE TABLE product (
prod_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
prod_desc VARCHAR(20) NOT NULL,
prod_on_hand INT NOT NULL,
supplier_id INT NOT NULL
);

DESC product;

INSERT INTO product VALUES (NULL, 'Prod1', 12, 1),
(NULL, 'Prod2', 6, 1),
(NULL, 'Prod3', 8, 2),
(NULL, 'Prod4', 5, 2);

# suppliers
DROP TABLE supplier;

CREATE TABLE supplier (
supplier_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
supplier_name VARCHAR(20) NOT NULL,
supplier_email VARCHAR(20) NOT NULL
);

DESC supplier;

INSERT INTO supplier VALUES (NULL, 'Supplier1', 'supplier1@aaa.com'),
(NULL, 'Supplier2', 'supplier2@bbb.com');

# cart
DROP TABLE cart;

CREATE TABLE cart (
cust_username VARCHAR(20) NOT NULL,
cart_order_date DATE,
prod_id INT NOT NULL,
cart_qty INT NOT NULL,
cart_price FLOAT NOT NULL
);

DESC cart;

# sales_order
DROP TABLE sales_order;

CREATE TABLE sales_order (
order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
cust_username VARCHAR(20) NOT NULL,
order_date DATE
);

DESC sales_order;

# order_detail
DROP TABLE order_detail;

CREATE TABLE order_detail (
order_id INT NOT NULL,
prod_id INT NOT NULL,
qty INT NOT NULL,
price FLOAT NOT NULL
);

DESC order_detail;

###################################
### po: po_num, po_date, prod_id, supplier_id 
###
###################################

DROP TABLE po;

CREATE TABLE po (
po_num INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
po_date DATE,
prod_id INT NOT NULL,
supplier_id INT NOT NULL
);

#################################
### create warehouse: pick_list, invoice tables
### 
#################################

