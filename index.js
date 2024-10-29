const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Adjust the path if necessary
});

// Socket.IO logic
io.on('connection', (socket) => {
    socket.on('send-location', (data) => {
        io.emit('recive-location', { id: socket.id, ...data });
        console.log(data);
    });
    socket.on('disconnect', () => {
        io.emit('user-disconnect', socket.id);
    });
});

// Listen on port 3000 when running locally
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

// Export the server for Vercel
module.exports = (req, res) => {
    if (req.method === 'GET') {
        app(req, res);
    } else {
        res.status(405).send('Method Not Allowed');
    }
};
