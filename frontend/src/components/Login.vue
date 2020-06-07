<template>
  <div>
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <h3>Log in</h3>
    <form method="POST" enctype="multipart/form-data">

      <div class="form-group">
        <label for="id">id</label>
        <input type="text" name="id" id="id" class="form-control" required/>
      </div>

      <div class="form-group">
        <label for="password">password</label>
        <input type="password" name="password" id="password" class="form-control" required/>
      </div>

      <button type="submit" class="btn btn-success">Log in</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  props: {
    msg: String
  }
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
