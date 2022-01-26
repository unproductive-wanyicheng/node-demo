let userCount = 0;
let users = [];

module.exports = {
    connectHandler: (io, socket) => {
        console.log('a user connected');

        let uid = userCount++;

        let tmpUserInfo = {
            userName: `user_${uid}`,
            userId: uid,
        };

        socket.emit('connect message', tmpUserInfo)

        socket.on('join group', (userInfo) => {
            let preUserIndex = users.findIndex(u => u.userId === userInfo.userId);
            if (preUserIndex > -1) {
                let preUser = users[preUserIndex];
                io.emit('left group', {
                    userName: preUser.userName,
                    userId: preUser.userId
                });
                users.splice(preUserIndex, 1);
            }
            users.push({...userInfo, socket});
            socket.user = userInfo;
            io.emit('join group', userInfo);
        })

        socket.on('disconnect', () => {
            console.log('user disconnected');
            let user = socket.user;
            if (user) {
                let index = users.findIndex(e => e.userId === user.userId);
                if (index > -1) {
                    users.splice(index, 1);
                }

                io.emit('left group', user);
            }
        });

        socket.on('chat message', (msg) => {
            io.emit('chat message', msg);
        }); 

        socket.on('fetch group', () => {
            socket.emit('fetch group', users.map(u => {
                return {
                    userName: u.userName,
                    userId: u.userId,
                }
            }));
        }); 
    }
}