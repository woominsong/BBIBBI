<template>
  <div>
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <h3>Sign up</h3>
    <!--form method="POST" enctype="multipart/form-data"-->
    <div class="form-group">
      <label for="id">id</label>
      <input type="text" name="id" id="id" class="form-control" v-bind="user.id" required/>
    </div>

    <div class="form-group">
      <label for="password">password</label>
      <input type="password" name="password" id="password" class="form-control" v-bind="user.password" required/>
    </div>

    <button v-on:click="signUp" class="btn btn-success">Sign Up</button>
    <p>asdfasdfasdfasfdsa</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'signup',
  props: {
    msg: String
  },
  data: function () {
  return {
    user: {
      id: '',
      password: ''
    }}
  },
 methods: {
  signUp: function (event) {
    alert(event);
    axios.post('http://localhost:3000/signUp', { 
      user: this.user
    })
    .then((res) => {
      if (res.data.success == true) {
        alert(res.data.message);
        //this.$router.push('/login') 
      }
      if (res.data.success == false) {
        alert(res.data.message);
      }
    })
    .catch(function (error) {
      alert(error)
    })
  }}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
