<template>
  <div id="app-index">
    <div id="index-logo">
      <img id="logo" src="../assets/img/logo.png">
    </div>
    <router-view id="contents"></router-view>
  </div>
</template>

<script>

export default {
  name: 'AppIndex',
  props: {
    msg: String
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
#index-logo {
  background-color: #FFC000;
  padding: 30px;
}
#app-index {
  height: 100%;
  margin: auto;
  background-color: #FFF2CC;
  overflow: auto;
}
</style>
