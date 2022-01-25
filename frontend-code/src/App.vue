<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<script>
import axios from 'axios';
import {host} from './http/server.host';

export default {
    name: 'App',
    data() {
        return {
            userInfo: null,
            users: []
        }
    },
    mounted() {
        // axios.get(host + '/api/users').then(res => {
        //     console.log(res);
        // })
    }
}
</script>

<style>
html,body {
    margin: 0;
    padding: 0;
}
</style>