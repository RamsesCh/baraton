var express = require('express');
var app = express();
app.use(express.static("app")); // myApp will be the same folder name.
app.get('/', function (req, res,next) {
 res.redirect('/'); 
});
app.listen(8080, 'localhost');
console.log("yeha! ahora la app esta corriendo en http://localhost:8080");