<template>
  <div id="app-main" style="padding: 0; width: 100vw; height: 100vh;">
    <div style="margin: 0px; padding: 0px; width: 100vw; height: 100vh; display: grid; grid-template-columns: 3fr 7fr;">
      <AppMenu id="app-menu" style="margin: 0px; padding: 0px;"></AppMenu>
      <keep-alive>
        <router-view id="contents" style="width: 100%" :key="$route.fullPath"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import AppMenu from '../components/AppMenu'

export default {
  name: 'AppMain',
  components: {
    AppMenu
  },
  methods: {
    checkAuth: function () {
      this.$socket.emit('auth', { token: this.$cookie.get('user') })
    }
  },
  created() {
    this.$socket.on('auth',(result) => {
      if (!result.res) {
        alert("token error");
        this.$router.push('/login');
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  max-width: 500px;
  /*height: 30%;*/
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
#app-main {
  height: 100%;
  overflow: auto;
  background-color: #FFF2CC;
  margin: 0px;
}
#app-menu {
  height: 100%;
  width: 30vw;
  min-width: 350px;
  grid-column: 1;
  margin: 0px;
  padding: 0px;
}
#contents {
  height: 100vh;
  width: 70vw;
  margin: 0px; 
  padding: 0px;
  grid-column: 2;
}
</style>
