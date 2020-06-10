const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
//var router = require('./router/main')(app);

// parse application/json
app.use(bodyParser.json());
app.use(cors());

// Create MySQL Connection Object
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'newbie',   
    password: 'SparcsNewbie!',
    database: 'bbibbi_db'
  }
);
  
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
      'password': req.body.password,
      'name': req.body.name,
      'number': req.body.number
    };
    connection.query(
      'SELECT id \
      FROM accounts \
      WHERE id = "' + user.userid + '";', 
      function (err, row) {
        if (row.length==0){ // If the ID is not already taken
          let address;
          if (user.number == "") {
            address = 0;
          }
          else {
            address = user.number;
          }
          console.log('SELECT id \
          FROM accounts\
          WHERE addr = ' + address +';');
          connection.query(
            'SELECT id \
            FROM accounts\
            WHERE addr = ' + address +';',
            async function (err,row2) {
              if (row2.length == 0) { // If the phone number is not already taken
                // Hash password
                const salt = bcrypt.genSaltSync();
                const encryptedPassword = bcrypt.hashSync(user.password, salt);
                console.log(encryptedPassword);
                // If not already given, generate phone number
                console.log("address1:");
                console.log(address);
                if (address == 0) {
                  address = await newAddress();
                }
                console.log("address2:");
                console.log(address);
                // If username is not given, put default name
                let username;
                console.log(user.name);
                if (user.name == "") {
                  username = "익명의 삐삐";
                }
                else {
                  username = user.name;
                }
                // Insert into database
                connection.query(
                  'INSERT INTO accounts (id,addr,password,name) \
                  VALUES ("' + user.userid + '",'+ address + ',"' + encryptedPassword + '","' + username + '")', user, function (err, row2) {
                  if (err) throw err;
                });
                res.json({
                  success: true,
                  message: '회원가입에 성공했습니다! 입력한 정보로 로그인해주세요.'
                })
              }  
              else {
                res.json({
                  success: false,
                  message: '이미 존재하는 번호입니다.'
                })
              }              
            }
          );
          
      }
      else {
        res.json({
          success: false,
          message: '이미 존재하는 아이디입니다.'
        })
      }
    });
    
  }
);

function checkAddress(addr_check) {
  console.log("CheckAddress Entered");
  return new Promise(function(resolve, reject) {
    console.log('SELECT id FROM accounts WHERE addr='+addr_check+';');
    connection.query('SELECT id FROM accounts WHERE addr='+addr_check+';', function(err,row) {
      console.log(row);
      if (row.length==0) {
        console.log("condition entered");
        resolve(true);
      }
      else {
        resolve(false);
      }
    })
  });
}

async function newAddress() {
  do {
    var synth_address = 1200000000 + Math.floor(Math.random() * 100000000);
    console.log(1);
    var isUnique = await checkAddress(synth_address);
    console.log(2);
    console.log(isUnique);
  } 
  while (!isUnique);
  console.log(3);
  return synth_address;
}



var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})