/*
    index.js
    Entry point for the app.
    To start node index.js
*/

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 解析表单数据
app.use(bodyParser.urlencoded({ extended: true }));

/* define pictures, css and images folders */
app.use(express.static('public'));
app.use('/css', express.static(__dirname + '/css'));

// 模拟用户数据库
const users = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// 登录页面
app.get('/login', function(req, res) {
    res.sendFile(__dirname + "/login.html");
});

// 处理登录请求
app.post('/login', function(req, res) {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        res.redirect('/');
    } else {
        res.send('Invalid username or password. <a href="/login">Try again</a>');
    }
});

app.get('/', function(req, res) {
    // res.send("Hello World!");
    /* display index.html file */
    res.sendFile(__dirname + "/index.html");
});

app.get('/product', function(req, res) {
    res.sendFile(__dirname + "/shop.html");
});

app.get('/cart', function(req, res) {
    // res.send("Add Cart - need MySQL");

    var responseText = 'Prod_id: ' + req.query.prod_id + '<br>';
    responseText += 'Qty: ' + req.query.qty + '<br>';
    responseText += 'Price: ' + req.query.price + '<br>';
    responseText += 'Username: ' + req.query.f_username + '<br><br>';
    // res.send(responseText);

    var now = new Date();
    var cur_date_yyyy_mm_dd = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    console.log("cur_date_yyyy_mm_dd is: " + cur_date_yyyy_mm_dd);
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "user99",
        password: "user99",
        database: "comp7780"
    });
    con.connect(function(err) {
        if (err) throw err;
        var sql = "INSERT INTO cart (cust_username, cart_order_date, prod_id, cart_qty, cart_price) VALUES (" +
            "'" + req.query.f_username + "'," +
            "'" + cur_date_yyyy_mm_dd + "'," +
            req.query.prod_id + "," +
            req.query.qty + "," +
            req.query.price + ");";
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
            console.log(result.affectedRows);

            if (result.affectedRows > 0) {
                responseText += 'Thank you for your order! ' + req.query.f_username + '<br>';
                responseText += 'The above item has been added to your shopping cart. <br>';
            } else {
                responseText += 'MySQL ERROR: Item not added!<br>';
            }
            responseText += '<br><br>';
            responseText += '<input type="button" value = "Close this page" onclick="self.close();" />';
            res.send(responseText);
        }); //end of con.query()
        con.end();
    });  //end of con.connect()
});

app.get('/check_out', function(req, res) {
    // res.send("Check Out - need MySQL");
    /* for testing only
        var responseText = 'Username: ' + req.query.f_check_out_username + '<br><br>';
        res.send(responseText);
    */
    /* paypal information 1 */

    var responseText = '<!DOCTYPE html>';
    responseText += '<head><meta name="viewport" content="width=device-width, initial-scale=1">';
    responseText += '<meta http-equiv="X-UA-Compatible" content="IE=edge" /></head>';
    responseText += '<body><script src="https://www.paypal.com/sdk/js?client-id=ATSWa9vavLRPYABa5DAFOb7d6xFXlYIfpC4eE0ML-fo4wvxD7MhswAQkklI625Mqnbudf6psDaPUC5mj">';
    responseText += '</script>';
    var mysql = require('mysql');
    var con = mysql.createConnection({
        host: "localhost",
        user: "user99",
        password: "user99",
        database: "comp7780"
    });
    con.connect(function(err) {
        if (err) throw err;
        var sql = "SELECT DATE_FORMAT(cart.cart_order_date, '%Y-%m-%d') AS order_date, ";
        sql += "cart.prod_id, product.prod_desc, cart.cart_qty, cart.cart_price ";
        sql += "FROM cart ";
        sql += "INNER JOIN product ON cart.prod_id = product.prod_id ";
        sql += "WHERE cart.cust_username = '" + req.query.f_check_out_username + "'";
        sql += "ORDER BY order_date ASC, prod_id DESC;";
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log(result);
            responseText += 'Thank you for your order! ' + req.query.f_check_out_username + '<br>';
            responseText += 'Your order details: <br><br>';
            responseText += '<table border="2">';
            responseText += '<tr><th>Original Order Date</th><th>Product ID</th><th>Product Description</th><th>Quantity</th><th>Price</th><th>Amount</th></tr>';
            var total_due = 0;
            var sub_total = 0;
            for (var i = 0; i < result.length; i++) {
                sub_total = result[i].cart_qty * result[i].cart_price;
                responseText += '<tr><td>' + result[i].order_date + '</td><td>' + result[i].prod_id + '</td><td>' + result[i].prod_desc + '</td><td>' + result[i].cart_qty + '</td><td>' + result[i].cart_price + '</td><td>' + sub_total + '</td></tr>';

                total_due += sub_total;
            }
            responseText += '</table>';
            responseText += '<br>Total Due: ' + total_due.toFixed(2);
            responseText += '<br><br>';

            /* paypal information 2 */

            responseText += '<div id="paypal-button-container"></div>';
            responseText += '<p id="txt1"></p>';
            responseText += '<script>';
            responseText += 'paypal.Buttons({';
            responseText += 'createOrder: function(data, actions) {';
            responseText += 'return actions.order.create({';
            responseText += 'purchase_units: [{';
            responseText += 'amount: {';
            responseText += 'value: ' + total_due + '}';
            responseText += '}]';
            responseText += '});';
            responseText += '},';
            responseText += 'onApprove: function(data, actions) {';
            responseText += 'return actions.order.capture().then(function(details) {';
            responseText += 'alert("Transaction completed by " + details.payer.name.given_name);';
            responseText += 'document.querySelector("#txt1").innerHTML = "Payment has completed! This web page can be closed now!";';
            responseText += 'document.querySelector("#txt1").style.backgroundColor = "yellow";';
            responseText += 'document.querySelector("#txt1").style.color = "red";';
            responseText += '});';
            responseText += '}';
            responseText += '}).render("#paypal-button-container");';
            responseText += '</script>';
            responseText += '</body></html>';
            res.send(responseText);
        }); //end of con.query()
        con.end();
    });  //end of con.connect()
});

app.listen(3000, function() {
    console.log('index.js listening to http://127.0.0.1:3000/ or http://localhost:3000/');
});

console.log('End of Program.');