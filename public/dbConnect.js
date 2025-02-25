const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'comp7780_GroupProject'
});

// 连接到数据库
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// 插入数据
const insertUser = (name, email) => {
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    connection.query(sql, [name, email], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return;
        }
        console.log('User inserted with ID:', results.insertId);
    });
};

// 查询数据
const fetchUsers = () => {
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return;
        }
        console.log('employees:', results);
    });
};

// 更新数据
const updateUser = (id, name, email) => {
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    connection.query(sql, [name, email, id], (err, results) => {
        if (err) {
            console.error('Error updating user:', err);
            return;
        }
        console.log('User updated:', results.message);
    });
};

// 删除数据
const deleteUser = (id) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
            return;
        }
        console.log('User deleted:', results.message);
    });
};

// 示例操作
//insertUser('John Doe', 'john@example.com');
fetchUsers();
//updateUser(1, 'Jane Doe', 'jane@example.com');
//deleteUser(1);

// 关闭连接
connection.end((err) => {
    if (err) {
        console.error('Error closing the connection:', err);
        return;
    }
    console.log('Connection closed.');
});
