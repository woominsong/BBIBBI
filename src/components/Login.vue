<template>
  <div id="log-in">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <div id="log-in-form">
      <h3 id="log-in-header">로그인</h3>
      <div class="form-group">
        <input type="text" name="id" id="id" class="form-control" placeholder="아이디" v-model="user.id"/>
        <input type="password" name="password" id="password" class="form-control" placeholder="비밀번호" v-model="user.password"/>
      </div>
      <button v-on:click="logIn" class="btn">로그인!</button>
    </div>
    <div id="page-link">
      <router-link to="signup">회원가입하러 가기</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'login',
  data: function () {
  return {
    user: {
      id: '',
      password: ''
    }}
  },
  methods: {
    logIn: function () {
      if (this.user.id == "" || this.user.password == "") {
        alert("아이디와 비밀번호를 입력해주세요!");
        return;
      }
      axios.post('http://localhost:3000/login', { 
        id: this.user.id,
        password: this.user.password
      })
      .then((res) => {
        if (res.data.success == true) {
          this.$cookie.set('user',res.data.token,'5m');
          this.$router.push('../main')
        }
        else {
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
#log-in {
  background-color: #FFF2CC;
}
#log-in-form {
  margin: auto;
  padding: 45px 0 0;
  width: 400px;
  color: #BF9000;
}
#log-in-header {
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
