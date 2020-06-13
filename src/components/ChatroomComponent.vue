<template>
  <div style="height: calc(~'100vh - 50px');">
    <ul>
      <li v-for="data in chatrooms" v-bind:key="data.id" style="width: 100%; margin:0;">
        <button class="grid chatroom" v-on:click="clickChatroom(data.chatroom_id)">
          <div class="chatroom-profile">
            <img class="chatroom-profile-photo" src="../assets/img/profile/0.png"/>
          </div>
          <div class="chatroom-name">
            <p style="display: inline-block; align-self: flex-end;">{{data.name}}</p>
          </div>
          <div class="chatroom-address">
            <p style="display: inline-block; align-self: flex-top;">{{data.latest_chat==null ? "대화 기록이 없습니다." : "> "+data.latest_chat}}</p>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChatroomComponent',
  methods: {
    initChatrooms: function () {
      axios.post('http://localhost:3000/get-chatrooms', { 
        token: this.$cookie.get('user')
      })
      .then((result) => {
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
          this.chatrooms = result.data.chatrooms;
          console.log("Successfully updated chatrooms.");
        }
      })
      .catch(function (error) {
        alert(error)
      })
    },
    routeNewChatrooms: function () { 
      if (this.$route.name != "add-chatroom") {
        this.$router.push('/add-chatroom'); 
      }
    },
    clickChatroom: function(cid){
      if (this.$route.path != "/chat/"+cid) {
        this.$router.push('/chat/'+cid);
      }
    }
  },
  data() {
    return {
      chatrooms: []
    }
  },
  async beforeMount() {
    await this.initChatrooms();
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
.chatroom {
  height: 81px;
  width: 100%;
  border: none;
  margin-bottom: 1px;
  background-color: #FFF2CC;
}
.chatroom-profile {
  grid-row: 1 / 3;
  grid-column: 1;
}
.chatroom-profile-photo {
  margin: 10px;
  width: 60px;
  height: 60px;
}
.chatroom-name {
  margin-left: 10px;
  margin-top: 10px;
  font-size: 22px;
  display: flex;
}
.chatroom-address {
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
