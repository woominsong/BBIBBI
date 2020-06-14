<template>
  <div id="menu-bar">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <button v-on:click ="gotoMain()" style="cursor: pointer; height:101px; width:100%; border: none; margin-bottom: 1px; background-color: #FFF2CC"> 
      <MyAccount />
    </button>
    
    <div id="menu-buttons">
      <button v-on:click="component = 'friends-comp'" class="btn">친구 목록</button>
      <button v-on:click="component = 'chatroom-comp'" class="btn">채팅방</button>
      <button v-on:click="component = 'dictionary-comp'" class="btn">삐삐 사전</button>
    </div>
    <component :is="component" style="grid-row: 3;"></component>
  </div>
</template>

<script>
//import axios from 'axios'
import MyAccount from './MyAccount'


export default {
  name: 'app-menu',
  components: {
    'friends-comp': ()=>import('./FriendComponent'),
    'chatroom-comp': ()=>import('./ChatroomComponent'),
    'dictionary-comp': ()=>import('./DictionaryComponent'),
    MyAccount
  },
  data: function () {
    return {
      component: 'friends-comp'
    }
  },
  methods: {
    gotoMain: function(){
      if (this.$route.name != "add-friend") {
        this.$router.push('/add-friend');
      }
    }
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
.btn {
  width: 33.3%;
  height: 50px;
  background-color: #FFC000;
  font-size: 20px;
}
#menu-bar {
  height: 100px;
  margin: 0px;
  padding: 0px;
  grid-template-rows: 100px 50px 1fr;
}
#menu-buttons {
  background-color: #FFC000;
  grid-row: 2;
}
#my-account {
  grid-row: 1;
}
#my-profile {
  margin: 10px;
  width: 80px;
  height: 80px;
}
</style>
