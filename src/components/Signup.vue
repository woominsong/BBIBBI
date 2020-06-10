<template>
  <div id="sign-up">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <div id="sign-up-form">
      <h3 id="sign-up-header">회원가입</h3>
      <p>* 표시가 된 항목은 필수항목입니다.</p>
      <div class="form-group">
        <input type="text" name="id" id="id" class="form-control" placeholder="* 아이디" v-model="user.id"/>
        <input type="password" name="password" id="password" class="form-control" placeholder="* 비밀번호" v-model="user.password"/>
        <input type="password" name="password-re" id="password-re" class="form-control" placeholder="* 비밀번호 확인" v-model="user.passwordRe"/>
        <input type="text" name="name" id="name" class="form-control" placeholder="이름" v-model="user.name"/>
        <input type="text" name="number" id="number" class="form-control" placeholder="원하는 번호 012-XXXX-XXXX" v-model="user.number"/>
      </div>
      <button v-on:click="signUp" class="btn">가입하기!</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

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
      let modifiedNumber = this.user.number.split("-").join("")
      let numError = !isNumeric(modifiedNumber);
      if (numError) {
        alert("전화번호 형식을 012-XXXX-XXXX로 맞추어 주세요.");
        return;
      }
      let phone_num = parseInt(modifiedNumber)
      if (phone_num < 1200000000 || phone_num >= 1300000000) {
        alert("전화번호 형식을 012-XXXX-XXXX로 맞추어 주세요.");
        return;
      }
      axios.post('http://localhost:3000/signUp', { 
        id: this.user.id,
        password: this.user.password
      })
      .then((res) => {
        if (res.data.success == true) {
          alert(res.data.message);
        }
        if (res.data.success == false) {
          alert(res.data.message);
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
