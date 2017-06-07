// ###Задача 1 
// Создайте подключение к базе данных test через пул соединений. 
// При GET-запросе по пути '/' выполните запрос к базе данных для выбора всех элементов таблицы test_table и отобразите ихз в виде таблицы. 

const express  = require('express');
const app = express();

const path = require('path');

const port = process.env.port || 1337;
const mysql = require('mysql');

const pool = mysql.createPool({
    queueLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Q1w2e3r4',
    database: 'test',
    port: 3306
});

app.set('views', './pages');
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', function(req, res) {

    pool.getConnection(function(err, conn){

        if (err) {
            console.error(err.stack);
            return;
        }

        conn.query('SELECT * FROM `test_table`', function(err, rows) {
            if (err) console.error(err);

            res.render('index', { data:  rows });

            conn.release();
        });

    });

});

app.use(function(req, res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('404 Page not found!');
});

app.use(function(err, req, res, next) {
    res.status(500).send('oops...something went wrong');
    next(err.stack);
});

app.listen(port, function() {
    console.log('app listening on port ' + port);
});