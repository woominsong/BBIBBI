<template>
  <div >
    <button class="btn" v-on:click="routeNewFriends()">+ 친구 추가</button>
    <ul>
      <li v-for="data in friends" v-bind:key="data.id" style="width: 100%; margin:0;">
        <button class="grid friend" v-on:click="clickFriend(data.id, data.name)">
          <div class="friend-profile">
            <img class="friend-profile-photo" src="../assets/img/profile/0.png"/>
          </div>
          <div class="friend-name">
            <p style="display: inline-block; align-self: flex-end;">{{data.name}}</p>
          </div>
          <div class="friend-address">
            <p style="display: inline-block; align-self: flex-top;">{{'TEL: 012-'+("000" + Math.floor((data.addr-1200000000)/10000)).slice(-4)+'-'+("000" + data.addr%10000).slice(-4)}}</p>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FriendComponent',
  methods: {
    initFriends: function () {
      axios.post('http://localhost:3000/get-friends', { 
        token: this.$cookie.get('user')
      })
      .then((result) => {
        console.log(result.data);
        if (!result.data.success) {
          if(result.data.verified) {
            alert(result.data.message);
            return;
          }
          else {
            alert("토큰이 만료되었거나, 잘못된 접근입니다.");
            this.$router.push('/login');
            return;
          }
        }
        else {
          this.friends = result.data.friends;
          console.log("Successfully updated friends.");
          console.log(this.friends);
        }
      })
      .catch(function (error) {
        alert(error)
      })
    },
    routeNewFriends: function () { 
      if (this.$route.name != "add-friend") {
        this.$router.push('/add-friend'); 
      }
    },
    clickFriend: function(fid, fname){
      //alert("friend id: "+fid+", name: "+fname);
      console.log(''+fid+''+fname);
      if (this.$route.path != "/chat/"+fid) {
        this.$router.push('/chat/'+fid);
      }
    }
  },
  data() {
    return {
      friends: []
    }
  },
  async beforeMount() {
    await this.initFriends();
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
  height: 81px;
  width: 100%;
  border: none;
  margin-bottom: 1px;
  background-color: #FFF2CC;
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
  margin-bottom: 5px;
}
</style>
