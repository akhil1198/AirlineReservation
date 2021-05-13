const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const users = require('./controller/Users');
const bodyParser = require('body-parser')
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))
const connection = require('./config/connection');

connection();

// app(function () {
//     app.use(express.bodyParser());
//     app.use(app.router);
// });

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true
    })
);

app.get('/api', (req, res) => {
    res.send("Welcome to Airline Reservation APIs!");
});

app.use('/api/users', users);

const port = 5000 || process.env.PORT;

http.listen(port, () => console.log("Server listening on port ", port));