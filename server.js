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


/************************
 *                      *
 *    DB Connection     *
 *                      *
 ************************/

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

/************************
 *                      *
 *   Request Handling   *
 *                      *
 ************************/

// Handle requests
app.get('/', function(req, res){
    res.send('Hello World');
});

// Signup request
app.post('/signup', function (req, res) {
    console.log("Begin signup.");
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
          connection.query(
            'SELECT id \
            FROM accounts\
            WHERE addr = ' + address +';',
            async function (err,row2) {
              if (row2.length == 0) { // If the phone number is not already taken
                // Hash password
                const salt = bcrypt.genSaltSync();
                const encryptedPassword = bcrypt.hashSync(user.password, salt);
                // If not already given, generate phone number
                if (address == 0) {
                  address = await newAddress();
                }
                // If username is not given, put default name
                let username;
                if (user.name == "") {
                  username = "익명의 삐삐";
                }
                else {
                  username = user.name;
                }
                // Insert into database
                connection.query(
                  'INSERT INTO accounts (id,addr,password,name,salt) \
                  VALUES ("' + user.userid + '",'+ address + ',"' + encryptedPassword + '","' + username + '","' + salt + '")', user, function (err, row2) {
                  if (err) throw err;
                });
                res.json({
                  success: true,
                  message: '회원가입에 성공했습니다! 입력한 정보로 로그인해주세요.'
                })
                console.log("Signup success. Welcome "+username+"!");
              }  
              else {
                res.json({
                  success: false,
                  message: '이미 존재하는 번호입니다.'
                })
                console.log("Signup fail: Phone number already exists.");
              }              
            }
          );
          
      }
      else {
        res.json({
          success: false,
          message: '이미 존재하는 아이디입니다.'
        })
        console.log("Signup fail: ID already exists.");
      }
    });
    
  }
);

// Login request
app.post('/login', async function (req, res) {
  console.log("Begin login.");
  const user = {
    'userid': req.body.id,
    'password': req.body.password
  };
  const salt = await getSalt(user.userid);
  if (salt == "") {
    res.json({
      success: false,
      message: '아이디와 비밀번호를 다시 확인하세요.'
    })
    console.log("Login fail.");
  }
  else {
    const encryptedPassword = bcrypt.hashSync(user.password, salt);
    connection.query(
      'SELECT id \
      FROM accounts \
      WHERE id = "' + user.userid + '"\
      AND password = "' + encryptedPassword +'";', 
      function (err, row) {
        if (row.length==0){ // If the (ID,password) pair does not exist
          res.json({
            success: false,
            message: '아이디와 비밀번호를 다시 확인하세요.'
          })
          console.log("Login fail.");
        }
        else {
          res.json({
            success: true
          })
          console.log("Login success. Welcome back, "+user.userid+"!");
        }
    });
  }  
}
);

/************************
 *                      *
 *   Helper Functions   *
 *                      *
 ************************/

// Check if the given address is already taken
function checkAddress(addr_check) {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT id FROM accounts WHERE addr='+addr_check+';', function(err,row) {
      if (row.length==0) {
        resolve(true);
      }
      else {
        resolve(false);
      }
    })
  });
}

// Create a new phone number
async function newAddress() {
  console.log("Creating new address...");
  do {
    var synth_address = 1200000000 + Math.floor(Math.random() * 100000000);
    var isUnique = await checkAddress(synth_address);
  } 
  while (!isUnique);
  console.log("New address 0"+synth_address+" created.");
  return synth_address;
}

// Query the salt for a certain id
function getSalt(id_check) {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT salt FROM accounts WHERE id="'+id_check+'";', function(err,row) {
      if (row.length==0) {
        resolve("");
      }
      else {
        resolve(""+row[0].salt);
      }
    })
  });
}

/************************
 *                      *
 *    Running Server    *
 *                      *
 ************************/

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})