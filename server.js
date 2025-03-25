const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

const path = require('path');

// 在顶部添加以下代码，启用静态文件服务
app.use(express.static('public'));

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'comp7780_GroupProject',
    port: 3306,
});

// 使用 CORS 中间件
app.use(cors());
app.use(express.json()); // 解析 JSON 请求体
app.use(express.urlencoded({extended: true})); // 解析 URL 编码的请求体

// 连接到数据库
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
    connection.release();
});

// 插入数据
const insertUser = (name, email, callback) => {
    const sql = 'INSERT INTO customer (name, email) VALUES (?, ?)';
    pool.query(sql, [name, email], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            callback(err);
            return;
        }
        console.log('User inserted with ID:', results.insertId);
        callback(null, results);
    });
};

// 查询数据
const fetchUsers = (callback) => {
    pool.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            callback(err);
            return;
        }
        console.log('employees:', results);
        callback(null, results);
    });
};

// 查询商品
const fetchProducts = (callback) => {
    pool.query('SELECT * FROM product', (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            callback(err);
            return;
        }
        console.log('products:', results);
        callback(null, results);
    });
};

// 根据关键词搜索商品
const searchProducts = (keyword, callback) => {
    const sql = `SELECT *
                 FROM product
                 WHERE prod_desc LIKE '%${keyword}%'`;
    pool.query(sql, (err, results) => {
        if (err) {
            console.error('Error searching products:', err);
            callback(err);
            return;
        }
        console.log('Products searched:', results);
        callback(null, results);
    });
};

// 更新数据
const updateUser = (id, name, email, callback) => {
    const sql = 'UPDATE customer SET name = ?, email = ? WHERE id = ?';
    pool.query(sql, [name, email, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            callback(err);
            return;
        }
        console.log('User updated:', results);
        callback(null, results);
    });
};

// 删除数据
const deleteUser = (id, callback) => {
    const sql = 'DELETE FROM customer WHERE id = ?';
    pool.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            callback(err);
            return;
        }
        console.log('User deleted:', results);
        callback(null, results);
    });
};

// checkout接口
app.post('/api/checkout', (req, res) => {
    const username = req.body.username;
    const cartItems = req.body.cartItems;

    // 检查用户余额是否足够
    pool.query('SELECT cust_credit_limit FROM customer WHERE cust_username = ?', [username], (err, results) => {
        if (err) {
            console.error('Error fetching customer credit limit:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Customer not found' });
            return;
        }

        // 确保 cust_credit_limit 是整数类型
        const creditLimit = parseInt(results[0].cust_credit_limit);

        // 计算总价
        let totalCost = 0;
        for (const item of cartItems) {
            totalCost += item.price * item.quantity;
        }

        if (creditLimit < totalCost) {
            res.status(400).json({ success: false, message: 'Insufficient credit limit' });
            return;
        }

        // 扣除用户余额
        pool.query('UPDATE customer SET cust_credit_limit = cust_credit_limit - ? WHERE cust_username = ?', [totalCost, username], (err, results) => {

            // 插入sale_order记录
            pool.query('INSERT INTO sales_order (cust_username, order_date) VALUES (?, NOW())', [username], (err, results) => {

                const order_id = results.insertId;
                // 插入order_detail记录并更新product库存
                const productUpdates = [];
                for (const item of cartItems) {
                    productUpdates.push(
                        pool.query('INSERT INTO order_detail (order_id, prod_id, qty, price) VALUES (?, ?, ?, ?)', [order_id, item.product_id, item.quantity, item.price])
                    );
                    pool.query('UPDATE product SET prod_on_hand = prod_on_hand - ? WHERE id = ?', [item.quantity, item.product_id]);
                }

                Promise.all(productUpdates)
                    .then(() => {
                        res.json({ success: true, message: 'Checkout successful' });
                    })
                    .catch(err => {
                        console.error('Error processing product updates:', err);
                        res.status(500).json({ success: false, message: 'Internal Server Error' });
                    });
            });
        });
    });
});

// 获取订单接口
app.get('/api/getOrders', (req, res) => {
    const username = req.query.username;

    // 获取用户的订单信息
    pool.query(
        `SELECT so.order_id, so.order_date, od.prod_id, od.qty, p.prod_desc, p.prod_price
         FROM sales_order so
                  JOIN order_detail od ON so.order_id = od.order_id
                  JOIN product p ON od.prod_id = p.prod_id
         WHERE so.cust_username = ?`,
        [username],
        (err, results) => {
            if (err) {
                console.error('Error fetching orders:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                return;
            }

            // 处理查询结果，将订单按订单ID分组
            const orders = {};
            results.forEach(row => {
                const orderId = row.order_id;
                if (!orders[orderId]) {
                    orders[orderId] = {
                        order_id: orderId,
                        order_date: row.order_date,
                        items: [],
                        total: 0
                    };
                }
                const item = {
                    product_id: row.prod_id,
                    name: row.prod_desc,
                    quantity: row.qty,
                    price: row.prod_price,
                    total: row.prod_price * row.qty
                };
                orders[orderId].items.push(item);
                orders[orderId].total += item.total;
            });

            // 将结果转换为数组
            const ordersArray = Object.values(orders);

            res.json(ordersArray);
        }
    );
});

// 定义一个 API 路由，用于获取数据库数据
app.get('/api/fetchUsers', (req, res) => {
    fetchUsers((err, data) => {
        if (err) {
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json(data);
    });
});

app.get('/api/fetchProducts', (req, res) => {
    fetchProducts((err, data) => {
        if (err) {
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json(data);
    });
});

// 定义一个 API 路由，用于根据关键词搜索商品
app.post('/api/searchProducts', (req, res) => {
    const keyword = req.body.keyword;
    searchProducts(keyword, (err, data) => {
        if (err) {
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json(data);
    });
});

// 插入用户
app.post('/api/insertUser', (req, res) => {
    const name = req.query.name;
    const email = req.query.email;

    insertUser(name, email, (err, data) => {
        if (err) {
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json(data);
    });
});

// 更新用户
app.post('/api/updateUser', (req, res) => {
    const id = req.query.id;
    const name = req.query.name;
    const email = req.query.email;

    updateUser(id, name, email, (err, data) => {
        if (err) {
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json(data);
    });
});

// 删除用户
app.post('/api/deleteUser', (req, res) => {
    const id = req.query.id;

    deleteUser(id, (err, data) => {
        if (err) {
            res.status(500).json({error: 'Internal Server Error'});
            return;
        }
        res.json(data);
    });
});

// 登录接口
app.post('/api/login', (req, res) => {
    const cust_username = req.body.username;
    const cust_password = req.body.password;

    // 验证用户名和密码
    pool.query('SELECT * FROM customer WHERE cust_username = ? AND cust_password = ?', [cust_username, cust_password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).json({success: false, message: 'Internal Server Error'});
            return;
        }

        if (results.length === 0) {
            res.json({success: false, message: 'Invalid username or password'});
            return;
        }

        // 登录成功，返回用户信息
        res.json({
            success: true,
            message: 'Login successful',
            user: {
                cust_username: results[0].cust_username,
                cust_name: results[0].cust_name // 假设表中有cust_name字段
            }
        });
    });
});

// 注册接口
app.post('/api/register', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const name = req.body.name;
    const phone = req.body.phone;
    const password = req.body.password;

    // 检查用户名或邮箱是否已存在
    pool.query('SELECT * FROM customer WHERE cust_username = ? OR cust_email = ?', [username, email], (err, results) => {
        if (err) {
            console.error('Error during registration:', err);
            res.status(500).json({success: false, message: 'Internal Server Error'});
            return;
        }

        if (results.length > 0) {
            res.json({success: false, message: 'Username or email already exists'});
            return;
        }

        // 插入新用户，默认cust_credit_limit为5000
        pool.query('INSERT INTO customer (cust_username, cust_email, cust_name, cust_phone, cust_password, cust_credit_limit) VALUES (?, ?, ?, ?, ?, 5000)', [username, email, name, phone, password], (err, results) => {
            if (err) {
                console.error('Error during registration:', err);
                res.status(500).json({success: false, message: 'Internal Server Error'});
                return;
            }

            res.json({success: true, message: 'Registration successful'});
        });
    });
});

// 删除订单接口
app.delete('/api/deleteOrder', (req, res) => {
    const username = req.query.username;
    const orderId = req.query.order_id;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
            return;
        }

        connection.beginTransaction((err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                res.status(500).json({ success: false, message: 'Internal Server Error' });
                connection.release();
                return;
            }

            // 检查订单是否属于当前用户
            connection.query('SELECT * FROM sales_order WHERE order_id = ? AND cust_username = ?', [orderId, username], (err, results) => {
                if (err) {
                    connection.rollback(() => {
                        console.error('Error checking order ownership:', err);
                        res.status(500).json({ success: false, message: 'Internal Server Error' });
                    });
                    connection.release();
                    return;
                }

                if (results.length === 0) {
                    connection.rollback(() => {
                        res.status(404).json({ success: false, message: 'Order not found or does not belong to you' });
                    });
                    connection.release();
                    return;
                }

                // 删除 order_detail 中的相关记录
                connection.query('DELETE FROM order_detail WHERE order_id = ?', [orderId], (err, results) => {
                    if (err) {
                        connection.rollback(() => {
                            console.error('Error deleting order details:', err);
                            res.status(500).json({ success: false, message: 'Internal Server Error' });
                        });
                        connection.release();
                        return;
                    }

                    // 删除 sale_order 中的记录
                    connection.query('DELETE FROM sales_order WHERE order_id = ?', [orderId], (err, results) => {
                        if (err) {
                            connection.rollback(() => {
                                console.error('Error deleting sale order:', err);
                                res.status(500).json({ success: false, message: 'Internal Server Error' });
                            });
                            connection.release();
                            return;
                        }

                        connection.commit((err) => {
                            if (err) {
                                connection.rollback(() => {
                                    console.error('Error committing transaction:', err);
                                    res.status(500).json({ success: false, message: 'Internal Server Error' });
                                });
                                connection.release();
                                return;
                            }

                            res.json({ success: true, message: 'Order deleted successfully' });
                            connection.release();
                        });
                    });
                });
            });
        });
    });
})


// 添加一个简单的首页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});