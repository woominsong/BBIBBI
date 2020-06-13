<template>
  <div class="chatroom">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <div id="chat-heading">
      <h3 id="log-in-header">{{friend.name}}</h3>
      <p style="font-size: 20px; margin:0;">{{friend.number}}</p>
    </div>
    <div id="chat-content" style="border: 0;">
      <ul style="width: 100%; margin: auto; margin-bottom: 10px;">
      <li v-for="chat in chats" v-bind:key="chat.send_at" style="width: 100%; margin: 0px;">
        <div v-if="chat.send" class="left-p sent-message" style="display: grid; grid-template: 1fr / 1fr; margin: auto;">
          <p style="grid-column: 1;" class="right">{{chat.content}}</p>
        </div>
        <div v-else class="received-message" style="display: grid; grid-template: 1fr / 60px 1fr; margin: auto;">
          <img src="../assets/img/profile/0.png" style="grid-column: 1; width: 50px; margin: auto;"/>
          <p style="grid-column: 2;" class="left">{{chat.content}}</p>
        </div>
      </li>
    </ul>
    </div>
    <div id="chat-sender">
      <input type="text" name="msg-send" id="msg-send" class="form-control" placeholder="15자 이내의 숫자로 메시지를 입력하세요." v-model="msg_send" v-on:keyup.enter="sendMessage()"/>
      <button v-on:click="sendMessage()" class="btn">보내기</button>
    </div>
  </div>
</template>x

<script>
function isNumeric(n) {
  return !isNaN(parseInt(n));
}

export default {
  name: 'HelloWorld',
  data() {
    return {
      friend: {
        name: '',
        number: ''
      },
      chats: [],
      msg_send: '',
      chatroom_id: ''
    }
  },
  methods: {
    getChatroomInfo: function() {
      this.chatroom_id = this.$route.params.id;
      this.$socket.emit('get-chatroom-info', { 
        token: this.$cookie.get('user'),
        chatroom_id: this.chatroom_id
      });
    },
    getChats: function() {
      this.$socket.emit('get-chats', { 
        token: this.$cookie.get('user'),
        chatroom_id: this.chatroom_id
      })
    },
    sendMessage: function(){
      // Check is message is valid
      if (!isNumeric(this.msg_send)) {
        alert("15자 이내의 숫자를 입력해주세요.");
        return;
      }
      let message = parseInt(this.msg_send);
      if (message < 0 || message > 999999999999999) {
        alert("15자 이내의 숫자를 입력해주세요.");
        return;
      }
      // Send message
      this.$socket.emit('send-chat', { 
        token: this.$cookie.get('user'),
        message: message,
        chatroom_id: this.chatroom_id
      })
    }
  },
  mounted() {
    this.getChatroomInfo();
    this.getChats();
  },
  created() {
    this.$socket.on('get-chatroom-info', (result) => {
      if (!result.success) {
        if(result.verified) {
          alert(result.message);
          return;
        }
        else {
          alert("토큰이 만료되었거나, 잘못된 접근입니다.");
          this.$router.push('/login');
          return;
        }
      }
      else {
        this.friend.name = result.name;
        this.friend.number = '012-'+("000" + Math.floor((result.addr-1200000000)/10000)).slice(-4)+'-'+("000" + result.addr%10000).slice(-4);
        console.log("Successfully loaded chatroominfo.");
      }
    });

    this.$socket.on('get-chats', (result) => {
      if (!result.success) {
        if(result.verified) {
          alert(result.message);
          return;
        }
        else {
          alert("토큰이 만료되었거나, 잘못된 접근입니다.");
          this.$router.push('/login');
          return;
        }
      }
      else {
        this.chats = result.chats;
        console.log("Successfully retrieved chats.");
      }
    });

    this.$socket.emit('send-chat', (result) => {
      if (!result.success) {
        if(result.verified) {
          alert(result.message);
          return;
        }
        else {
          alert("토큰이 만료되었거나, 잘못된 접근입니다.");
          this.$router.push('/login');
          return;
        }
      }
      else {
        console.log("Successfully sent message.");
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin-top: 5px;
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
p.left {
  margin: auto;
  margin-left: 10px;
  font-size: 30px;
}
p.right {
  margin: auto;
  margin-right: 10px;
  font-size: 30px;
}
.chatroom {
  background-color: white;
  display: grid;
  grid-template: 100px 1fr 100px / 1fr;
}
#log-in-form {
  margin: auto;
  padding: 0;
  width: 450px;
  color: #BF9000;
}
#log-in-header {
  font-size: 45px;
}
.form-control{
  font-size: 25px;
  height: 50px;
  width: auto;
  border-color: #FFC000;
  border-width: 3px;
}
.btn {
  width: 140px;
  height: 50px;
  background-color: #FFC000;
  font-size: 25px;
  margin-left: 10px;
  margin-right: 10px;
  margin: auto; 
}
#page-link {
  margin-top: 5px;
  margin-bottom: 45px;
  color: #BF9000;
}
#chat-heading {
  /*background-color: red;*/
  height: 100%;
  width: 100%;
  border-bottom: solid;
  border-bottom-width: 3px;
  border-bottom-color: #BFBFBF;
  margin: auto;
  grid-row: 1 / 2;
  grid-column: 1;
}
#chat-content {
  grid-row: 2 / 3;
  grid-column: 1;
  width: 100%;
  margin: auto;
  margin-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
}
#chat-sender {
  grid-row: 3 / 4;
  grid-column: 1;
  display: grid;
  grid-template: 1fr / 1fr 160px; 
  margin: auto;
  width: 100%;
  height: 100%; 
  border-top: solid;
  border-top-color: #BFBFBF;
  border-top-width: 3px;
}
#msg-send {
  grid-column: 1;
  grid-row: 1;
  margin: auto; 
  margin-left: 10px;
  margin-right: 0px;
}
.sent-message {
  height: 60px;
}
.received-message {
  height: 60px;
}
</style>
