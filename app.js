
const express = require("express"),
		PDFDocument = require ('pdfkit'),
    	app = express(),
    	bodyParser = require("body-parser"),
    	mysql      = require('mysql');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'secret',
  database: "mydb"
});

connection.connect(function(err) {
  	if (err) console.log("ERROR!"+err);
  	else{
	  console.log("Connected!");
	  connection.query("CREATE DATABASE mydb", function (err, result) {
	    if (err) console.log("ERROR!"+err);
  		else{
	    	console.log("Database created");
		}
	  });
	}
});

connection.connect(function(err) {
  	if (err) console.log("ERROR!"+err);
  	else{
	  console.log("Connected!");
	  var sql = "CREATE TABLE customers (name VARCHAR(255), lastname VARCHAR(255), image VARCHAR(255), pdf VARCHAR(255) )";
	  connection.query(sql, function (err, result) {
	    if (err) console.log("ERROR!"+err);
  		else{
	    	console.log("Table created");
		}
	  });
	}
});

app.get("/", function(req, res){
	 	var mes = 0;
        res.render("index", {mes:mes});
    });

app.get("/register", function(req, res){
   res.render("register"); 
});


app.post("/register", function(req, res){
  		doc = new PDFDocument;
		doc.addPage()
		   .fillColor("black")
		   .text(''+req.body.username+'', 100, 100)
		   .text(''+req.body.usernameLast+'', 100, 200)
		   .link(100, 100, 160, 27, ''+req.body.image+'');
		doc.end();

	  	var value = [[req.body.username, req.body.usernameLast, req.body.image, doc]];
	  	var sql = "INSERT INTO customers (name, lastname, image, pdf) VALUES ?";
			connection.query(sql, [value], function (err, result) {
				var message;
			if (err) {
				console.log("error " + err);
				message = "Пользователь не зарегистрирован!";
			} else {
				message = "Пользователь зарегистрирован!";
			}
			res.render("index", {mes:message});
			});
    
});

app.get("/search", function(req, res){
    res.render("search");    
});

app.post("/search", function(req, res){
	  		var adr = req.body.username;
			var sql = 'SELECT * FROM customers WHERE name = ?';
			connection.query(sql, [adr], function (err, result) {
	  			if (err) console.log("error " + err);
				res.render("end", {pdf: result});  
			 });
});

app.listen(3000, function(){
   console.log("App Has Started!"); 
});