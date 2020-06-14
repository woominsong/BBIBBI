<template>
  <div id="app">
    <!--button v-on:click="debug()">debug</button-->
    <router-view></router-view>
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
  },
  methods: {
    debug: function(){
      this.$socket.emit('clients');
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
