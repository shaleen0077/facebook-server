const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
 
// parse application/json
app.use(bodyParser.json());
 
//create database connection
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'newsfeed'
});
 
// connect to database
conn.connect((err) =>{
  if(err) {
    console.log(err);
    throw err;
  }
  console.log('Mysql Connected...');
});
 
 
// Get news feed for the user
app.get('/api/feeds',(req, res) => {
  let sql = "select * from feeds order by timestamp desc limit 15";
  conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({ results }));
  });
});
 
// Delete news feed
app.delete('/api/feeds/:id',(req, res) => {
  let sql = "DELETE FROM feeds WHERE id=" + req.params.id + "";
  conn.query(sql, (err, results) => {
    if(err) throw err;
      res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});

// add new news feed
app.post('/api/news', (req, res) => {
  const obj = {
    type: req.body.type,
    text: req.body.text,
    imgSrc: req.body.imgSrc
  };
  let sql = "insert into feeds (data) values ('" + JSON.stringify(obj) + "')";
  conn.query(sql,(err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({ "status": 200, "error": null, "response": results }));
  });
});
 
// update product
app.patch('/api/news/:id',(req, res) => {
  const obj = {
    type: req.body.type,
    text: req.body.text,
    imgSrc: req.body.imgSrc
  };
  let sql = "UPDATE feeds SET data='" + JSON.stringify(obj) + "' WHERE id=" + req.params.id;
  console.log(sql);
  conn.query(sql, (err, results) => {
    if(err) throw err;
    res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
  });
});
 
 
//Server listening
app.listen(3000,() =>{
  console.log('Server started on port 3000...');
});