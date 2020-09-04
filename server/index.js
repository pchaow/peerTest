const {PeerServer} = require('peer');
const fs = require('fs')
const peerServer = PeerServer({
    port: 9000, path: '/myapp',
    // ssl: {
    //     key: fs.readFileSync('./here.key'),
    //     cert: fs.readFileSync('./here.crt')
    // }
});
