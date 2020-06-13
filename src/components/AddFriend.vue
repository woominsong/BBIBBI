<template>
  <div class="add-friend">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <div id="log-in-form">
      <h3 id="log-in-header">친구 추가하기</h3>
      <img id="friend-img" src="../assets/img/friend-img.png">
      <input type="text" name="add-id" id="add-id" class="form-control" placeholder="아이디로 추가하기" v-model="user.id" v-on:keyup.enter="addFriend()"/>
      <input type="text" name="add-addr" id="add-addr" class="form-control" placeholder="전화번호로 추가하기 012-XXXX-XXXX" v-model="user.number" v-on:keyup.enter="addFriend()"/>
      <button v-on:click="addFriend" class="btn">추가하기</button>
    </div>
  </div>
</template>

<script>
function isNumeric(n) {
  return !isNaN(parseInt(n));
}

export default {
  name: 'HelloWorld',
  data() {
    return {
      user: {
        id: '',
        number: ''
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
      this.$socket.emit('add-friend',{ 
        token: this.$cookie.get('user'),
        id: this.user.id,
        number: phone_num
      })
    }
  },
  created() {
    this.$socket.on('add-friend', (result) => {
        if (!result.success) {
          if(result.verified) {
            alert(result.message);
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
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
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
.add-friend {
  background-color: white;
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
</style>
