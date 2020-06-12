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

// JWT-related variables
const jwt = require("jsonwebtoken");
const secretObj = require("./src/config/jwt");

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

// Test token action
app.post('/auth', function(req, res){
  id = jwt.verify(req.body.token, secretObj.secret).catch((err) => {
    console.log(err);
    res.send(false);
  })
  id = id.id;
  if (id) {
    res.send(true);
  }
  else {
    res.send(false);
  }
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
                // Select random profile photo
                profile = Math.floor(Math.random()*4);
                // Insert into database
                connection.query(
                  'INSERT INTO accounts (id,addr,password,name,salt,prof_img) \
                  VALUES ("' + user.userid + '",'+ address + ',"' + encryptedPassword + '","' + username + '","' + salt + '",'+ profile +')', user, function (err, row2) {
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
      'SELECT id, name, addr, prof_img \
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
          let token = jwt.sign({
              id: row[0].id
            },
            secretObj.secret ,    // 비밀 키
            {
              expiresIn: '1h'
            }
          )
          res.json({
            success: true,
            token: token,
            id: row[0].id,
            name: row[0].name,
            addr: row[0].addr,
            prof_img: row[0].prof_img
          })
          console.log("Login success. Welcome back, "+user.userid+"!");
        }
    });
  }  
}
);

// MyInfo request
app.post('/my-info', async function (req, res) {
  console.log("MyInfo called.");
  userId = token2id(req.body.token);
  
  // Check for authentication
  if (!userId) {
    console.log("Invalid token");
    res.json({
      success: false,
      verified: false
    });
    return;
  }

  // Query name, addr, and prof_img
  connection.query(
    'SELECT name, addr, prof_img\
    FROM accounts\
    WHERE id="'+userId+'";',
    function (err,row) {
      // Something has gone wrong with the DB. This case shouldn't happen.
      if (row.length == 0) {
        console.log("[ERROR] ID "+userId+" is not in the database.");;
        res.json({
          success: false,
          verified: true,
          message: "The given ID is not in the database."
        })
      }
      else {
        console.log("Data successfully sent in MyInfo.");;
        res.json({
          success: true,
          name: row[0].name,
          addr: row[0].addr,
          prof_img: row[0].prof_img
        })
      }
  });
}
);

// MyInfo request
app.post('/add-friend', async function (req, res) {
  console.log("AddFriend called.");
  userId = token2id(req.body.token);
  
  // Check for authentication
  if (!userId) {
    console.log("Invalid token");
    res.json({
      success: false,
      verified: false
    });
    return;
  }

  // Query friend account
  query = 'SELECT id FROM accounts ';
  if (req.body.id == '') {
    query = query + 'WHERE addr = "'+req.body.number+'";';
  }
  else if (req.body.number == '') {
    query = query + 'WHERE id = "'+req.body.id+'";';
  }
  else {
    query = query + 'WHERE addr = '+req.body.number+' AND id = "'+req.body.id+'";';
  }
  console.log(query);
  connection.query(
    query,
    function (err,row) {
      if (err) {
        console.log("[ERROR] DB Error");
        res.json({
          success: false,
          verified: true,
          message: "DB 에러가 발생했습니다."
        })
        return;
      }
      // Such user does not exist
      if (row.length == 0) {
        console.log("The given user is not in database.");;
        res.json({
          success: false,
          verified: true,
          message: "존재하지 않는 사용자입니다."
        })
      }
      else {
        friend_id = row[0].id;
        console.log("User "+friend_id+" found!");
        // Check if already added as friends
        connection.query('SELECT * FROM friends WHERE my_id="'+userId+'" AND friend_id="'+friend_id+'";',
        function (err, row1) {
          if (err) {
            console.log("[ERROR] DB Error");
            res.json({
              success: false,
              verified: true,
              message: "DB 에러가 발생했습니다."
            })
            return;
          }
          if (row1.length != 0) {
            console.log("The given user is already friended.");;
            res.json({
              success: false,
              verified: true,
              message: "이미 친구로 추가된 사용자입니다."
            })
          } 
          else {
            console.log("You are not already friends.");
            // Check if a chatroom already exists
            connection.query('SELECT chatroom_id FROM chatrooms WHERE p1_id="'+friend_id+'" AND p2_id="'+userId+'";',
            async function (err, row2) {
              if (err) {
                console.log("[ERROR] DB Error");
                res.json({
                  success: false,
                  verified: true,
                  message: "DB 에러가 발생했습니다."
                })
                return;
              }
              var friend_chatroom_id;
              if (row2.length == 0) { // If there is no existing chatroom
                console.log("Chatroom does not exist.");
                friend_chatroom_id = await newChatroomId();
              }
              else {
                console.log("Chatroom does exist.");
                friend_chatroom_id = row2[0].chatroom_id;
              }
              // Add friend
              connection.query('INSERT INTO friends(my_id,friend_id,chatroom_id) VALUES ("'+userId+'","'+friend_id+'","'+friend_chatroom_id+'");',
              function (err, row3) {
                if (err) {
                  console.log("[ERROR] DB Error");
                  res.json({
                    success: false,
                    verified: true,
                    message: "DB 에러가 발생했습니다."
                  })
                  return;
                }
                // If chatroom not added yet, add chatroom
                if (row2.length == 0){
                  console.log("Add chatroom.");
                  connection.query('INSERT INTO chatrooms(chatroom_id,p1_id,p2_id) VALUES ("'+friend_chatroom_id+'","'+userId+'","'+friend_id+'");',
                  function (err, row4){
                    if (err) {
                      console.log("[ERROR] DB Error");
                      res.json({
                        success: false,
                        verified: true,
                        message: "DB 에러가 발생했습니다."
                      })
                      return;
                    }
                    res.json({
                      success: true
                    })
                  })
                }
                // Else, finished
                else {
                  console.log("Well done!");
                  res.json({
                    success: true
                  })
                }                
              });
            });
          }
        });
      }
  });
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

// Create a new chatroom id
function newChatroomId() {
  return new Promise(function(resolve, reject) {
    connection.query('SELECT max(chatroom_id) AS m FROM chatrooms;', function(err,row) {
      if (row.length==0) {
        resolve(0);
      }
      else {
        resolve(row[0].m+1);
      }
    })
  });
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

// Verify token
function token2id(tk) {
  if (tk == 'init') {
    return false;
  }
  res = jwt.verify(tk, secretObj.secret);
  if (res) {
    return res.id;
  }
  else {
    return null;
  }
  
}

/************************
 *                      *
 *    Running Server    *
 *                      *
 ************************/

var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000")
})