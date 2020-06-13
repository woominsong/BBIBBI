<template>
  <div id="sign-up">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <div id="sign-up-form">
      <h3 id="sign-up-header">회원가입</h3>
      <p>* 표시가 된 항목은 필수항목입니다.</p>
      <div class="form-group">
        <input type="text" name="id" id="id" class="form-control" placeholder="* 아이디" v-model="user.id" v-on:keyup.enter="signUp"/>
        <input type="password" name="password" id="password" class="form-control" placeholder="* 비밀번호" v-model="user.password" v-on:keyup.enter="signUp"/>
        <input type="password" name="password-re" id="password-re" class="form-control" placeholder="* 비밀번호 확인" v-model="user.passwordRe" v-on:keyup.enter="signUp"/>
        <input type="text" name="name" id="name" class="form-control" placeholder="이름" v-model="user.name" v-on:keyup.enter="signUp"/>
        <input type="text" name="number" id="number" class="form-control" placeholder="원하는 번호 012-XXXX-XXXX" v-model="user.number" v-on:keyup.enter="signUp"/>
      </div>
      <button v-on:click="signUp" class="btn">가입하기!</button>
    </div>
    <div id="page-link">
      <router-link to="login">로그인하러 가기</router-link>
    </div>
  </div>
</template>

<script>
//import axios from 'axios'

function isNumeric(n) {
  return !isNaN(parseInt(n));
}

export default {
  name: 'signup',
  data: function () {
  return {
    user: {
      id: '',
      password: '',
      passwordRe: '',
      name: '',
      number: ''
    }}
  },
  methods: {
    signUp: function () {
      if (this.user.id == "" || this.user.password == "" || this.user.passwordRe == "") {
        alert("필수 항목을 모두 입력해주세요.");
        return;
      }
      if (this.user.password != this.user.passwordRe) {
        alert("두 비밀번호가 일치하지 않습니다.");
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
      this.$socket.emit('signup',{ 
        id: this.user.id,
        password: this.user.password,
        name: this.user.name,
        number: phone_num
      });
    }
  },
  created() {
    this.$socket.on('signup', (result) => {
      alert(result.message);
      if (result.success == true) {
        this.$router.push('login');
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0 0 0;
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
#sign-up {
  background-color: #FFF2CC;
}
#sign-up-form {
  margin: auto;
  padding: 45px 0 0;
  width: 400px;
  color: #BF9000;
}
#sign-up-header {
  font-size: 45px;
}
.form-control{
  font-size: 25px;
  height: 50px;
  margin-top: 20px;
  border-color: #FFC000;
  border-width: 3px;
}
.btn {
  width: 300px;
  height: 50px;
  background-color: #FFC000;
  font-size: 25px;
}
#page-link {
  margin-top: 5px;
  margin-bottom: 45px;
  color: #BF9000;
}
</style>
