const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
var router = require('./router/main')(app);



// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.get('/', function(req, res){
    res.send('Hello World');
});

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})