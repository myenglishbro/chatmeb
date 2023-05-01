import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import viewRouter from "./routes/views.router.js"
import {Server ,Socket} from "socket.io"

const PORT =  process.env.PORT|| 8080;

const app = express();

const server=app.listen(PORT,()=>{
    console.log(`Ejecutando Servidor en ${PORT}`)
})

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.static(__dirname+"/public"))


app.use ('/',viewRouter)

const io= new Server(server);
const messages=[]

io.on("connection",Socket=>{
    console.log("socket connected")
    Socket.on("message",data=>{
        messages.push(data);
        io.emit("messageLogs",messages)
    })
    Socket.on('authenticated', data =>{
        
        Socket.broadcast.emit('newUserConnected', data)

     })

})
