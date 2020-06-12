<template>
  <div id="app">
    <!--img alt="Vue logo" src="./assets/logo.png"-->
    <!--component v-bind:is="component" msg="Welcome to Your Vue.js App"/-->
    <!--router-link to="/index">Go to Login</router-link-->
    <!--router-link to="/signup">Go to Signup</router-link-->
    <router-view></router-view>
    <!--Index></Index-->
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
    //Index
  },
  data() {
    return {
    }    
  }
}
</script>

<style>
@font-face {
  font-family: "DungGeunMo";
  src: url("./assets/fonts/DungGeunMo.ttf") format('truetype');
}

* {
  font-family: "DungGeunMo";
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  height: 100vh;
  width: 100vw;
}
</style>
