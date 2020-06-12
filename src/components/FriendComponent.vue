<template>
  <div style="height: calc(~'100vh - 50px');">
    <button class="btn" v-on:click="routeNewFriends()">+ 친구 추가</button>
    <ul>
      <li v-for="data in friends" v-bind:key="data.id" style="width: 100%; margin:0;">
        <div class="grid friend">
          <div class="friend-profile">
            <img class="friend-profile-photo" src="../assets/img/profile/0.png"/>
          </div>
          <div class="friend-name">
            <p style="display: inline-block; align-self: flex-end;">{{data.name}}</p>
          </div>
          <div class="friend-address">
            <p style="display: inline-block; align-self: flex-top;">{{data.address}}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'FriendComponent',
  methods: {
    initFriends: function () {},
    routeNewFriends: function () { 
      if (this.$route.name != "add-friend") {
        this.$router.push('/add-friend'); 
      }
    }
  },
  data() {
    return {
      friends: [{
        name: '홍길동',
        address: '012-1232-3434'
      },{
        name: '홍길동',
        address: '012-1232-3434'
      }]
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
  margin: 0 0px;
}
a {
  color: #42b983;
}
p {
  margin-bottom: 0;
}
.friend {
  height: 80px;
  border-bottom-width: 10px;
  border-color: red;
}
.friend-profile {
  grid-row: 1 / 3;
  grid-column: 1;
}
.friend-profile-photo {
  margin: 10px;
  width: 60px;
  height: 60px;
}
.friend-name {
  margin-left: 10px;
  margin-top: 10px;
  font-size: 22px;
  display: flex;
}
.friend-address {
  margin-left: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  display: flex;
}
.grid {
  display: grid;
  grid-template: 5fr 4fr / 80px 1fr;
}
.btn {
  background-color: #FFC000;
  font-size: 20px;
  margin-top: 10px;
  width: 300px;
}
</style>
