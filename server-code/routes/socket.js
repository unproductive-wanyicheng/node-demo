let userCount = 0;
let users = [];

module.exports = {
    connectHandler: (io, socket) => {
        console.log('a user connected');

        let uid = userCount++;

        let newUser = {
            userName: `user_${uid}`,
            userId: uid,
        };
        users.push({...newUser, socket});

        socket.emit('connect message',newUser)

        io.emit('join group', users.map(user => {
            return {
                userName: user.userName,
                userId: user.userId
            }
        }));

        socket.on('disconnect', () => {
            console.log('user disconnected');

            let index = users.findIndex(e => e.userId === uid);
            users.splice(index, 1);

            users.forEach(u => {
                let s = u.socket;
                s.emit('disconnect message', newUser)
            })
        });

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        }); 


    }
}