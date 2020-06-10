<template>
  <div id="app-index">
    <div id="index-logo">
      <img id="logo" src="../assets/img/logo.png">
    </div>
    <router-view id="contents"></router-view>
    <div id="page-link">
      <router-link v-bind:to="link" v-on:click="switchLink">{{linkMessage}}</router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'AppIndex',
  props: {
    msg: String
  },
  data () {
    return {
      link: '/signup',
      linkMessage: '회원가입하러 가기'
    }
  },
  methods: {
    switchLink: function () {
      if (this.link == '/signup') {
        alert("signup link pressed");
        this.link = '/login'
        this.linkMessage = "로그인하러 가기"
      } else {
        alert("login link pressed");
        this.link = '/signup'
        this.linkMessage = '회원가입하러 가기'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  max-width: 80%;
  max-height: 30%;
}
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
#index-logo {
  background-color: #FFC000;
  padding: 30px;
}
#app-index {
  height: 100%;
  background-color: #FFF2CC;
  overflow: auto;
}
#page-link {
  margin-top: 5px;
  margin-bottom: 45px;
  color: #BF9000;
}
</style>
