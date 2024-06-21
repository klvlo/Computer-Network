const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// 정적 파일 제공을 위한 middleware 설정
app.use(express.static("public"));

// 소켓 연결 설정
io.on("connection", (socket) => {
    console.log("새로운 사용자가 접속했습니다.");

    // 채팅 메시지 수신
    socket.on("chat message", (data) => {
        io.emit("chat message", data); // 모든 클라이언트에게 메시지 전송
    });

    // 파일 수신 및 전달
    socket.on("file", (data) => {
        io.emit("file", data); // 모든 클라이언트에게 파일 데이터 전송
    });
});

// 서버 시작
server.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
