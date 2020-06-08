<template>
  <div class="hello">
    <p>This is the index page</p>
    <img id="logo" src="../assets/img/logo.png">
    <router-view></router-view>
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
  max-width: 50%;
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
</style>
