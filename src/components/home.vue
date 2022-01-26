<template>
    <div>
        <h1>项目列表</h1>
        <ul>
            <li><input type="text" :placeholder="placeholder" v-model="username"></li>
            <li><router-link :to="{path: '/chat', query: {userName: realName}}" >聊天室</router-link></li>
        </ul>
    </div>
</template>
<script>

export default {
    name: 'Home',
    data() {
        return {
            username: ""
        }
    },
    mounted() {
      let preName = localStorage.getItem('chat_username') || 'someone';
      if (preName) {
          this.username = preName;
      }  
    },
    beforeDestroy() {
        localStorage.setItem('chat_username', this.username)
    },
    computed: {
        placeholder() {
            return `请输入聊天用户名: someone`
        },
        realName() {
            return this.username ? this.username : 'someone'
        }
    }
}
</script>