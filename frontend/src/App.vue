<template>
  <div id="app">
    <!--img alt="Vue logo" src="./assets/logo.png"-->
    <!--component v-bind:is="component" msg="Welcome to Your Vue.js App"/-->
    <router-link to="/login">Go to Login</router-link>
    <router-link to="/signup">Go to Signup</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'
//import LogIn from './components/Login.vue'

export default {
  name: 'App',
  components: {
    //'hello-world': HelloWorld,
    //'log-in': LogIn
  },
  data() {
    return {
      component: 'log-in'
    }    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
