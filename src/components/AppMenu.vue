<template>
  <div id="menu-bar">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <!--div id="my-account" style="display: table">
      <div style="display:table-row">
        <img id="my-profile" src="../assets/img/profile/0.png" style="display:table-cell;"/>
      </div>      
    </div-->
    <MyAccount/>
    <div id="menu-buttons">
      <button v-on:click="component = 'friends-comp'" class="btn">친구 목록</button>
      <button v-on:click="component = 'chatroom-comp'" class="btn">채팅방</button>
      <button v-on:click="component = 'dictionary-comp'" class="btn">삐삐 사전</button>
    </div>
    <component :is="component"></component>
  </div>
</template>

<script>
//import axios from 'axios'
/*import FriendComponent from './FriendComponent'
import AddressComponent from './ChatroomComponent'
import DictionaryComponent from './DictionaryComponent'*/
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
    /*myAcc: function () {
      if (this.user.id == "" || this.user.password == "") {
        alert("아이디와 비밀번호를 입력해주세요!");
        return;
      }
      axios.post('http://localhost:3000/login', { 
        id: this.user.id,
        password: this.user.password
      })
      .then((res) => {
        if (res.data.success == true) {
          this.$router.push('../corr') 
        }
        else {
          //alert(res.data.message);
        }
      })
      .catch(function (error) {
        alert(error)
      })
    }*/
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
  background-color: brown;
}
#menu-buttons {
  background-color: #FFC000;
}
#my-account {
  height: 100px;
}
#my-profile {
  margin: 10px;
  width: 80px;
  height: 80px;
}
</style>
