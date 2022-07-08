const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

const mypath = path.join(__dirname,"/public");

app.use(express.static(mypath,{index:"front.html"}));


io.on("connection", function(socket){
   socket.on("sender-join",function(data){
      socket.join(data.uid);
   });
   socket.on("receiver-join",function(data){
    socket.join(data.uid);
    socket.in(data.sender_uid).emit("init",data.uid);
    });
   socket.on("file-meta",function(data){
    socket.in(data.uid).emit("fs-meta",data.metadata);
    });
    socket.on("fs-start",function(data){
        socket.in(data.uid).emit("fs-share",{});
    });
    socket.on("file-raw",function(data){
        socket.in(data.uid).emit("fs-share",data.buffer);
    });
});

server.listen(5000,()=>{
    console.log("port 5000 running");
});