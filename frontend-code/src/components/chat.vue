<template>
    <div class="chat-wrapper">
        <div class="chat">
            <div class="chat-list" ref="chatBox">
                <p v-for="(msg, index) of msgs" :key="index">{{msg | msgTransform}}</p>
            </div>
            <div class="user-list">
                <div class="user-item" v-for="user of users" :key="user.userId">{{user.userName}}</div>
            </div>
        </div>
        <div class="send-chat">
            <input class="chat-input" type="text" v-model="inputMsg">
            <span class="send-btn" @click="enterHandler">发送</span>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import {host} from '../http/server.host';

export default {
    name: 'Chat',
    filters: {
        msgTransform: function (msg) {
            if (!msg) return ''
            let val = `${msg.userName}: ${msg.msg}`;
            return val;
        }
    },
    data() {
        return {
            userInfo: null,
            users: [],
            msgs: [],
            inputMsg: ''
        }
    },
    mounted() {
        // axios.get(host + '/api/users').then(res => {
        //     console.log(res);
        // })

        this.msgs = this.reStoreChatHistory();
        this.scrollToBottom();

        let myName = this.$route.query.userName;
        let preUserInfo = this.reStoreUserInfo();
        if (preUserInfo) {
            this.userInfo = {...preUserInfo, userName: myName};
            this.storeUserInfo(this.userInfo);
        }


        if (!this.socket) {
            const socket = io.connect(host);
            // 上下文vue实例
            socket.ctx = this;
            this.$store.commit('setSocket', socket)

            socket.on('connect message', user => {
                console.log('user connected ', user)
                let ctx = socket.ctx;

                let temUserInfo = {...user, ...(preUserInfo || {}), ...(this.userInfo || {}), userName: myName};
                ctx.userInfo = temUserInfo;
                socket.emit('join group', temUserInfo);
                ctx.storeUserInfo(temUserInfo);
            })

            socket.on('join group', user => {
                let ctx = socket.ctx;
                ctx.users.push(user);

                socket.emit('fetch group');
            })

            socket.on('left group', user => {
                console.log(user)
                let ctx = socket.ctx;
                let index = ctx.users.findIndex(e => e.userId === user.userId);
                ctx.users.splice(index, 1);
            })
            
            socket.on('chat message', msg => {
                console.log(msg)
                let ctx = socket.ctx;
                ctx.msgs.push(msg);

                ctx.scrollToBottom();

                ctx.storeChatHistory();
            })

            socket.on('fetch group', users => {
                console.log(users)
                let ctx = socket.ctx;
                ctx.users = users;
            })
        } else {
            let nowUser = this.userInfo || this.$store.state.socket.ctx.userInfo;
            this.$store.state.socket.ctx = this;
            this.userInfo = {...nowUser, userName: myName};
            this.socket.emit('join group', this.userInfo);
            this.socket.on('join group', user => {
                let ctx = this.socket.ctx;
                ctx.socket.emit('fetch group');
            })
            
        }
        
    },
    beforeDestroy() {
        this.storeChatHistory();
    },
    computed: {
        socket() {
            return this.$store.state.socket;
        }
    },
    methods: {
        scrollToBottom() {
            this.$nextTick(() => {
                this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
            })
        },
        storeChatHistory() {
            setTimeout(() => {
                window.localStorage.setItem('chat_history', JSON.stringify(this.msgs));
            }, 500);
        },
        reStoreChatHistory() {
            return JSON.parse(window.localStorage.getItem('chat_history') || '[]');
        },
        reStoreUserInfo() {
            return JSON.parse(window.localStorage.getItem('preUserInfo') || 'null');
        },
        storeUserInfo(userInfo) {
            return window.localStorage.setItem('preUserInfo', JSON.stringify(userInfo));
        },
        enterHandler(e) {
            let msg = this.inputMsg;
            msg = msg.replace('\n', '').replace('\r', '').trim();
            if (msg) {
                this.socket.emit('chat message', {
                    userId: this.userInfo.userId,
                    userName: this.userInfo.userName,
                    msg: msg,
                })

                this.inputMsg = '';

                this.storeChatHistory();
            }
        }
    }
}
</script>

<style>
body {
    overflow: hidden;
}
</style>

<style scoped>



.chat-wrapper {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.chat {
    flex: auto;
    display: flex;
    max-height: calc(100% - 60px);
}

.chat-list {
    flex: auto;
    max-height: 100%;
    overflow-y: auto;
    background-color: blanchedalmond;
}

.user-list {
    max-width: 24%;
    flex-basis: 24%;
    flex-grow: 0;
    background-color:lightgrey;
}

.user-item {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.send-chat {
    flex-basis: 60px;
    display: flex;
    align-items: center;
}

.chat-input {
    height: 100%;
    border: none;
    flex: auto;
    outline: none;
}

.send-btn {
    width: 60px;
    height: 60px;
    border-radius: 4px;
    background-color: darkgreen;
    text-align: center;
    line-height: 60px;
    color: white;
}
</style>