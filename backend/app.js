// backend/app.js
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
        origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// on은 받기, emit은 보내기
// 최소 실행됨
io.on("connection", (socket) => {
  console.log("connection");

  // [수신] 클라이언트로부터 메세지를 받음
  socket.on("init", (payload) => {
    console.log(payload);
  });

  // [수신] 클라이언트로부터 메세지를 받음
  socket.on("send message", (item) => {
     console.log(item.name + " : " + item.message);

     // [송신] 연결된 클라이언트 전체에 메세지를 보냄
    io.emit("receive message", { name: item.name, message: item.message });
    
  });
});

httpServer.listen((15000), function(){
  console.log('Http server listening on port 15000');
});