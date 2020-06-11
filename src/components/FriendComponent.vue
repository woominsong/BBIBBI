<template>
  <div style="height:100vh-150px;">
    Friends
  </div>
</template>

<script>
export default {
  name: 'FriendComponent',
  methods: {
    initFriends: async function () {}
  },
  data() {
    return {
      friends: []
    }
  },
  beforeMount() {
    console.log("Friend Aiga!");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 0 0 0;
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
