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


// const http = require("http");
// const fs = require("fs");
// const path = require("path");
// const socketIo = require("socket.io");
//
// const httpServer = http.createServer();
// const io = socketIo(httpServer, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });
//
// const UPLOAD_DIR = path.join(__dirname, 'uploads');
//
// // 업로드 디렉토리가 존재하지 않으면 생성
// if (!fs.existsSync(UPLOAD_DIR)) {
//   fs.mkdirSync(UPLOAD_DIR);
// }
//
// io.on("connection", (socket) => {
//   console.log("connection");
//
//   // [수신] 클라이언트로부터 메세지를 받음
//   socket.on("init", (payload) => {
//     console.log(payload);
//   });
//
//   // [수신] 클라이언트로부터 메세지를 받음
//   socket.on("send message", (item) => {
//     console.log(item.name + " : " + item.message);
//
//     // [송신] 연결된 클라이언트 전체에 메세지를 보냄
//     io.emit("receive message", { name: item.name, message: item.message });
//   });
//
//   // [수신] 클라이언트로부터 파일을 받음
//   socket.on("send file", (file) => {
//     const filePath = path.join(UPLOAD_DIR, file.name);
//
//     // 파일 데이터 저장
//     fs.writeFile(filePath, file.data, (err) => {
//       if (err) {
//         console.error("File save error: ", err);
//         return;
//       }
//       console.log("Received file: ", file.name);
//
//       // [송신] 연결된 클라이언트 전체에 파일 정보를 보냄
//       io.emit("receive file", { name: file.name, path: filePath });
//     });
//   });
// });
//
// httpServer.listen(15000, function () {
//   console.log('Http server listening on port 15000');
// });
