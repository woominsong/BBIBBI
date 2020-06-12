<template>
  <div class="chatroom">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <div id="chat-heading">
      <h3 id="log-in-header">{{friend.name}}</h3>
      <p style="font-size: 20px;">{{friend.number}}</p>
    </div>
    <div id="chat-content" style="background-color:blue; border: 0;">
      asdf
    </div>
    <div id="chat-sender" style="background-color:red;">
      asdf
    </div>
  </div>
</template>

<script>
import axios from 'axios';

function isNumeric(n) {
  return !isNaN(parseInt(n));
}

export default {
  name: 'HelloWorld',
  data() {
    return {
      friend: {
        id: '',
        name: '친구 이름',
        number: '012-1212-3434'
      }
    }
  },
  methods: {
    addFriend: function() {
      if (this.user.id == "" && this.user.number == "") {
        alert("친구의 아이디 또는 전화번호를 입력해주세요.");
        return;
      }
      let phone_num = "";
      if (this.user.number != "") {
        let modifiedNumber = this.user.number.split("-").join("");
        if (!isNumeric(modifiedNumber)) {
          alert("전화번호 형식을 012-XXXX-XXXX로 맞추어 주세요.");
          return;
        }
        phone_num = parseInt(modifiedNumber)
        if (phone_num < 1200000000 || phone_num >= 1300000000) {
          alert("전화번호 형식을 012-XXXX-XXXX로 맞추어 주세요.");
          return;
        }
      }
      axios.post('http://localhost:3000/add-friend', { 
        token: this.$cookie.get('user'),
        id: this.user.id,
        number: phone_num
      })
      .then((result) => {
        console.log(result.data);
        if (!result.data.success) {
          if(result.data.verified) {
            alert(result.data.message);
            return;
          }
          else {
            alert("토큰이 만료되었거나, 잘못된 접근입니다.");
            this.$router.push('/login');
            return;
          }
        }
        else {
          alert("추가되었습니다.");
          console.log("Successfully added friend.");
        }
      })
      .catch(function (error) {
        alert(error)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.chatroom {
  background-color: white;
  display: grid;
  grid-template: 89px 1fr 150px / 1fr;
}
#log-in-form {
  margin: auto;
  padding: 0;
  width: 450px;
  color: #BF9000;
}
#log-in-header {
  font-size: 45px;
}
.form-control{
  font-size: 25px;
  height: 50px;
  width: 450px;
  margin-top: 20px;
  border-color: #FFC000;
  border-width: 3px;
}
.btn {
  margin-top: 20px;
  width: 140px;
  height: 50px;
  background-color: #FFC000;
  font-size: 25px;
}
#page-link {
  margin-top: 5px;
  margin-bottom: 45px;
  color: #BF9000;
}
#friend-img {
  margin: 30px;
  width: 250px;
}
#chat-heading {
  /*background-color: red;*/
  border-bottom: solid;
  border-bottom-width: 3px;
  border-bottom-color: #BFBFBF;
  margin-bottom: 0px;
  grid-row: 1 / 2;
  grid-column: 1;
}
#chat-content {
  grid-row: 2 / 3;
  grid-column: 1;
}
#chat-sender {
  grid-row: 3 / 4;
  grid-column: 1;
}
</style>
