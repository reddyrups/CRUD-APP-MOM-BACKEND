const express = require('express');
const mysql = require('mysql2');
const app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors()) // Use this after the variable declaration

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Reddy1234@$$',
  database: 'mom'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server!');
});

// Create a new record
app.post('/api/records', (req, res) => {
  console.log("---req body", req)
  const record = { item: req.body.item, ownerName: req.body.ownerName, eta: req.body.eta, comments: req.body.comments, status: req.body.status };
  connection.query('INSERT INTO MomDetails SET ?', record, (err, results) => {
    if (err) throw err;
    res.send('Record added successfully!');
  });
});

// Read all records
app.get('/api/records', (req, res) => {
  connection.query('SELECT * FROM MomDetails', (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


// Update a record
app.put('/api/records/:id', (req, res) => {
  const id = Number(req.params.id);
  const date = req.body.eta.split("T")
  const record = { item: req.body.item, ownerName: req.body.ownerName, eta: date[0] + " " + date[1].split(".")[0], comments: req.body.comments, status: req.body.status };
  connection.query('UPDATE MomDetails SET ? WHERE id = ?', [record, id], (err, results) => {
    if (err) throw err;
    res.send('Record updated successfully!');
  });
});

// Delete a record
app.delete('/api/records/:id', (req, res) => {
  const id = Number(req.params.id);
  connection.query('DELETE FROM MomDetails WHERE id = ?', id, (err, results) => {
    if (err) throw err;
    res.send('Record deleted successfully!');
  });
});


// Read users related records
app.get('/api/records/id/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM MomDetails WHERE id = ?', id, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

// Read users related records
app.get('/api/records/user/:ownerName', (req, res) => {
  const ownerName = req.params.ownerName;
  connection.query('SELECT * FROM MomDetails WHERE ownerName = ?', ownerName, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});


// Start the server
app.listen(3001, () => {
  console.log('Server started on port 3000!');
});
