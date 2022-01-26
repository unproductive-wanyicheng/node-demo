module.exports = {
    stores: {
        state: {
            socket: null
        },
        mutations: {
            setSocket(state, socket) {
                state.socket = socket;
            }
        }
    }
}