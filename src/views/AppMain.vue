<template>
  <div id="app-main" style="display: table">
    <div style="display: table-row; padding: 0px;">
      <AppMenu id="app-menu" style="margin: 0px; padding: 0px;"></AppMenu>
      <router-view id="contents"></router-view>
    </div>    
  </div>
</template>

<script>
import AppMenu from '../components/AppMenu'
import axios from 'axios'

export default {
  name: 'AppMain',
  components: {
    AppMenu
  },
  methods: {
    checkAuth: function () {
      axios.post('http://localhost:3000/auth', { token: this.$cookie.get('user') }).then(result => {
        if (!result) {
          alert("token error");
          this.$router.push('../');
        }
      })
    }
  },
  async beforeMount() {
    //this.checkAuth();
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
  overflow: scroll;
  background-color: #FFF2CC;
  margin: 0px;
}
#app-menu {
  height: 100%;
  width: 30vw;
  min-width: 350px;
  display: table-cell;
  margin: 0px;
  padding: 0px;
}
#contents {
  height: 100px;
  width: 80vw;
  display: table-cell;
}
</style>
