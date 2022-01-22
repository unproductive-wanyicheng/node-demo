<template>
    <div>
        <h1>hello vue demo</h1>
        <h2>小喻喻前端开发工程师</h2>
    </div>
</template>
<script>
import axios from 'axios';
import {host} from './http/server.host';
export default {
    name: 'App',
    mounted() {
        axios.get(host + '/api/users').then(res => {
            console.log(res);
        })
    }
}
</script>