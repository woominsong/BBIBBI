var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signUp', function (req, res) {
  console.log("signup called");
  const user = {
    'userid': req.body.user.id,
    'password': req.body.user.password
  };
  connection.query('SELECT id FROM test_t WHERE userid = "' + user.userid + '"', function (err, row) {
    if (row[0] == undefined){ //  동일한 아이디가 없을경우,
      const salt = bcrypt.genSaltSync();
      const encryptedPassword = bcrypt.hashSync(user.password, salt);
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

module.exports = router;
