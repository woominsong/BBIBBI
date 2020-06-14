const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const socketio = require('socket.io');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));

// parse application/json
app.use(bodyParser.json());
app.use(cors());

// JWT-related variables
const jwt = require("jsonwebtoken");
const secretObj = require("./src/config/jwt");
const { default: Axios } = require('axios');

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

/************************
 *                      *
 *     Socket List      *
 *                      *
 ************************/

 ids = [];
 clients = [];

 // Initialize ids & clients array
 connection.query(
  'SELECT id from accounts;',
  function (err, row) {
    row.forEach(tuple => {
      ids.push(tuple.id);
      clients.push('');
    });
  }
);

/************************
 *                      *
 *   Request Handling   *
 *                      *
 ************************/

var server = app.listen(3000, function(){
  console.log("Express server has started on port 3000")
})

var io = socketio.listen(server);

io.sockets.on('connection', function (socket) {
  console.log('Socket ID : ' + socket.id + ', Connect');
  socket.emit('connected');

  socket.on('hello', function (data) {
    console.log('Socket working fine.');
    console.log(data);
    socket.emit('hello',{dddd: 'dddddddd'});
  });

  // Signup request
  socket.on('signup', (data) => {
    console.log("Begin signup.");
    const user = {
      'userid': data.id,
      'password': data.password,
      'name': data.name,
      'number': data.number
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
                socket.emit('signup',{
                  success: true,
                  message: '회원가입에 성공했습니다! 입력한 정보로 로그인해주세요.'
                });
                ids.push(user.userid);
                clients.push('');
                console.log("Signup success. Welcome "+username+"!");
              }  
              else {
                socket.emit('signup',{
                  success: false,
                  message: '이미 존재하는 번호입니다.'
                });
                console.log("Signup fail: Phone number already exists.");
              }              
            }
          );          
      }
      else {
        socket.emit('signup',{
          success: false,
          message: '이미 존재하는 아이디입니다.'
        });
        console.log("Signup fail: ID already exists.");
      }
    });
  });

  // Login request
  socket.on('login', async function (data) {
    console.log("Begin login.");
    const user = {
      'userid': data.id,
      'password': data.password
    };
    const salt = await getSalt(user.userid);
    if (salt == "") {
      socket.emit('login',{
        success: false,
        message: '아이디와 비밀번호를 다시 확인하세요.'
      });
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
            socket.emit('login',{
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
            socket.emit('login',{
              success: true,
              token: token,
              id: row[0].id,
              name: row[0].name,
              addr: row[0].addr,
              prof_img: row[0].prof_img
            })
            updateClient(row[0].id, socket.id);
            console.log("Login success. Welcome back, "+user.userid+"!");
          }
      });
    }  
  });
  
  // MyInfo request
  socket.on('my-info', async function (data) {
    console.log("MyInfo called.");
    userId = token2id(data.token);
    
    // Check for authentication
    if (!userId) {
      console.log("Invalid token");
      socket.emit('my-info',{
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
          socket.emit('my-info',{
            success: false,
            verified: true,
            message: "The given ID is not in the database."
          })
        }
        else {
          console.log("Data successfully sent in MyInfo.");;
          socket.emit('my-info',{
            success: true,
            name: row[0].name,
            addr: row[0].addr,
            prof_img: row[0].prof_img
          })
        }
    });
  });

  // AddFriend request
  socket.on('add-friend', async function (data) {
    console.log("AddFriend called.");
    userId = token2id(data.token);
    
    // Check for authentication
    if (!userId) {
      console.log("Invalid token");
      socket.emit('add-friend', {
        success: false,
        verified: false
      });
      return;
    }
  
    // Query friend account
    query = 'SELECT id FROM accounts ';
    if (data.id == '') {
      query = query + 'WHERE addr = "'+data.number+'";';
    }
    else if (data.number == '') {
      query = query + 'WHERE id = "'+data.id+'";';
    }
    else {
      query = query + 'WHERE addr = '+data.number+' AND id = "'+data.id+'";';
    }
    connection.query(
      query,
      function (err,row) {
        if (err) {
          console.log("[ERROR] DB Error");
          socket.emit('add-friend', {
            success: false,
            verified: true,
            message: "DB 에러가 발생했습니다."
          })
          return;
        }
        // Such user does not exist
        if (row.length == 0) {
          console.log("The given user is not in database.");;
          socket.emit('add-friend', {
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
              socket.emit('add-friend', {
                success: false,
                verified: true,
                message: "DB 에러가 발생했습니다."
              })
              return;
            }
            if (row1.length != 0) {
              console.log("The given user is already friended.");;
              socket.emit('add-friend', {
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
                  socket.emit('add-friend', {
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
                    socket.emit('add-friend', {
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
                        socket.emit('add-friend', {
                          success: false,
                          verified: true,
                          message: "DB 에러가 발생했습니다."
                        })
                        return;
                      }
                      socket.emit('add-friend', {
                        success: true
                      })
                    })
                  }
                  // Else, finished
                  else {
                    console.log("Well done!");
                    socket.emit('add-friend', {
                      success: true
                    })
                  }                
                });
              });
            }
          });
        }
    });
  });

  // GetFriends request
  socket.on('get-friends', async function (data) {
    console.log("MyInfo called.");
    userId = token2id(data.token);
    
    // Check for authentication
    if (!userId) {
      console.log("Invalid token");
      socket.emit('/get-friends', {
        success: false,
        verified: false
      });
      return;
    }

    // Query name, id, addr, and prof_img
    connection.query(
      'SELECT name, id, addr, prof_img\
      FROM accounts\
      WHERE id IN (\
      SELECT friend_id\
      FROM friends\
      WHERE my_id = "'+userId+'");',
      function (err,row) {
        // Return friends
        console.log("Friends successfully retreived");
        socket.emit('get-friends', {
          success: true,
          friends: row
        })
    });
  });

  // GetChatrooms request
  socket.on('get-chatrooms', async function (data) {
    console.log("MyInfo called.");
    userId = token2id(data.token);
    
    // Check for authentication
    if (!userId) {
      console.log("Invalid token");
      socket.emit('get-chatrooms', {
        success: false,
        verified: false
      });
      return;
    }

    // Query name, id, addr, and prof_img
    connection.query(
      'SELECT chatroom_id, name, latest_chat, latest_chat_id, prof_img\
      FROM chatrooms NATURAL JOIN (SELECT name, id AS p1_id, prof_img FROM accounts) a\
      WHERE p2_id = "'+userId+'"\
      UNION\
      SELECT chatroom_id, name, latest_chat, latest_chat_id, prof_img\
      FROM chatrooms NATURAL JOIN (SELECT name, id AS p2_id, prof_img FROM accounts) c\
      WHERE p1_id = "'+userId+'"\
      ORDER BY latest_chat_id DESC, chatroom_id DESC;',
      function (err,row) {
        // Return friends
        console.log("Chatrooms successfully retreived");
        socket.emit('get-chatrooms', {
          success: true,
          chatrooms: row
        })
    });
  });

  // GetChatroomId request (myId, friendid -> chatroomid)
  socket.on('get-chatroom-id', async function (data) {
    console.log("GetChatroomId called.");
    userId = token2id(data.token);
    
    // Check for authentication
    if (!userId) {
      console.log("Invalid token");
      socket.emit('get-chatroom-id', {
        success: false,
        verified: false
      });
      return;
    }

    // Query name, id, addr, and prof_img
    connection.query(
      'SELECT chatroom_id\
      FROM chatrooms\
      WHERE (p1_id = "'+userId+'" AND p2_id = "'+data.friend_id+'")\
      OR (p1_id = "'+data.friend_id+'" AND p2_id = "'+userId+'");',
      function (err,row) {
        // Return chatroom id
        console.log("Chatroom ID successfully retreived");
        socket.emit('get-chatroom-id', {
          success: true,
          chatroom_id: row[0].chatroom_id
        })
    });
  });

  // GetChatroomInfo request (myId, chatroomId -> name, addr)
  socket.on('get-chatroom-info', async function (data) {
    console.log("GetChatroomInfo called.");
    userId = token2id(data.token);
    
    // Check for authentication
    if (!userId) {
      console.log("Invalid token");
      socket.emit('get-chatroom-info', {
        success: false,
        verified: false
      });
      return;
    }
    // Query name, id, addr, and prof_img
    connection.query(
      'SELECT name, addr\
      FROM (SELECT p1_id AS id\
      from chatrooms\
      WHERE chatroom_id = '+data.chatroom_id+'\
      AND p2_id = "'+userId+'"\
      UNION\
      SELECT p2_id AS id\
      from chatrooms\
      WHERE chatroom_id = '+data.chatroom_id+'\
      AND p1_id = "'+userId+'") a NATURAL JOIN accounts;',
      function (err,row) {
        // Return chatroom id
        console.log("Chatroom Info successfully retreived");
        socket.emit('get-chatroom-info', {
          success: true,
          name: row[0].name,
          addr: row[0].addr
        })
    });
  });

  // GetChats request (myId, chatroomId -> [{send, content}])
  socket.on('get-chats', async function (data) {
    console.log("GetChats called.");
    userId = token2id(data.token);
    
    // Check for authentication
    if (!userId) {
      console.log("Invalid token");
      socket.emit('get-chats', {
        success: false,
        verified: false
      });
      return;
    }
    // Query send_id, content
    connection.query(
      'SELECT send_id="'+userId+'" as send, content FROM chats\
      WHERE chatroom_id = '+data.chatroom_id+'\
      ORDER BY chat_id;',
      function (err,row) {
        // Return chat
        console.log("Chat successfully retreived");
        socket.emit('get-chats', {
          success: true,
          chats: row
        })        
    });
  });

  // SendChat request
  socket.on('send-chat', async function (data) {
    console.log("GetChatroomInfo called.");
    userId = token2id(data.token);
    
    // Check for authentication
    if (!userId) {
      console.log("Invalid token");
      socket.emit('send-chat', {
        success: false,
        verified: false
      });
      return;
    }
    // Find the current chat_id
    connection.query(
      'SELECT max(chat_id) as chatId FROM chats;',
      function (err,row) {
        let new_chat_id;
        if (row[0].chatId == null) {
          new_chat_id = 0;
        }
        else {
          new_chat_id = row[0].chatId + 1;
        }
        // Insert new chat
        connection.query(
          'INSERT INTO chats(chatroom_id,chat_id,send_id,content) \
          VALUES ('+data.chatroom_id+','+new_chat_id+',"'+userId+'",'+data.message+');',
          function (err, row2) {
            // Update latest chat
            connection.query(
              'UPDATE chatrooms SET latest_chat = '+data.message+', latest_chat_id = '+new_chat_id+'\
              WHERE chatroom_id = '+data.chatroom_id+';',
              function (err, row3) {
                console.log("Chatroom successfully uploaded.");
                socket.emit('send-chat', {
                  success: true
                })
                // Find chat participants to update data
                connection.query(
                  'SELECT * FROM chatrooms\
                  WHERE chatroom_id = '+data.chatroom_id+';',
                  function (err, row4) {
                    if (row4.length == 0) {
                      console.log('[ERROR] Chatroom not in DB. This should not happen.');
                    }
                    else {
                      console.log('Send update-chat.');
                      io.to(getSocketId(row4[0].p1_id)).emit('update-chat', {chatroom_id: row4[0].chatroom_id});
                      io.to(getSocketId(row4[0].p2_id)).emit('update-chat', {chatroom_id: row4[0].chatroom_id});
                    }
                  }
                );
              }
            );
        });
    });
  });

  // Test token action
  socket.on('auth', function(data){
    id = jwt.verify(data.token, secretObj.secret).catch((err) => {
      console.log(err);
      socket.emit('auth', {res: false});
    })
    id = id.id;
    if (id) {
      socket.emit('auth', {res: true});
    }
    else {
      socket.emit('auth', {res: false});
    }
  });

  /************************
   *                      *
   *   Debug Functions    *
   *                      *
   ************************/

  socket.on('clients', function (req, res) {
    console.log("ids:");
    console.log(ids);
    console.log("clients:");
    console.log(clients);
  })
});

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

// Update socket client
function updateClient(id, sid) {
  clients[ids.indexOf(id)] = sid;
}

function getSocketId(id) {
  return clients[ids.indexOf(id)];
}

