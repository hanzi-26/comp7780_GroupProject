// import express from 'express';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';
//
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
//
// const app = express();
// const port = 4000;
//
// // define picture, css and image floders
// app.use(express.static('public'));
//
// app.get('/', (req, res) => {
//   res.sendFile(join(__dirname, 'public', 'index.html'));
// });
//
// app.listen(port, () => {
//   console.log(`Server running at http://localhost:${port}`);
// });

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

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
  const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
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

// 更新数据
const updateUser = (id, name, email, callback) => {
  const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
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
  const sql = 'DELETE FROM users WHERE id = ?';
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

// 定义一个 API 路由，用于获取数据库数据
app.get('/api/fetchUsers', (req, res) => {
  fetchUsers((err, data) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(data);
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});