<template>
  <div id="my-account" class="grid">
    <div id="my-profile">
      <img id="my-profile-photo" src="../assets/img/profile/0.png"/>
    </div>
    <div id="my-name">
      <p style="display: inline-block; align-self: flex-end;">{{userName}}</p>
    </div>
    <div id="my-address">
      <p style="display: inline-block; align-self: flex-top;">{{userAddr}}</p>
    </div>
  </div>
</template>

<script>
//import axios from 'axios'

export default {
  name: 'login',
  data() {
    return {
      userName: 'asdf',
      userAddr: 'ffff',
      userImg: ''
    }
  },
  methods: {
    myInfo: function () {
      this.$socket.emit('my-info',{ token: this.$cookie.get('user') });
    }
  },
  beforeMount() {
    this.myInfo();
  },
  created() {
    this.$socket.on('my-info', (result) => {
        if (!result.success) {
          if(result.verified) {
            alert("데이터베이스에 해당 아이디가 존재하지 않습니다.");
            this.$route.push('/login');
            return;
          }
          else {
            alert("토큰이 만료되었거나, 잘못된 접근입니다.");
            this.$router.push('../login');
            return;
          }
        }
        this.userName = result.name,
        this.userAddr = 'TEL: 012-'+("000" + Math.floor((result.addr-1200000000)/10000)).slice(-4)+'-'+("000" + result.addr%10000).slice(-4)
        this.userImg = result.prof_img;
      });
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
