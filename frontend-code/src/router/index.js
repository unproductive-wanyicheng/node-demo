const Chat = () => import('../components/chat.vue');
const Home = () => import('../components/home.vue');

module.exports = {
    routes: [
        { path: '/', component: Home },
        { path: '/chat', component: Chat },
    ]
}