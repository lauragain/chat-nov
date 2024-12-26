const http = require('node:http')

const server = http.createServer((req, res) => {
    res.end('Todo ok')
})

const PORT = process.env.PORT || 3000
server.listen(PORT)

// Config WS Server
const io = require('socket.io')(server, {
    cors: { origin: '*' }
})

io.on('connection', (socket) => {
    console.log('Se ha conectado un nuevo cliente')

    socket.broadcast.emit('chat_message_server', {
        username: 'INFO: ', message: 'Se ha conectado un nuevo usuario'
    })

    // Emitir a todos los clientes el número de clientes conectados
    io.emit('clients_online', io.engine.clientsCount)

    socket.on('chat_message_client', (data) =>{
        io.emit('chat_message_server', data)
    })

    socket.on('disconnect', () => {
        io.emit('chat_message_server', {
            username: 'INFO: ',
            message: 'Se ha desconectado un usuario'
        })
        io.emit('clients_online', io.engine.clientsCount)
    })
})