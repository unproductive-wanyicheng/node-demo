<template>
    <div class="chat-wrapper">
        <div class="chat">
            <div class="chat-list">
                <p v-for="(msg, index) of msgs" :key="index">{{msg | msgTransform}}</p>
            </div>
            <div class="user-list">
                <div v-for="user of users" :key="user.userId">{{user.userName}}</div>
            </div>
        </div>
        <div class="send-chat" contenteditable="true" ref="inputBox" @keyup.enter="enterHandler">
            
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
            socket: null,
            msgs: [],
            inputMsg: ''
        }
    },
    mounted() {
        // axios.get(host + '/api/users').then(res => {
        //     console.log(res);
        // })

        const socket = io.connect(host);
        this.socket = socket;

        socket.on('connect message', data => {
            console.log(data)
            this.userInfo = data; 
        })

        socket.on('join group', users => {
            this.users = users;
        })

        socket.on('disconnect message', user => {
            console.log(user)
            let index = this.users.findIndex(e => e.userId === user.userId);
            this.users.splice(index, 1);
        })
        
        socket.on('chat message', msg => {
            console.log(msg)
            this.msgs.push(msg);
        })
        
    },
    methods: {
        enterHandler(e) {
            let msg = this.$refs.inputBox.innerText;
            if (msg) {
                msg = msg.replace('\n', '').replace('\r', '').trim();
                this.socket.emit('chat message', {
                    userId: this.userInfo.userId,
                    userName: this.userInfo.userName,
                    msg: msg,
                })
                this.$refs.inputBox.innerText = '';
            }
        }
    }
}
</script>

<style scoped>
.chat-wrapper {
    width: 100wh;
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.chat {
    flex: auto;
    display: flex;
}

.chat-list {
    flex: auto;
    max-height: 100%;
    overflow-y: auto;
    background-color: blanchedalmond;
}

.user-list {
    flex-basis: 20%;
    background-color:lightgrey;
}

.send-chat {
    flex-basis: 200px;
    background-color: aquamarine;
}
</style>