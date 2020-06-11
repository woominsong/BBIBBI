<template>
  <div id="my-account" class="grid">
    <div id="my-profile">
      <img id="my-profile-photo" src="../assets/img/profile/0.png"/>
    </div>
    <div id="my-name">
      <p style="display: inline-block; align-self: flex-end;">Name</p>
    </div>
    <div id="my-address">
      <p style="display: inline-block; align-self: flex-top;">Address</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
/*import FriendComponent from './FriendComponent'
import AddressComponent from './ChatroomComponent'
import DictionaryComponent from './DictionaryComponent'*/

export default {
  name: 'login',
  data: function () {
    return {
      user: {
        userName: '',
        userAddr: '',
        userImg: 1
      }
    }
  },
  methods: {
    myAcc: function () {
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
          alert(res.data.message);
        }
      })
      .catch(function (error) {
        alert(error)
      })
    }
  },
  beforeMount() {
    this.myAcc();
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
p {
  margin-bottom: 0;
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
  grid-row: 1 / 3;
  grid-column: 1;
}
#my-profile-photo {
  margin: 10px;
  width: 80px;
  height: 80px;
}
#my-name {
  margin-left: 10px;
  margin-top: 10px;
  font-size: 30px;
  display: flex;
}
#my-address {
  margin-left: 10px;
  margin-bottom: 10px;
  font-size: 15px;
  display: flex;
}
.grid {
  display: grid;
  grid-template: 3fr 2fr / 100px 1fr;
}
</style>
