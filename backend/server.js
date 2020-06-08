const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
//var router = require('./router/main')(app);

// parse application/json
app.use(bodyParser.json());
app.use(cors());

// MySQL Connection 객체 생성 
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'newbie',   
    password: 'SparcsNewbie!',
    database: 'bbibbi_db'
  });
  
// MySQL Connect
connection.connect(function (err) {   
if (err) {     
    console.error('mysql connection error');     
    console.error(err);     
    throw err;
} 
else {
    console.log("mysql successfully connected");
}
});

// Handle requests
app.get('/', function(req, res){
    res.send('Hello World');
});

app.post('/signUp', function (req, res) {
    console.log("signup called");
    console.log(req.body);
    const user = {
      'userid': req.body.id,
      'password': req.body.password
    };
    connection.query('SELECT id FROM test_t WHERE userid = "' + user.userid + '"', function (err, row) {
      if (row == undefined){ //  동일한 아이디가 없을경우,
        //const salt = bcrypt.genSaltSync();
        //const encryptedPassword = bcrypt.hashSync(user.password, salt);
        const encryptedPassword = user.password;
        console.log('INSERT INTO test_t (id,password) VALUES ("' + user.userid + '","' + encryptedPassword + '")');
        connection.query('INSERT INTO test_t (id,password) VALUES ("' + user.userid + '","' + encryptedPassword + '")', user, function (err, row2) {
          if (err) throw err;
        });
        res.json({
          success: true,
          message: 'Sign Up Success!'
        })
      }
      else {
        res.json({
          success: false,
          message: 'Sign Up Failed Please use another ID'
        })
      }
    });
    
  });

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})