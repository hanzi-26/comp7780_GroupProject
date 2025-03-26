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
empl_salary FLOAT NOT NULL,
empl_job VARCHAR(50),
empl_stuID INT NOT NULL
);

SELECT * FROM employee;

DESC employee;

INSERT INTO employee VALUES (NULL, 'Huanhua LIN', 'empl4@abc.com', '415-323-4567', '2020-01-01', 5000, 'Senior Scrum Master', 24464309);
INSERT INTO employee VALUES (NULL, 'Yi HUANG', 'empl5@abc.com', '415-423-4567', '2020-03-01', 5000, 'Scrum Master', 24429228);
INSERT INTO employee VALUES (NULL, 'Dongping QIAN', 'empl6@abc.com', '415-363-4567', '2021-01-01', 5000, 'Project Manger', 24435112);
INSERT INTO employee VALUES (NULL, 'Han LI', 'empl1@abc.com', '415-123-4567', '2020-01-01', 5000, 'Developer', 24466778);
INSERT INTO employee VALUES (NULL, 'Yifan LI', 'empl2@abc.com', '415-234-5678', '2020-06-01', 5000, 'Developer', 24464295);
INSERT INTO employee VALUES (NULL, 'SHiwei DENG', 'empl3@abc.com', '415-345-6789', '2021-02-01', 5000, 'Developer', 24448028);

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

SELECT * FROM customer;

DESC customer;

INSERT INTO customer VALUES (NULL, 'cust1', NULL, 'cust1@xyz.com', 'Cust1', '415-123-4567', 5000),
(NULL, 'cust2', NULL, 'cust2@xyz.com', 'Cust2', '415-234-5678', 6000),
(NULL, 'cust3', NULL, 'cust3@xyz.com', 'Cust3', '415-345-6789', 5000),
(NULL, 'cust4', NULL, 'cust4@xyz.com', 'Cust4', '415-456-7890', 5000);


# products 
DROP TABLE product;

CREATE TABLE product (
prod_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
prod_desc VARCHAR(255) NOT NULL,
prod_on_hand INT NOT NULL,
supplier_id INT NOT NULL,
prod_imgurl VARCHAR(255),
prod_category VARCHAR(20),
prod_price DECIMAL(10, 2)
);

SELECT * FROM product;

DESC product;

SELECT * FROM product

INSERT INTO product VALUES (NULL, 'Simple Dining Table', 12, 1, 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=800&q=80', 'Furniture', 2999);
INSERT INTO product VALUES (NULL, 'Fabric Sofa', 8, 2, 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', 'Furniture', 4599);
INSERT INTO product VALUES (NULL, 'Ceramic Vase', 12, 1, 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80', 'Decoration', 299);
INSERT INTO product VALUES (NULL, 'Bed Sheet Set', 8, 2, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 'Bedding', 599);
INSERT INTO product VALUES (NULL, 'Floor Lamp', 12, 1, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80', 'Lighting', 799);
INSERT INTO product VALUES (NULL, 'Storage Cabinet', 8, 2, 'https://www.stockroom.com.hk/media/catalog/product/cache/11/image/16121aaca399c35451ffd7c398a3f1cd/e/r/ermina_rattan_shoe_cabinet_2__1_1.jpg', 'Storage', 1299);

SELECT * FROM product WHERE prod_desc LIKE '%sofa%';
# suppliers
DROP TABLE supplier;

CREATE TABLE supplier (
supplier_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
supplier_name VARCHAR(20) NOT NULL,
supplier_email VARCHAR(20) NOT NULL,
feedback_score INT,
supplier_location VARCHAR(20) NOT NULL
);

SELECT * FROM supplier;

DESC supplier;

INSERT INTO supplier VALUES (NULL, 'Supplier1', 'supplier1@aaa.com', 4, 'HKBU');
INSERT INTO supplier VALUES (NULL, 'Supplier2', 'supplier2@bbb.com', 4.5, 'CHINA');

# cart
DROP TABLE cart;

CREATE TABLE cart (
cust_username VARCHAR(20) NOT NULL,
cart_order_date DATE,
prod_id INT NOT NULL,
cart_qty INT NOT NULL,
cart_price FLOAT NOT NULL
);

SELECT * FROM cart;

DESC cart;

# sales_order
DROP TABLE sales_order;

CREATE TABLE sales_order (
order_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
cust_username VARCHAR(20) NOT NULL,
order_date DATE
);

SELECT * FROM sales_order;
INSERT INTO sales_order (cust_username, order_date) VALUES ('test_user', NOW());

DESC sales_order;

# order_detail
DROP TABLE order_detail;

CREATE TABLE order_detail (
order_id INT NOT NULL,
prod_id INT NOT NULL,
qty INT NOT NULL,
price FLOAT NOT NULL，
STATUS VARCHAR(50) DEFAULT 'unfilled'
);

SELECT * FROM order_detail;


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
